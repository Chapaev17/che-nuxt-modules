import { FetchError, ofetch } from "ofetch"
import { reactive } from "vue"

import type { FormErrors, RequestStatus } from "@/types"

const HTTP_STATUS_BAD_REQUEST = 400

type UseFirstCheApiUpdateParameters = Parameters<typeof useApiUpdate>[0]
type UseCheApiUpdateBaseParameters<
  FetchUrl extends string = string,
  Method = "patch" | "post" | "put",
> = Omit<UseFirstCheApiUpdateParameters, "url"> & {
  method: Method
  url: FetchUrl
}

interface UseUpdateParameters {
  method?: "patch" | "post" | "put"
  url: string
}

interface FormState {
  id: string
  updateErrors?: FormErrors
  updateRequestErrors?: string
  updateStatus: RequestStatus
}

export function useApiUpdate<
  UpdateData extends Record<string, unknown> | unknown = Record<
    string,
    unknown
  >,
  Response extends Record<string, unknown> | unknown = Record<string, unknown>,
>(parameters: UseUpdateParameters) {
  const forms = reactive<FormState[]>([])

  function getOrCreateFormState(id: string): FormState {
    let formState = forms.find((state) => state.id === id)
    if (!formState) {
      formState = {
        id,
        updateErrors: undefined,
        updateRequestErrors: undefined,
        updateStatus: "idle",
      }
      forms.push(formState)
    }
    return formState
  }

  async function update(fetchParameters: {
    data: Partial<UpdateData>
    id: string
    onResponse?: (response: Response) => void
  }): Promise<Response | undefined> {
    if (!fetchParameters?.data) {
      console.error("Update data is required")
      return undefined
    }

    const formState = getOrCreateFormState(fetchParameters.id)

    try {
      formState.updateStatus = "pending"
      formState.updateRequestErrors = undefined
      formState.updateErrors = undefined

      const url = `${parameters.url}${fetchParameters.id}/`

      const fetchUpdate = ofetch.create({
        body: fetchParameters.data,
        method: parameters.method || "patch",
      })

      const response = await fetchUpdate<Response>(url)
      formState.updateStatus = "success"

      // Remove successful request from forms array
      const index = forms.findIndex((state) => state.id === fetchParameters.id)
      if (index !== -1) {
        forms.splice(index, 1)
      }

      if (fetchParameters.onResponse) {
        fetchParameters.onResponse(response)
      }

      return response
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.status === HTTP_STATUS_BAD_REQUEST) {
          formState.updateErrors = error.data as FormErrors
        }
        formState.updateRequestErrors = `Update request failed`
        formState.updateStatus = "error"
      }
      return undefined
    }
  }

  function reset(id: string) {
    const formState = getOrCreateFormState(id)
    formState.updateStatus = "idle"
    formState.updateRequestErrors = undefined
    formState.updateErrors = undefined
  }

  function updateStatus(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.updateStatus
  }

  function updateRequestErrors(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.updateRequestErrors
  }

  function updateErrors(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.updateErrors
  }

  return {
    reset,
    update,
    updateErrors,
    updateRequestErrors,
    updateStatus,
  }
}

export type { UseCheApiUpdateBaseParameters }
