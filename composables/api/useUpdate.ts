import type { AsyncDataRequestStatus } from "#app"
import { ref } from "vue"
import { ofetch } from "ofetch"

type UseUpdateParameters<Response = unknown> = {
  url: string
  method?: "patch" | "post" | "put"
  onSuccess?: (response: Response) => void
}

type UpdateErrors = {
  [key: string]: string[] | undefined
  non_field_errors?: string[]
}

export default function useUpdate<
  Response = unknown,
  UpdateData extends Record<string, any> = Record<string, any>,
>(parameters: UseUpdateParameters<Response>) {
  const updateStatus = ref<AsyncDataRequestStatus>("idle")
  const updateRequestErrors = ref<string>()
  const updateErrors = ref<UpdateErrors>()

  async function update(fetchParameters?: {
    id?: string
    data: Partial<UpdateData>
    onResponse?: (response: Response) => void
  }) {
    if (!fetchParameters?.data) {
      console.error("Update data is required")
      return
    }

    try {
      updateStatus.value = "pending"
      updateRequestErrors.value = undefined
      updateErrors.value = undefined

      const url = fetchParameters.id
        ? `${parameters.url}/${fetchParameters.id}/`
        : parameters.url

      const fetchUpdate = ofetch.create({
        method: parameters.method || "patch",
        body: fetchParameters.data,
        async onResponseError({ response }) {
          if (response.status === 400) {
            updateErrors.value = response._data as UpdateErrors
          }
          updateRequestErrors.value = `Update request failed`
          updateStatus.value = "error"
        },
        onResponse({ response }) {
          if (fetchParameters.onResponse) {
            fetchParameters.onResponse(response._data)
          }
          if (parameters.onSuccess) {
            parameters.onSuccess(response._data)
          }
          updateStatus.value = "success"
        },
      })

      await fetchUpdate(url)
    } catch (catchedError) {
      updateStatus.value = "error"
      updateRequestErrors.value = "Update failed"
    }
  }

  function reset() {
    updateStatus.value = "idle"
    updateRequestErrors.value = undefined
    updateErrors.value = undefined
  }

  return {
    updateStatus,
    updateRequestErrors,
    updateErrors,
    update,
    reset,
  }
}
