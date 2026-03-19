/**
 * TypeScript test file for validating type definitions
 * This file re-exports all type tests from smaller modular files
 *
 * The file has been split into smaller modules:
 * - types.test.mock.ts: Mock data and constants
 * - types.test.core.ts: Core type tests 1-10
 * - types.test.validations.ts: Validation type assertions
 */

// Re-export core type tests
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
} from "./types.test.core"

// Re-export mock data and constants
export type {
  HTTP_CREATED,
  HTTP_NO_CONTENT,
  HTTP_OK,
  MockPaths,
} from "./types.test.mock"

// Re-export validation tests
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
} from "./types.test.validations"
