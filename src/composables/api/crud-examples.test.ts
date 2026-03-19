/**
 * Comprehensive CRUD examples using the type utilities
 * Demonstrates how to use the types with the mock schema for typical CRUD operations
 */

import type { paths as MockPaths } from "./mockApiSchema"
import type {
  FormOrOpenApiForm,
  QueryOrOpenApiQuery,
  ResponseOrOpenApiPaginatedResponseResults,
  ResponseOrOpenApiResponse,
} from "./types"

// HTTP status code constants to avoid magic numbers
const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204

// ============================================================================
// EXAMPLE 1: LIST OPERATION (GET with pagination)
// ============================================================================

/**
 * Example: Getting a paginated list of resources
 * Path: /api/v1/mock/resource/
 * Method: GET
 */

// Type for query parameters
type ListQuery = QueryOrOpenApiQuery<
  // Custom query parameters (optional - will use OpenAPI schema if unknown)
  { customFilter?: string },
  MockPaths,
  "/api/v1/mock/resource/"
>
// Result: { page?: number; ordering?: string; search?: string; customFilter?: string }

// Type for response
type ListResponse = ResponseOrOpenApiResponse<
  // Custom response type (optional - will use OpenAPI schema if unknown)
  unknown,
  MockPaths,
  "/api/v1/mock/resource/",
  "get",
  200
>
// Result: {
//   results: Array<{ id: number; name: string; description?: string; created_at: string }>
//   count: number
//   next: string | null
//   previous: string | null
// }

// Type for paginated results only (extracts the "results" array)
type ListResults = ResponseOrOpenApiPaginatedResponseResults<
  unknown,
  MockPaths,
  "/api/v1/mock/resource/",
  "get",
  200
>
// Result: Array<{ id: number; name: string; description?: string; created_at: string }>

// ============================================================================
// EXAMPLE 2: CREATE OPERATION (POST)
// ============================================================================

/**
 * Example: Creating a new resource
 * Path: /api/v1/mock/resource/
 * Method: POST
 */

// Type for form data (multipart/form-data)
type CreateForm = FormOrOpenApiForm<
  // Custom form type (optional - will use OpenAPI schema if unknown)
  unknown,
  MockPaths,
  "/api/v1/mock/resource/",
  "post"
>
// Result: { name: string; description?: string; file?: File }

// Type for create response (201 Created)
type CreateResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  "/api/v1/mock/resource/",
  "post",
  201
>
// Result: { id: number; name: string; description?: string; created_at: string }

// ============================================================================
// EXAMPLE 3: RETRIEVE OPERATION (GET single)
// ============================================================================

/**
 * Example: Retrieving a single resource by ID
 * Path: /api/v1/mock/resource/{id}/
 * Method: GET
 */

// Type for detail response
type DetailResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "get",
  200
>
// Result: { id: number; name: string; description?: string; created_at: string; updated_at: string }

// ============================================================================
// EXAMPLE 4: UPDATE OPERATION (PUT - full update)
// ============================================================================

/**
 * Example: Fully updating a resource
 * Path: /api/v1/mock/resource/{id}/
 * Method: PUT
 */

// Type for update form (PUT - requires all fields)
type UpdateForm = FormOrOpenApiForm<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "put"
>
// Result: { name: string; description?: string; file?: File }

// Type for update response
type UpdateResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "put",
  200
>
// Result: { id: number; name: string; description?: string; created_at: string; updated_at: string }

// ============================================================================
// EXAMPLE 5: PARTIAL UPDATE OPERATION (PATCH)
// ============================================================================

/**
 * Example: Partially updating a resource
 * Path: /api/v1/mock/resource/{id}/
 * Method: PATCH
 */

// Type for partial update form (PATCH - optional fields)
type PartialUpdateForm = FormOrOpenApiForm<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "patch"
>
// Result: { name?: string; description?: string; file?: File }

// Type for partial update response
type PartialUpdateResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "patch",
  200
>
// Result: { id: number; name: string; description?: string; created_at: string; updated_at: string }

// ============================================================================
// EXAMPLE 6: DELETE OPERATION
// ============================================================================

/**
 * Example: Deleting a resource
 * Path: /api/v1/mock/resource/{id}/
 * Method: DELETE
 */

// Type for delete response (204 No Content)
type DeleteResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  `/api/v1/mock/resource/${number}/`,
  "delete",
  204
>
// Result: never (204 responses have no content)

// ============================================================================
// EXAMPLE 7: CUSTOM FORM OVERRIDE
// ============================================================================

/**
 * Example: Using custom form type instead of OpenAPI schema
 * Useful when you need to extend or modify the form
 */

interface CustomFormData {
  description?: string
  file?: File
  name: string
  tags: string[] // Custom field not in OpenAPI schema
}

