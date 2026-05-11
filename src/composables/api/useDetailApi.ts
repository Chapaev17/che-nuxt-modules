import { ofetch } from "ofetch"
import { ref } from "vue"

import type { RequestStatus } from "@/types"

type UseFirstCheDetailApiParametersMethod = "get" | "post"

type UseFirstCheDetailApiParameters = Parameters<typeof useDetailApi>[0]
type UseCheDetailApiBaseParameters<
  FetchUrl extends string,
  Method extends UseFirstCheDetailApiParametersMethod,
> = Omit<UseFirstCheDetailApiParameters, "method" | "url"> & {
  method?: Method
  url?: FetchUrl
}

export function useDetailApi<ResponseData = unknown>(parameters?: {
  method?: UseFirstCheDetailApiParametersMethod
  url?: string
}) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref<RequestStatus>("idle")
  const fetchDataErrors = ref()

  async function fetchData(fetchParameters?: {
    id?: string
    onResponse?: (parameters: { responseData: ResponseData }) => void
    onResponseError?: () => void
    url?: string
  }) {
    fetchDataStatus.value = "pending"
    data.value = undefined
    fetchDataErrors.value = undefined

    const valideUrl = fetchParameters?.url
      ? fetchParameters.url
      : fetchParameters?.id && parameters?.url
        ? `${parameters.url}/${fetchParameters.id}/`
        : undefined

    if (valideUrl === undefined) {
      console.error("URL for fetching API details not found")
      return
    }

    // await sleep(7000)
    try {
      await ofetch(valideUrl, {
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
    } catch {
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

  return { data, fetchData, fetchDataErrors, fetchDataStatus, reset }
}

export type {
  UseCheDetailApiBaseParameters,
  UseFirstCheDetailApiParameters,
  UseFirstCheDetailApiParametersMethod,
}
