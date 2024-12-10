// import type { paths } from "@/types/backend/backendApi"
import type { Writable } from "../../types/utils"

type Method = "get" | "post" | "put" | "patch" | "delete"
type FormMethod = "post" | "put" | "patch"

type OneOfObjectsOrUnknown<FirstObject, SecondObject> =
  FirstObject extends object
  ? FirstObject
  : SecondObject extends object
  ? SecondObject
  : unknown

type RequestPath<
  Paths,
  Path extends string,
  RequestUrlWithPrefix = `/api/v1${Path}/`,
> = RequestUrlWithPrefix extends keyof Paths
  ? Paths[RequestUrlWithPrefix]
  : unknown

export type OpenApiForm<
  Paths,
  Path extends string,
  RequestMethod extends FormMethod = "post",
  ActualPath = RequestPath<Paths, Path>,
  ActualOpenApiForm = ActualPath extends {
    [key in RequestMethod]: {
      requestBody: { content: { "multipart/form-data": unknown } }
    }
  }
  ? ActualPath[RequestMethod]["requestBody"]["content"]["multipart/form-data"]
  : unknown,
> = Writable<ActualOpenApiForm>

export type FormOrOpenApiForm<
  Form,
  Paths,
  Path extends string,
  RequestMethod extends FormMethod = "post",
  ActualOpenApiForm = OpenApiForm<Paths, Path, RequestMethod>,
> = OneOfObjectsOrUnknown<Form, ActualOpenApiForm>

export type OpenApiQuery<
  Paths,
  Path extends string,
  ActualPath = RequestPath<Paths, Path>,
  ActualQuery = ActualPath extends {
    get: { parameters: { query?: object } }
  }
  ? ActualPath["get"]["parameters"]["query"]
  : unknown,
> = Exclude<ActualQuery, undefined>

export type QueryOrOpenApiQuery<
  Query,
  Paths,
  Path extends string,
  ActualOpenApiQuery = OpenApiQuery<Paths, Path>,
> = OneOfObjectsOrUnknown<Query, ActualOpenApiQuery>

export type OpenApiResponse<
  Paths,
  Path extends string,
  ResponseMethod extends Method = "get",
  Code extends number = 200,
  ActualPath = RequestPath<Paths, Path>,
> = ActualPath extends {
  [keyResponseMethod in ResponseMethod]: {
    responses: { [key in Code]: { content: { "application/json": unknown } } }
  }
}
  ? ActualPath[ResponseMethod]["responses"][Code]["content"]["application/json"]
  : unknown

export type ResponseOrOpenApiResponse<
  Response,
  Paths,
  Path extends string,
  ResponseMethod extends Method = "get",
  Code extends number = 200,
  ActualOpenApiResponse = OpenApiResponse<Paths, Path, ResponseMethod, Code>,
> = OneOfObjectsOrUnknown<Response, ActualOpenApiResponse>

// type Response = FormOrOpenApiForm<unknown, paths, "/market/products/">
// "/market/products/"
// "/crm/feedback/"
