import type { paths } from "./testApiSchemaTypes"
import type { Writable } from "../../types/utilities"

type Method = "delete" | "get" | "patch" | "post" | "put"
type FormMethod = "patch" | "post" | "put"

type GET_RESPONSE_SUCCESS_CODE = 200

type OneOfObjectsOrUnknown<FirstObject, SecondObject> =
  FirstObject extends object
    ? FirstObject
    : SecondObject extends object
      ? SecondObject
      : unknown

type RequestPath<
  Paths,
  Path extends string,
  RequestUrlWithPrefix = `/api/v1${Path}`,
> = RequestUrlWithPrefix extends keyof Paths
  ? Paths[RequestUrlWithPrefix]
  : unknown

type OpenApiForm<
  Paths,
  Path extends string,
  RequestMethod extends FormMethod = "post",
  ActualPath = RequestPath<Paths, Path>,
  MethodSchema = RequestMethod extends keyof ActualPath
    ? ActualPath[RequestMethod]
    : never,
  RequestBody = MethodSchema extends { requestBody?: unknown }
    ? NonNullable<MethodSchema["requestBody"]>
    : unknown,
  ActualOpenApiForm = RequestBody extends {
    content: {
      "multipart/form-data": unknown
    }
  }
    ? RequestBody["content"]["multipart/form-data"]
    : unknown,
> = Writable<ActualOpenApiForm>

type FormOrOpenApiForm<
  Form,
  Paths,
  Path extends string,
  RequestMethod extends FormMethod = "post",
  ActualOpenApiForm = OpenApiForm<Paths, Path, RequestMethod>,
> = OneOfObjectsOrUnknown<Form, ActualOpenApiForm>

type OpenApiQuery<
  Paths,
  Path extends string,
  ActualPath = RequestPath<Paths, Path>,
  ActualQuery = ActualPath extends {
    get: { parameters: { query?: object } }
  }
    ? ActualPath["get"]["parameters"]["query"]
    : unknown,
> = Exclude<ActualQuery, undefined>

type QueryOrOpenApiQuery<
  Query,
  Paths,
  Path extends string,
  ActualOpenApiQuery = OpenApiQuery<Paths, Path>,
> = OneOfObjectsOrUnknown<Query, ActualOpenApiQuery>

type OpenApiResponse<
  Paths,
  Path extends string,
  ResponseMethod extends Method | undefined = "get",
  Code extends number = GET_RESPONSE_SUCCESS_CODE,
  ValideResponseMethod extends Method = ResponseMethod extends Method
    ? ResponseMethod
    : "get",
  ActualPath = RequestPath<Paths, Path>,
> =
  ActualPath extends Record<
    ValideResponseMethod,
    {
      responses: Record<Code, { content: { "application/json": unknown } }>
    }
  >
    ? ActualPath[ValideResponseMethod]["responses"][Code]["content"]["application/json"]
    : unknown

type ResponseOrOpenApiResponse<
  Response,
  Paths,
  Path extends string,
  ResponseMethod extends Method | undefined = "get",
  Code extends number = GET_RESPONSE_SUCCESS_CODE,
  ActualOpenApiResponse = OpenApiResponse<Paths, Path, ResponseMethod, Code>,
> = OneOfObjectsOrUnknown<Response, ActualOpenApiResponse>

type ResponseOrOpenApiPaginatedResponseResults<
  Response,
  Paths,
  Path extends string,
  ResponseMethod extends Method | undefined = "get",
  Code extends number = GET_RESPONSE_SUCCESS_CODE,
  ActualResponseOrOpenApiResponse = ResponseOrOpenApiResponse<
    Response,
    Paths,
    Path,
    ResponseMethod,
    Code
  >,
> = ActualResponseOrOpenApiResponse extends { results: object }
  ? ActualResponseOrOpenApiResponse["results"]
  : unknown

// type Response = ResponseOrOpenApiResponse<
//   unknown,
//   paths,
//   `/gallery/${string}/`
// >
// "/market/products/"
// "/crm/feedback/"
// type Response = ResponseOrOpenApiPaginatedResponseResults<
//   unknown,
//   paths,
//   `/blog/posts-pagination/`
// >

//
// type TestPutResponse = ResponseOrOpenApiResponse<
//   unknown,
//   paths,
//   "/english-words/banned-words/333/",
//   "patch"
// >

type TestPostForm = FormOrOpenApiForm<
  unknown,
  paths,
  `/english-words/banned-words/`,
  "post"
>

type TestForm = FormOrOpenApiForm<
  unknown,
  paths,
  `/english-words/banned-words/123/`,
  "patch"
>
export type {
  FormOrOpenApiForm,
  OpenApiForm,
  OpenApiQuery,
  OpenApiResponse,
  QueryOrOpenApiQuery,
  ResponseOrOpenApiPaginatedResponseResults,
  ResponseOrOpenApiResponse,
}
