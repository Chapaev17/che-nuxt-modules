export function useListApi<ListData = {}[]>(parameters: { url: string }) {
  const data = ref<ListData>()
  const fetchDataStatus = ref()
  const fetchDataErrors = ref()

  async function fetchData() {
    try {
      fetchDataStatus.value = "pending"
      const response: ListData = await $fetch(`${parameters.url}/`)
      data.value = response
      fetchDataStatus.value = "success"
    } catch (catchedError) {
      const message = isString(catchedError)
        ? catchedError
        : isError(catchedError)
          ? catchedError.message
          : ""
      fetchDataErrors.value = `Delete track error: ${message}`
      fetchDataErrors.value = "error"
    }
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}
