// import { sleep } from "../../utils"

import type { AsyncDataRequestStatus } from "#app"

// import { FetchError } from "ofetch"

type UseFirstCheListApiParameters = Parameters<typeof useListApi>[0]
export type UseCheListApiBaseParameters<
  FetchUrl extends string = string,
  Query extends object | unknown = unknown,
  ValideQuery extends object = Query extends object ? Query : {},
> = Omit<UseFirstCheListApiParameters, "url"> & {
  url: FetchUrl
  query?: ValideQuery
}

export default function useListApi<
  ResponseData = {}[],
  Query = unknown,
>(parameters: { url: string; query?: Query }) {
  const data = ref<ResponseData>()
  const fetchDataStatus = ref<AsyncDataRequestStatus>("idle")
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
      await $fetch(fetchParameters?.url || parameters.url, {
        query: commonQuery,
        onResponse({ response }) {
          if (response.status === 200) {
            data.value = response._data as ResponseData
            fetchDataStatus.value = "success"
          }
        },
      })
    } catch (catchedError) {
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

  return { data, fetchDataStatus, fetchDataErrors, fetchData, reset }
}
