import type { OpenAPIV3 } from "openapi-types"

// Basic interfaces for API responses
export interface ApiListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiDetailResponse<T> {
  id: number
  [key: string]: any
}

export interface ApiErrorResponse {
  detail?: string
  [key: string]: any
}

// Типы для операций CRUD
export interface EntityOperationTypes {
  listResponse?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  detailResponse?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  createResponse?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  updateResponse?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  deleteResponse?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}

// Вспомогательные типы для извлечения схем из операций
export function getResponseSchema(
  operation: OpenAPIV3.OperationObject | undefined,
  statusCode: string = "200"
): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined {
  if (!operation?.responses) return undefined
  
  const response = operation.responses[statusCode]
  if (!response) return undefined
  
  // Handle $ref in response
  if ("$ref" in response) return response
  
  const responseObject = response as OpenAPIV3.ResponseObject
  if (!responseObject.content?.["application/json"]?.schema) return undefined
  
  const schema = responseObject.content["application/json"].schema
  
  // Return schema or reference
  return schema
}

// Функция для получения всех типов операций сущности
export function getEntityOperationTypes(entity: {
  listOperation?: OpenAPIV3.OperationObject
  details?: Array<{
    operations: Array<{
      method: string
      operation: OpenAPIV3.OperationObject
    }>
  }>
}): EntityOperationTypes {
  const types: EntityOperationTypes = {}
  
  // Получаем схему для списка
  if (entity.listOperation) {
    types.listResponse = getResponseSchema(entity.listOperation)
  }
  
  // Получаем схемы для деталей (GET, PATCH, DELETE)
  if (entity.details && entity.details.length > 0) {
    const detailOperations = entity.details[0]?.operations || []
    
    for (const op of detailOperations) {
      const schema = getResponseSchema(op.operation)
      if (!schema) continue
      
      switch (op.method.toUpperCase()) {
        case "GET":
          types.detailResponse = schema
          break
        case "PATCH":
        case "PUT":
          types.updateResponse = schema
          break
        case "DELETE":
          types.deleteResponse = schema
          break
      }
    }
  }
  
  return types
}

// Функция для проверки является ли объект ссылкой
export function isReferenceObject(obj: any): obj is OpenAPIV3.ReferenceObject {
  return obj && typeof obj === "object" && "$ref" in obj
}

// Функция для получения имени схемы из ссылки
export function getSchemaNameFromRef(ref: OpenAPIV3.ReferenceObject): string | undefined {
  if (!ref.$ref) return undefined
  const parts = ref.$ref.split("/")
  return parts[parts.length - 1]
}

