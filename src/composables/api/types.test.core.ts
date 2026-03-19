/**
 * Core type tests for validating type definitions
 * Contains type-level tests 1-10 to ensure the type utilities work correctly
 */

import type {
  FormOrOpenApiForm,
  OpenApiForm,
  OpenApiQuery,
  OpenApiResponse,
  QueryOrOpenApiQuery,
  ResponseOrOpenApiPaginatedResponseResults,
  ResponseOrOpenApiResponse,
} from "./types"
import type { HTTP_CREATED, HTTP_OK, MockPaths } from "./types.test.mock"

// Test 1: OpenApiForm type
type TestForm = OpenApiForm<MockPaths, "/api/v1/test/", "post">
// Should be: { name: string; file?: File }

// Test 2: FormOrOpenApiForm type
type TestFormOrOpenApi = FormOrOpenApiForm<
  { customField: string },
  MockPaths,
  "/api/v1/test/",
  "post"
>
// Should be: { customField: string } (custom form takes precedence)

type TestFormOrOpenApiDefault = FormOrOpenApiForm<
  unknown,
  MockPaths,
  "/api/v1/test/",
  "post"
>
// Should be: { name: string; file?: File } (OpenAPI form when custom is unknown)

// Test 3: OpenApiQuery type
type TestQuery = OpenApiQuery<MockPaths, "/api/v1/test/">
// Should be: { page?: number; ordering?: string }

// Test 4: QueryOrOpenApiQuery type
type TestQueryOrOpenApi = QueryOrOpenApiQuery<
  { customParam: boolean },
  MockPaths,
  "/api/v1/test/"
>
// Should be: { customParam: boolean } (custom query takes precedence)

type TestQueryOrOpenApiDefault = QueryOrOpenApiQuery<
  unknown,
  MockPaths,
  "/api/v1/test/"
>
// Should be: { page?: number; ordering?: string } (OpenAPI query when custom is unknown)

// Test 5: OpenApiResponse type
type TestResponse = OpenApiResponse<
  MockPaths,
  "/api/v1/test/",
  "get",
  typeof HTTP_OK
>
// Should be: { results: Array<{ id: number; name: string }>; count: number; next: string | null; previous: string | null }

// Test 6: ResponseOrOpenApiResponse type
type TestResponseOrOpenApi = ResponseOrOpenApiResponse<
  { customData: string },
  MockPaths,
  "/api/v1/test/",
  "get",
  typeof HTTP_OK
>
// Should be: { customData: string } (custom response takes precedence)

type TestResponseOrOpenApiDefault = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  "/api/v1/test/",
  "get",
  typeof HTTP_OK
>
// Should be: { results: Array<{ id: number; name: string }>; count: number; next: string | null; previous: string | null }

// Test 7: ResponseOrOpenApiPaginatedResponseResults type
type TestPaginatedResults = ResponseOrOpenApiPaginatedResponseResults<
  unknown,
  MockPaths,
  "/api/v1/test/",
  "get",
  typeof HTTP_OK
>
// Should be: Array<{ id: number; name: string }>

// Test 8: Test with dynamic path
type TestDynamicPathResponse = OpenApiResponse<
  MockPaths,
  `/api/v1/test/${number}/`,
  "get",
  typeof HTTP_OK
>
// Should be: { id: number; name: string; details: string }

// Test 9: Test with PATCH method
type TestPatchForm = OpenApiForm<MockPaths, `/api/v1/test/${number}/`, "patch">
// Should be: { name?: string; details?: string }

// Test 10: Test with POST response (201 status code)
type TestPostResponse = OpenApiResponse<
  MockPaths,
  "/api/v1/test/",
  "post",
  typeof HTTP_CREATED
>
// Should be: { id: number; name: string; created_at: string }

export type {
  TestDynamicPathResponse,
  TestForm,
  TestFormOrOpenApi,
  TestFormOrOpenApiDefault,
  TestPaginatedResults,
  TestPatchForm,
  TestPostResponse,
  TestQuery,
  TestQueryOrOpenApi,
  TestQueryOrOpenApiDefault,
  TestResponse,
  TestResponseOrOpenApi,
  TestResponseOrOpenApiDefault,
}
