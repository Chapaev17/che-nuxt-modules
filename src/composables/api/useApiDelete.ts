import { FetchError, ofetch } from "ofetch"
import { reactive } from "vue"

import type { FormErrors, RequestStatus } from "@/types"

const HTTP_STATUS_BAD_REQUEST = 400

type UseFirstCheApiDeleteParameters = Parameters<typeof useApiDelete>[0]
type UseCheApiDeleteBaseParameters<FetchUrl extends string = string> = Omit<
  UseFirstCheApiDeleteParameters,
  "url"
> & {
  url: FetchUrl
}

interface UseDeleteParameters {
  url: string
}

interface FormState {
  id: string
  destroyErrors?: FormErrors
  destroyRequestErrors?: string
  destroyStatus: RequestStatus
}

export function useApiDelete<Response = unknown>(
  parameters: UseDeleteParameters,
) {
  const forms = reactive<FormState[]>([])

  function getOrCreateFormState(id: string): FormState {
    let formState = forms.find((state) => state.id === id)
    if (!formState) {
      formState = {
        id,
        destroyErrors: undefined,
        destroyRequestErrors: undefined,
        destroyStatus: "idle",
      }
      forms.push(formState)
    }
    return formState
  }

  async function destroy(fetchParameters: {
    id: string
    onResponse?: (response: Response) => void
  }): Promise<Response | undefined> {
    const formState = getOrCreateFormState(fetchParameters.id)

    try {
      formState.destroyStatus = "pending"
      formState.destroyRequestErrors = undefined
      formState.destroyErrors = undefined

      const url = `${parameters.url}${fetchParameters.id}/`

      const response = await ofetch<Response>(url, { method: "DELETE" })
      formState.destroyStatus = "success"

      const index = forms.findIndex(
        (state) => state.id === fetchParameters.id,
      )
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
          formState.destroyErrors = error.data as FormErrors
        }
        formState.destroyRequestErrors = `Destroy request failed`
        formState.destroyStatus = "error"
      }
      return undefined
    }
  }

  function reset(id: string) {
    const formState = getOrCreateFormState(id)
    formState.destroyStatus = "idle"
    formState.destroyRequestErrors = undefined
    formState.destroyErrors = undefined
  }

  function destroyStatus(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.destroyStatus
  }

  function destroyRequestErrors(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.destroyRequestErrors
  }

  function destroyErrors(id: string) {
    const formState = getOrCreateFormState(id)
    return formState.destroyErrors
  }

  return {
    destroy,
    destroyErrors,
    destroyRequestErrors,
    destroyStatus,
    reset,
  }
}

export type { UseCheApiDeleteBaseParameters }
