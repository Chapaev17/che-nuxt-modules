import type { EntityMapData } from "./types"
import { OpenAPIV3 } from "openapi-types"
import { extractHttpOperations } from "./utils"

/**
 * Обрабатывает базовый путь сущности (для списка и создания)
 */
export function processBasePath(
  path: string,
  pathItem: OpenAPIV3.PathItemObject,
  match: RegExpMatchArray,
  entityMap: Map<string, EntityMapData>,
) {
  const namespace = match[1] || ""
  const entityName = match[2] || ""
  const basePath = `/${namespace}/${entityName}/`
  const fullBasePath = path

  if (!entityMap.has(basePath)) {
    entityMap.set(basePath, {
      basePath,
      fullBasePath,
      entityName,
      namespace,
      detailPaths: [],
      methodPaths: [],
    })
  }

  const entity = entityMap.get(basePath)!
  const operations = extractHttpOperations(pathItem)

  // Назначаем операции для списка и создания
  for (const op of operations) {
    if (op.method === "get") {
      entity.listOperation = op.operation
      // Извлекаем response для списка
      if (op.operation.responses && op.operation.responses["200"]) {
        entity.listResponse = op.operation.responses["200"] as OpenAPIV3.ResponseObject
      }
    } else if (op.method === "post") {
      entity.createOperation = op.operation
      // Извлекаем response для создания
      if (op.operation.responses && op.operation.responses["200"]) {
        entity.createResponse = op.operation.responses["200"] as OpenAPIV3.ResponseObject
      } else if (op.operation.responses && op.operation.responses["201"]) {
        entity.createResponse = op.operation.responses["201"] as OpenAPIV3.ResponseObject
      }
    }
  }
}

/**
 * Обрабатывает путь деталей сущности (с параметром)
 */
export function processDetailPath(
  path: string,
  pathItem: OpenAPIV3.PathItemObject,
  match: RegExpMatchArray,
  entityMap: Map<string, EntityMapData>,
) {
  const namespace = match[1] || ""
  const entityName = match[2] || ""
  const paramName = match[3] || ""
  const basePath = `/${namespace}/${entityName}/`

  if (!entityMap.has(basePath)) {
    entityMap.set(basePath, {
      basePath,
      fullBasePath: `/api/v1/${namespace}/${entityName}/`,
      entityName,
      namespace,
      detailPaths: [],
      methodPaths: [],
    })
  }

  const entity = entityMap.get(basePath)!
  const operations = extractHttpOperations(pathItem)

  entity.detailPaths.push({
    path,
    paramName,
    operations,
  })
}

/**
 * Обрабатывает путь метода сущности (с параметром и методом)
 */
export function processMethodPath(
  path: string,
  pathItem: OpenAPIV3.PathItemObject,
  match: RegExpMatchArray,
  entityMap: Map<string, EntityMapData>,
) {
  const namespace = match[1] || ""
  const entityName = match[2] || ""
  const paramName = match[3] || ""
  const methodName = match[4] || ""
  const basePath = `/${namespace}/${entityName}/`

  if (!entityMap.has(basePath)) {
    entityMap.set(basePath, {
      basePath,
      fullBasePath: `/api/v1/${namespace}/${entityName}/`,
      entityName,
      namespace,
      detailPaths: [],
      methodPaths: [],
    })
  }

  const entity = entityMap.get(basePath)!
  const operations = extractHttpOperations(pathItem)

  entity.methodPaths.push({
    path,
    paramName,
    methodName,
    operations,
  })
}

