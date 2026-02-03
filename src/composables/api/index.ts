import useDetailApi from "./useDetailApi"
import useFormApi from "./useFormApi"
import useListApi from "./useListApi"
import usePaginatedListApi from "./usePaginatedListApi"

export { useDetailApi, useFormApi, useListApi, usePaginatedListApi }
export type {
  OpenApiForm,
  FormOrOpenApiForm,
  OpenApiQuery,
  QueryOrOpenApiQuery,
  OpenApiResponse,
  ResponseOrOpenApiResponse,
  ResponseOrOpenApiPaginatedResponseResults,
} from "./types"

export type { UseCheListApiBaseParameters } from "./useListApi"
export type {
  UseCheDetailApiBaseParameters,
  UseFirstCheDetailApiParametersMethod,
} from "./useDetailApi"
export type { UseChePaginatedListApiBaseParameters } from "./usePaginatedListApi"
