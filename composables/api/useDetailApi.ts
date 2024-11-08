import type { AsyncDataRequestStatus } from "#app"

export default function useDetailApi<ResponseData = {}>(parameters?: {
  url?: string
  method?: "get" | "post"
}) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref<AsyncDataRequestStatus>("idle")
  const fetchDataErrors = ref()

  async function fetchData(fetchParameters?: {
    id?: string
    url?: string
    onResponse?: (parameters: { responseData: ResponseData }) => void
    onResponseError?: () => void
  }) {
    fetchDataStatus.value = "pending"
    data.value = undefined
    fetchDataErrors.value = undefined

    const valideUrl = fetchParameters?.url
      ? fetchParameters.url
      : fetchParameters?.id && parameters?.url
        ? `${parameters.url}/${fetchParameters.id}/`
        : parameters?.url
          ? parameters.url
          : undefined

    if (valideUrl === undefined) {
      console.error("URL for fetching API details not found")
      return
    }

    await $fetch(valideUrl, {
      method: parameters?.method || "get",
      onResponse({ response }) {
        data.value = response._data as ResponseData
        fetchDataStatus.value = "success"
        if (fetchParameters?.onResponse)
          fetchParameters.onResponse({ responseData: response._data })
      },
      async onResponseError() {
        fetchDataErrors.value = `Fetch data error`
        fetchDataStatus.value = "error"
        if (fetchParameters?.onResponseError) fetchParameters.onResponseError()
        console.error(`Error fetch api detail for url: ${valideUrl}`)
      },
    })
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}
