import { ofetch } from "ofetch"
import { ref } from "vue"

import type { RequestStatus } from "@/types"

type UseFirstCheListApiParameters = Parameters<typeof useListApi>[0]
export type UseCheListApiBaseParameters<
  FetchUrl extends string = string,
  Query extends object | unknown = unknown,
  ValideQuery extends object = Query extends object ? Query : object,
> = Omit<UseFirstCheListApiParameters, "url"> & {
  query?: ValideQuery
  url: FetchUrl
}

export function useListApi<
  ResponseData = unknown[],
  Query = unknown,
>(parameters: { query?: Query; url: string }) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref<RequestStatus>("idle")
  const fetchDataErrors = ref()
  const query = ref<Query | undefined>(parameters.query)

  async function fetchData(fetchParameters?: { query?: Query; url?: string }) {
    fetchDataStatus.value = "pending"
    data.value = undefined
    fetchDataErrors.value = undefined
    let commonQuery = {}
    if (query.value) commonQuery = { ...commonQuery, ...query.value }
    if (fetchParameters?.query)
      commonQuery = { ...commonQuery, ...fetchParameters.query }

    // await sleep(7000)
    try {
      await ofetch(fetchParameters?.url || parameters.url, {
        onResponse({ response }) {
          if (response.status === 200) {
            data.value = response._data as ResponseData
            fetchDataStatus.value = "success"
          }
        },
        query: commonQuery,
      })
    } catch {
      // if (catchedError instanceof FetchError) { }
      fetchDataErrors.value = `Fetch data error`
      fetchDataStatus.value = "error"
      console.error(`Error fetch api detail for url: ${parameters.url}`)
    }
  }

  function reset() {
    data.value = undefined
    fetchDataStatus.value = "idle"
    fetchDataErrors.value = undefined
  }

  return { data, fetchData, fetchDataErrors, fetchDataStatus, reset }
}
