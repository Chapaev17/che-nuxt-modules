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
      fetchDataErrors.value = `Fetch data error: ${message}`
      fetchDataErrors.value = "error"
    }
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}

export function useDetailApi<ResponseData = {}>(parameters: { url: string }) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref()
  const fetchDataErrors = ref()

  async function fetchData(fetchParameters: { id: string }) {
    try {
      data.value = undefined
      fetchDataStatus.value = "pending"
      const response: ResponseData = await $fetch(
        `${parameters.url}/${fetchParameters.id}/`,
      )
      data.value = response
      fetchDataStatus.value = "success"
    } catch (catchedError) {
      const message = isString(catchedError)
        ? catchedError
        : isError(catchedError)
          ? catchedError.message
          : ""
      fetchDataErrors.value = `Fetch data error: ${message}`
      fetchDataErrors.value = "error"
    }
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData }
}
