import type { EntityPathOperation } from "./types"
import { OpenAPIV3 } from "openapi-types"

/**
 * Создает регулярные выражения для анализа путей OpenAPI
 */
export function createPathRegexes() {
  return {
    basePathRegex: /^\/api\/(v\d+)\/([^\/]+)\/([^\/]+)\/$/,
    detailPathRegex: /^\/api\/(v\d+)\/([^\/]+)\/([^\/]+)\/\{([^}]+)\}\/$/,
    methodPathRegex:
      /^\/api\/(v\d+)\/([^\/]+)\/([^\/]+)\/\{([^}]+)\}\/([^\/]+)\/$/,
  }
}

/**
 * Извлекает HTTP операции из pathItem объекта OpenAPI
 */
export function extractHttpOperations(
  pathItem: OpenAPIV3.PathItemObject,
): EntityPathOperation[] {
  const operations: EntityPathOperation[] = []
  const httpMethods = [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "options",
    "head",
    "trace",
  ]

  for (const [method, operation] of Object.entries(pathItem)) {
    if (httpMethods.includes(method) && typeof operation === "object") {
      operations.push({
        method,
        operation: operation as OpenAPIV3.OperationObject,
      })
    }
  }

  return operations
}

