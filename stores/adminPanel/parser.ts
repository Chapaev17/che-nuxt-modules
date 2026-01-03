import type { MyOpenAPIDocument, ParsedEntity, EntityMapData } from "./types"
import { createPathRegexes } from "./utils"
import {
  processBasePath,
  processDetailPath,
  processMethodPath,
} from "./pathHandlers"
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

  const { basePathRegex, detailPathRegex, methodPathRegex } =
    createPathRegexes()
  const pathEntries = Object.entries(schema.paths)
  const entityMap = new Map<string, EntityMapData>()

  for (const [path, pathItem] of pathEntries) {
    if (!pathItem) continue

    // Проверяем базовый путь (для списка)
    const baseMatch = path.match(basePathRegex)
    if (baseMatch) {
      const namespace = baseMatch[2] || ""
      namespacesSet.add(namespace)
      processBasePath(path, pathItem, baseMatch, entityMap)
      continue
    }

    // Проверяем путь деталей (с параметром)
    const detailMatch = path.match(detailPathRegex)
    if (detailMatch) {
      const namespace = detailMatch[2] || ""
      namespacesSet.add(namespace)
      processDetailPath(path, pathItem, detailMatch, entityMap)
      continue
    }

    // Проверяем путь метода (с параметром и методом)
    const methodMatch = path.match(methodPathRegex)
    if (methodMatch) {
      const namespace = methodMatch[2] || ""
      namespacesSet.add(namespace)
      processMethodPath(path, pathItem, methodMatch, entityMap)
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
