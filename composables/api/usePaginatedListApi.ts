// import { sleep } from "../../utils"

import type { AsyncDataRequestStatus } from "#app"

import useListApi from "./useListApi"

type UseFirstCheListApiParameters = Parameters<typeof useListApi>[0]
export type UseCheListApiBaseParameters<
  FetchUrl extends string = string,
  Query extends object | unknown = unknown,
  ValideQuery extends object = Query extends object ? Query : {},
> = Omit<UseFirstCheListApiParameters, "url"> & {
  url: FetchUrl
  query?: ValideQuery
}

export default function usePaginatedListApi<
  ResponseData extends {}[] = {}[],
  Query = unknown,
>(parameters: { url: string; query?: Query }) {
  const { data, fetchDataStatus, fetchDataErrors, fetchData, reset } =
    useListApi<ResponseData, Query>(parameters)

  return { data, fetchDataStatus, fetchDataErrors, fetchData, reset }
}
