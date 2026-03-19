/**
 * Validation tests for type definitions
 * Contains type assertions to validate that the type utilities work correctly at compile time
 */

import type {
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
} from "./types.test.core"

// Type assertions using conditional types to validate at compile time
type AssertTrue<T extends true> = T

// Validation tests
type TestFormValidation = AssertTrue<
  TestForm extends { file?: File; name: string } ? true : false
>

type TestFormOrOpenApiValidation = AssertTrue<
  TestFormOrOpenApi extends { customField: string } ? true : false
>

type TestFormOrOpenApiDefaultValidation = AssertTrue<
  TestFormOrOpenApiDefault extends { file?: File; name: string } ? true : false
>

type TestQueryValidation = AssertTrue<
  TestQuery extends { ordering?: string; page?: number } ? true : false
>

type TestQueryOrOpenApiValidation = AssertTrue<
  TestQueryOrOpenApi extends { customParam: boolean } ? true : false
>

type TestQueryOrOpenApiDefaultValidation = AssertTrue<
  TestQueryOrOpenApiDefault extends { ordering?: string; page?: number }
    ? true
    : false
>

type TestResponseValidation = AssertTrue<
  TestResponse extends {
    count: number
    next: null | string
    previous: null | string
    results: { id: number; name: string }[]
  }
    ? true
    : false
>

type TestResponseOrOpenApiValidation = AssertTrue<
  TestResponseOrOpenApi extends { customData: string } ? true : false
>

type TestResponseOrOpenApiDefaultValidation = AssertTrue<
  TestResponseOrOpenApiDefault extends {
    count: number
    next: null | string
    previous: null | string
    results: { id: number; name: string }[]
  }
    ? true
    : false
>

type TestPaginatedResultsValidation = AssertTrue<
  TestPaginatedResults extends { id: number; name: string }[] ? true : false
>

type TestDynamicPathResponseValidation = AssertTrue<
  TestDynamicPathResponse extends { details: string; id: number; name: string }
    ? true
    : false
>
type TestPatchFormValidation = AssertTrue<
  TestPatchForm extends { details?: string; name?: string } ? true : false
>

type TestPostResponseValidation = AssertTrue<
  TestPostResponse extends { created_at: string; id: number; name: string }
    ? true
    : false
>

export type {
  TestDynamicPathResponseValidation,
  TestFormOrOpenApiDefaultValidation,
  TestFormOrOpenApiValidation,
  TestFormValidation,
  TestPaginatedResultsValidation,
  TestPatchFormValidation,
  TestPostResponseValidation,
  TestQueryOrOpenApiDefaultValidation,
  TestQueryOrOpenApiValidation,
  TestQueryValidation,
  TestResponseOrOpenApiDefaultValidation,
  TestResponseOrOpenApiValidation,
  TestResponseValidation,
}
