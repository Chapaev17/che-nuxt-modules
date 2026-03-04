import { FetchError, ofetch } from "ofetch"
import { ref } from "vue"

import type { RequestStatus } from "@/types"

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

interface UpdateErrors {
  [key: string]: string[] | undefined
  non_field_errors?: string[]
}

export function useApiUpdate<
  UpdateData extends Record<string, unknown> | unknown = Record<
    string,
    unknown
  >,
  Response extends Record<string, unknown> | unknown = Record<string, unknown>,
>(parameters: UseUpdateParameters) {
  const updateStatus = ref<RequestStatus>("idle")
  const updateRequestErrors = ref<string>()
  const updateErrors = ref<UpdateErrors>()

  // eslint-disable-next-line max-statements
  async function update(fetchParameters?: {
    data: Partial<UpdateData>
    id?: string
    onResponse?: (response: Response) => void
  }): Promise<Response | undefined> {
    if (!fetchParameters?.data) {
      console.error("Update data is required")
      return undefined
    }

    try {
      updateStatus.value = "pending"
      updateRequestErrors.value = undefined
      updateErrors.value = undefined

      const url = fetchParameters.id
        ? `${parameters.url}${fetchParameters.id}/`
        : parameters.url

      const fetchUpdate = ofetch.create({
        body: fetchParameters.data,
        method: parameters.method || "patch",
      })

      const response = await fetchUpdate<Response>(url)
      updateStatus.value = "success"
      return response
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.status === HTTP_STATUS_BAD_REQUEST) {
          updateErrors.value = error.data as UpdateErrors
        }
        updateRequestErrors.value = `Update request failed`
        updateStatus.value = "error"
      }
      return undefined
    }
  }

  function reset() {
    updateStatus.value = "idle"
    updateRequestErrors.value = undefined
    updateErrors.value = undefined
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
