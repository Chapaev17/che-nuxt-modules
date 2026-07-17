import type { OpenAPIV3 } from "openapi-types"

// Basic interfaces for API responses
interface ApiListResponse<T> {
  count: number
  next: null | string
  previous: null | string
  results: T[]
}

interface ApiDetailResponse {
  [key: string]: unknown
  id: number
}

interface ApiErrorResponse {
  [key: string]: unknown
  detail?: string
}

// Entity CRUD operation types
interface EntityOperationTypes {
  createResponse?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  deleteResponse?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  detailResponse?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  listResponse?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  updateResponse?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
}

// Helper types for extracting schemas from operations
function getResponseSchema(
  operation: OpenAPIV3.OperationObject | undefined,
  statusCode = "200",
): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined {
  if (!operation?.responses) return undefined

  const response = operation.responses[statusCode]
  if (!response) return undefined

  // Handle $ref in response
  if ("$ref" in response) return response

  const responseObject = response as OpenAPIV3.ResponseObject
  if (!responseObject.content?.["application/json"]?.schema) return undefined

  const { schema } = responseObject.content["application/json"]

  return schema
}

// Get all operation types for an entity
function getEntityOperationTypes(entity: {
  details?: {
    operations: {
      method: string
      operation: OpenAPIV3.OperationObject
    }[]
  }[]
  listOperation?: OpenAPIV3.OperationObject
}): EntityOperationTypes {
  const types: EntityOperationTypes = {}

  // Get list response schema
  if (entity.listOperation) {
    types.listResponse = getResponseSchema(entity.listOperation)
  }

  // Get detail operation schemas (GET, PATCH, DELETE)
  if (entity.details && entity.details.length > 0) {
    const detailOperations = entity.details[0]?.operations || []

    for (const op of detailOperations) {
      const schema = getResponseSchema(op.operation)
      if (schema) {
        switch (op.method.toUpperCase()) {
          case "DELETE": {
            types.deleteResponse = schema
            break
          }
          case "GET": {
            types.detailResponse = schema
            break
          }
          case "PATCH":
          case "PUT": {
            types.updateResponse = schema
            break
          }
          default: {
            break
          }
        }
      }
    }
  }

  return types
}

// Check if an object is an OpenAPI reference
function isReferenceObject(
  object: unknown,
): object is OpenAPIV3.ReferenceObject {
  return typeof object === "object" && object !== null && "$ref" in object
}

// Extract schema name from a reference
function getSchemaNameFromReference(
  reference: OpenAPIV3.ReferenceObject,
): string | undefined {
  if (!reference.$ref) return undefined
  const parts = reference.$ref.split("/")
  return parts.at(-1)
}

export type {
  ApiDetailResponse,
  ApiErrorResponse,
  ApiListResponse,
  EntityOperationTypes,
}
export {
  getEntityOperationTypes,
  getResponseSchema,
  getSchemaNameFromReference as getSchemaNameFromRef,
  isReferenceObject,
}
