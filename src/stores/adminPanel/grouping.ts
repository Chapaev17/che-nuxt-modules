import type {
  EntityDetail,
  EntityDetailPath,
  EntityMethod,
  EntityMethodPath,
  EntityMapData,
  ParsedEntity,
} from "./types"

/**
 * Группирует детали по параметру
 */
export function groupDetailsByParam(
  detailPaths: EntityDetailPath[],
): EntityDetail[] {
  const detailsMap = new Map<string, EntityDetail>()

  for (const detailPath of detailPaths) {
    if (!detailsMap.has(detailPath.paramName)) {
      detailsMap.set(detailPath.paramName, {
        paramName: detailPath.paramName,
        paramType: "string", // По умолчанию, можно извлечь из схемы параметров
        operations: [],
      })
    }

    const detail = detailsMap.get(detailPath.paramName)!
    detail.operations.push(
      ...detailPath.operations.map((op) => ({
        method: op.method,
        operation: op.operation,
        fullPath: detailPath.path,
      })),
    )
  }

  return Array.from(detailsMap.values())
}

/**
 * Группирует методы по имени метода
 */
export function groupMethodsByName(
  methodPaths: EntityMethodPath[],
): EntityMethod[] {
  const methodsMap = new Map<string, EntityMethod>()

  for (const methodPath of methodPaths) {
    if (!methodsMap.has(methodPath.methodName)) {
      methodsMap.set(methodPath.methodName, {
        methodName: methodPath.methodName,
        operations: [],
      })
    }

    const method = methodsMap.get(methodPath.methodName)!
    method.operations.push(
      ...methodPath.operations.map((op) => ({
        method: op.method,
        operation: op.operation,
        fullPath: methodPath.path,
      })),
    )
  }

  return Array.from(methodsMap.values())
}

/**
 * Преобразует Map EntityMapData в массив ParsedEntity
 */
export function convertEntityMapToParsedEntities(
  entityMap: Map<string, EntityMapData>,
): ParsedEntity[] {
  const entities: ParsedEntity[] = []

  for (const entityData of entityMap.values()) {
    const parsedEntity: ParsedEntity = {
      basePath: entityData.basePath,
      fullBasePath: entityData.fullBasePath,
      entityName: entityData.entityName,
      namespace: entityData.namespace,
      listOperation: entityData.listOperation,
      createOperation: entityData.createOperation,
      details: groupDetailsByParam(entityData.detailPaths),
      methods: groupMethodsByName(entityData.methodPaths),
    }

    entities.push(parsedEntity)
  }

  return entities
}