type CustomCreateForm = FormOrOpenApiForm<
  CustomFormData,
  MockPaths,
  "/api/v1/mock/resource/",
  "post"
>
// Result: CustomFormData (custom form takes precedence over OpenAPI schema)

// ============================================================================
// EXAMPLE 8: CUSTOM RESPONSE OVERRIDE
// ============================================================================

/**
 * Example: Using custom response type instead of OpenAPI schema
 * Useful when you need to extend or modify the response
 */

interface CustomResponseData {
  created_at: string
  description?: string
  id: number
  metadata: {
    processed: boolean
    // Custom nested field
    version: string
  }
  name: string
}

type CustomCreateResponse = ResponseOrOpenApiResponse<
  CustomResponseData,
  MockPaths,
  "/api/v1/mock/resource/",
  "post",
  201
>
// Result: CustomResponseData (custom response takes precedence over OpenAPI schema)

// ============================================================================
// EXAMPLE 9: NON-PAGINATED LIST
// ============================================================================

/**
 * Example: Getting a non-paginated list
 * Path: /api/v1/mock/non-paginated/
 * Method: GET
 */

type NonPaginatedResponse = ResponseOrOpenApiResponse<
  unknown,
  MockPaths,
  "/api/v1/mock/non-paginated/",
  "get",
  200
>
// Result: Array<{ id: number; title: string; active: boolean }>

// ============================================================================
// EXAMPLE 10: QUERY-ONLY ENDPOINT
// ============================================================================

/**
 * Example: Endpoint with required query parameters
 * Path: /api/v1/mock/query-only/
 * Method: GET
 */

type QueryOnlyQuery = QueryOrOpenApiQuery<
  unknown,
  MockPaths,
  "/api/v1/mock/query-only/"
>
// Result: { filter: "active" | "inactive" | "all"; sort?: "asc" | "desc" }

// ============================================================================
// TYPE VALIDATION TESTS
// ============================================================================

// Helper types for validation
type AssertTrue<T extends true> = T
type AssertFalse<T extends false> = T

// Validate ListQuery type
type ValidateListQuery = AssertTrue<
  ListQuery extends {
    customFilter?: string
    ordering?: string
    page?: number
    search?: string
  }
    ? true
    : false
>

// Validate CreateForm type
type ValidateCreateForm = AssertTrue<
  CreateForm extends { description?: string; file?: File; name: string }
    ? true
    : false
>

// Validate DetailResponse type
type ValidateDetailResponse = AssertTrue<
  DetailResponse extends {
    created_at: string
    description?: string
    id: number
    name: string
    updated_at: string
  }
    ? true
    : false
>

// Validate PartialUpdateForm type (optional fields)
type ValidatePartialUpdateForm = AssertTrue<
  PartialUpdateForm extends {
    description?: string
    file?: File
    name?: string
  }
    ? true
    : false
>

// Validate CustomCreateForm type (custom form takes precedence)
type ValidateCustomCreateForm = AssertTrue<
  CustomCreateForm extends {
    description?: string
    file?: File
    name: string
    tags: string[]
  }
    ? true
    : false
>

// Validate QueryOnlyQuery type (required filter)
type ValidateQueryOnlyQuery = AssertTrue<
  QueryOnlyQuery extends {
    filter: "active" | "all" | "inactive"
    sort?: "asc" | "desc"
  }
    ? true
    : false
>

// ============================================================================
// PRACTICAL USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Function for listing resources
 */
async function listResources(query: ListQuery): Promise<ListResults> {
  // In real implementation, this would make an API call
  // The types ensure query parameters and response are correctly typed
  const response = await fetch(
    `/api/v1/mock/resource/?${new URLSearchParams(query as any)}`,
  )
  const data: ListResponse = await response.json()
  return data.results
}

/**
 * Example 2: Function for creating a resource
 */
async function createResource(form: CreateForm): Promise<CreateResponse> {
  // In real implementation, this would make an API call
  // The types ensure form data and response are correctly typed
  const formData = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== undefined) {
      formData.append(key, value as any)
    }
  }

  const response = await fetch("/api/v1/mock/resource/", {
    body: formData,
    method: "POST",
  })
  return response.json()
}

/**
 * Example 3: Function for updating a resource
 */
async function updateResource(
  id: number,
  form: PartialUpdateForm,
): Promise<PartialUpdateResponse> {
  // In real implementation, this would make an API call
  // The types ensure form data and response are correctly typed
  const formData = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== undefined) {
      formData.append(key, value as any)
    }
  }

  const response = await fetch(`/api/v1/mock/resource/${id}/`, {
    body: formData,
    method: "PATCH",
  })
  return response.json()
}

// Export dummy value to make this a module
export const __crudExamples = null
