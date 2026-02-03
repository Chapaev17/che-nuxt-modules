// import { sleep } from "../../utils"

import useListApi from "./useListApi"

type UseFirstPaginatedCheListApiParameters = Parameters<typeof useListApi>[0]
export type UseChePaginatedListApiBaseParameters<
  FetchUrl extends string = string,
  Query extends object | unknown = unknown,
  ValideQuery extends object = Query extends object ? Query : {},
> = Omit<UseFirstPaginatedCheListApiParameters, "url"> & {
  url: FetchUrl
  query?: ValideQuery
}

type PaginatedResponse<ResponseData> = {
  count: number
  next: string | null
  previous: string | null
  results: ResponseData
}

export default function usePaginatedListApi<
  ResponseData = {}[],
  Query = unknown,
>(parameters: { url: string; query?: Query }) {
  const {
    data: paginatedData,
    fetchDataStatus,
    fetchDataErrors,
    fetchData: fetchDataBase,
    reset: resetBase,
  } = useListApi<PaginatedResponse<ResponseData>, Query>(parameters)

  const data = ref<ResponseData>()
  const count = ref<number>()
  const nextPageUrl = ref<string | null>()
  const previousPageUrl = ref<string | null>()

  const showNextPageLoader = computed(
    () => fetchDataStatus.value !== "success" || isString(nextPageUrl.value),
  )

  const showFooter = computed(
    () =>
      // Show footer when page first opening from ssr or wehen all pages loaded.
      fetchDataStatus.value === "idle" ||
      (fetchDataStatus.value === "success" && !nextPageUrl.value),
  )

  async function fetchData(parameters: Parameters<typeof fetchDataBase>[0]) {
    count.value = undefined
    nextPageUrl.value = undefined
    previousPageUrl.value = undefined
    await fetchDataBase(parameters)
    setDataFromResponse()
  }

  async function fetchNextPage() {
    if (nextPageUrl.value && fetchDataStatus.value !== "pending") {
      await fetchDataBase({ url: nextPageUrl.value })
      setDataFromResponse(true)
    }
  }

  function setDataFromResponse(add: boolean = false) {
    if (
      fetchDataStatus.value === "success" &&
      paginatedData.value !== undefined
    ) {
      if (add) {
        if (isArray(data.value) && isArray(paginatedData.value.results))
          data.value?.push(...paginatedData.value.results)
        else console.error(`Response from ${parameters.url} url is not Array`)
      } else {
        data.value = paginatedData.value?.results
      }
      count.value = paginatedData.value.count
      nextPageUrl.value = paginatedData.value.next
      previousPageUrl.value = paginatedData.value.previous
    }
  }

  function reset() {
    count.value = undefined
    nextPageUrl.value = undefined
    previousPageUrl.value = undefined
    data.value = undefined
    resetBase()
  }

  return {
    data,
    count,
    nextPageUrl,
    previousPageUrl,
    fetchDataStatus,
    fetchDataErrors,
    showNextPageLoader,
    showFooter,
    fetchData,
    fetchNextPage,
    reset,
  }
}
