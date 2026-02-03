import type { MyOpenAPIDocument, ParsedEntity, EntityMapData } from "./types"
import { parseOpenAPIPath, extractHttpOperations } from "./utils"
import { OpenAPIV3 } from "openapi-types"
import { convertEntityMapToParsedEntities } from "./grouping"

export interface ParseResult {
  entities: ParsedEntity[]
  namespaces: string[]
}

// Функция для парсинга сущностей
export function parseEntities(schema: MyOpenAPIDocument): ParseResult {
  const entities: ParsedEntity[] = []
  const namespacesSet = new Set<string>()

  if (!schema.paths) return { entities, namespaces: [] }

  const pathEntries = Object.entries(schema.paths)
  const entityMap = new Map<string, EntityMapData>()

  for (const [path, pathItem] of pathEntries) {
    if (!pathItem) continue

    // Парсим путь с помощью новой функции
    const parsedPath = parseOpenAPIPath(path)
    if (!parsedPath) continue

    // Добавляем namespace в набор
    if (parsedPath.namespace) {
      namespacesSet.add(parsedPath.namespace)
    }

    // Создаем базовый путь для сущности
    const basePath = parsedPath.namespace 
      ? `/${parsedPath.namespace}/${parsedPath.entityName}/`
      : `/${parsedPath.entityName}/`

    // Получаем или создаем сущность
    if (!entityMap.has(basePath)) {
      entityMap.set(basePath, {
        basePath,
        fullBasePath: path,
        entityName: parsedPath.entityName,
        namespace: parsedPath.namespace,
        detailPaths: [],
        methodPaths: [],
      })
    }

    const entity = entityMap.get(basePath)!
    const operations = extractHttpOperations(pathItem)

    // Обрабатываем в зависимости от типа пути
    if (parsedPath.pathType === 'list') {
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
    } else if (parsedPath.pathType === 'detail') {
      // Добавляем детальный путь
      entity.detailPaths.push({
        path,
        paramName: parsedPath.paramName || '',
        operations,
      })
    } else if (parsedPath.pathType === 'method') {
      // Добавляем путь метода
      entity.methodPaths.push({
        path,
        paramName: parsedPath.paramName || '',
        methodName: parsedPath.methodName || '',
        operations,
      })
    }
  }

  // Преобразуем Map в массив ParsedEntity
  const parsedEntities = convertEntityMapToParsedEntities(entityMap)
  const namespaces = Array.from(namespacesSet).sort()

  return {
    entities: parsedEntities,
    namespaces,
  }
}
