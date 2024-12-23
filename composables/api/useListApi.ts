// import { sleep } from "../../utils"

import type { AsyncDataRequestStatus } from "#app"

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
  // const query = ref<Query>({} as Query)

  async function fetchData(fetchParameters?: { query?: Query }) {
    fetchDataStatus.value = "pending"
    data.value = undefined
    fetchDataErrors.value = undefined

    await $fetch(parameters.url, {
      query: fetchParameters?.query || undefined,
      onResponse({ response }) {
        if (response.status === 200) {
          data.value = response._data as ResponseData
          fetchDataStatus.value = "success"
        }
      },
      async onResponseError() {
        fetchDataErrors.value = `Fetch data error`
        fetchDataStatus.value = "error"
        console.error(`Error fetch api detail for url: ${parameters.url}`)
      },
    })
  }

  function reset() {
    data.value = undefined
    fetchDataStatus.value = "idle"
    fetchDataErrors.value = undefined
  }

  return { data, fetchDataStatus, fetchDataErrors, fetchData, reset }
}
