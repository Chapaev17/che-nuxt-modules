import type { AsyncDataRequestStatus } from "#app"

export default function useListApi<ListData = {}[]>(parameters: {
  url: string
}) {
  const data = ref<ListData>()
  const fetchDataStatus = ref<AsyncDataRequestStatus>("idle")
  const fetchDataErrors = ref()

  async function fetchData() {
    try {
      fetchDataStatus.value = "pending"
      data.value = undefined
      fetchDataErrors.value = undefined
      const response: ListData = await $fetch(`${parameters.url}/`)
      data.value = response
      fetchDataStatus.value = "success"
    } catch (catchedError) {
      const message = isString(catchedError)
        ? catchedError
        : isError(catchedError)
          ? catchedError.message
          : ""
      fetchDataErrors.value = `Fetch data error: ${message}`
    }
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}
