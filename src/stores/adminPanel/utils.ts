import type { EntityPathOperation, ParsedPath } from "./types"
import type { OpenAPIV3 } from "openapi-types"

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
 * Parses OpenAPI path to extract entity and namespace information
 * According to requirements:
 * - Path can be of any depth: /some/some/some/entity/{some}
 * - Everything before entity name is namespace
 * - Entity name is the last segment before first { or last segment if no {
 * - Namespace can be empty
 * - Can handle paths like: /entity/, /entity/{some}, /entity/{some}/{some}
 * - Multiple parameters after entity are treated as detail path, not methods
 */
export function parseOpenAPIPath(path: string): ParsedPath | null {
  // Remove leading and trailing slashes for cleanliness
  const cleanPath = path.replace(/^\/|\/$/g, '')
  
  // Split path into segments
  const segments = cleanPath.split('/')
  
  if (segments.length === 0) {
    return null
  }
  
  // Find first segment with parameter (in curly braces)
  const firstParamIndex = segments.findIndex(segment => segment.startsWith('{') && segment.endsWith('}'))
  
  let entityName: string
  let namespace: string
  let paramName: string | null = null
  let methodName: string | null = null
  
  if (firstParamIndex !== -1) {
    // There is a parameter - entity is segment before parameter
    if (firstParamIndex === 0) {
      // Parameter at first position: /{param} - no namespace
      // This is a special case where entity name is the parameter itself
      const paramSegment = segments[firstParamIndex]
      if (!paramSegment) return null
      
      entityName = paramSegment.replace(/[{}]/g, '')
      namespace = ''
      paramName = entityName
    } else {
      // Entity is segment before first parameter
      const entitySegment = segments[firstParamIndex - 1]
      const paramSegment = segments[firstParamIndex]
      if (!entitySegment || !paramSegment) return null
      
      entityName = entitySegment
      namespace = segments.slice(0, firstParamIndex - 1).join('/')
      paramName = paramSegment.replace(/[{}]/g, '')
    }
    
    // Check if there's a method after parameter
    // Only treat as method if the segment after parameter is NOT a parameter (not in {})
    if (firstParamIndex + 1 < segments.length) {
      const nextSegment = segments[firstParamIndex + 1]
      if (nextSegment && !nextSegment.startsWith('{')) {
        methodName = nextSegment
      }
    }
    
    // Multiple parameters after entity (e.g., /entity/{some}/{another}) are treated as detail path
    // The methodName will remain null in this case
  } else {
    // No parameters - entity is last segment
    const lastSegment = segments[segments.length - 1]
    if (!lastSegment) return null
    
    entityName = lastSegment
    namespace = segments.slice(0, segments.length - 1).join('/')
  }
  
  // Determine path type
  let pathType: 'list' | 'detail' | 'method'
  
  if (methodName) {
    pathType = 'method'
  } else if (paramName) {
    pathType = 'detail'
  } else {
    pathType = 'list'
  }
  
  return {
    path,
    entityName,
    namespace,
    paramName,
    methodName,
    pathType,
    segments,
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

