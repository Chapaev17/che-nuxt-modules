import type { AsyncDataRequestStatus } from "#app"
// import { sleep } from "../../utils"

export type UseFirstCheDetailApiParametersMethod = "get" | "post"

type UseFirstCheDetailApiParameters = Parameters<typeof useListApi>[0]
export type UseCheDetailApiBaseParameters<
  FetchUrl extends string,
  Method extends UseFirstCheDetailApiParametersMethod,
> = Omit<UseFirstCheDetailApiParameters, "url" | "method"> & {
  url?: FetchUrl
  method?: Method
}

export default function useDetailApi<ResponseData = {}>(parameters?: {
  url?: string
  method?: UseFirstCheDetailApiParametersMethod
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

    // await sleep(7000)
    try {
      await $fetch(valideUrl, {
        method: parameters?.method || "get",
        onResponse({ response }) {
          if (response.status === 200) {
            data.value = response._data as ResponseData
            fetchDataStatus.value = "success"
            if (fetchParameters?.onResponse)
              fetchParameters.onResponse({ responseData: response._data })
          }
        },
      })
    } catch (catchedError) {
      // if (catchedError instanceof FetchError) { }
      fetchDataErrors.value = `Fetch data error`
      fetchDataStatus.value = "error"
      if (fetchParameters?.onResponseError) fetchParameters.onResponseError()
      console.error(`Error fetch api detail for url: ${valideUrl}`)
    }
  }

  function reset() {
    data.value = undefined
    fetchDataStatus.value = "idle"
    fetchDataErrors.value = undefined
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData, reset }
}
