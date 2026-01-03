import { OpenAPIV3 } from "openapi-types"

export interface MySecurityRequirement {
  cookieAuth?: string[]
  basicAuth?: string[]
}

export type MyOpenAPIDocument = Omit<OpenAPIV3.Document, "security"> & {
  security?: MySecurityRequirement[]
}

// Интерфейсы для парсинга сущностей
export interface EntityOperation {
  method: string
  operation: OpenAPIV3.OperationObject
  fullPath: string
}

export interface EntityDetail {
  paramName: string
  paramType: string
  operations: EntityOperation[]
}

export interface EntityMethod {
  methodName: string
  operations: EntityOperation[]
}

export interface ParsedEntity {
  // Базовый путь сущности (например: /blog/categories/)
  basePath: string
  // Полный путь с namespace (например: /api/v1/blog/categories/)
  fullBasePath: string
  // Имя сущности (например: categories)
  entityName: string
  // Namespace (например: blog)
  namespace: string
  // Операция для списка (GET)
  listOperation?: OpenAPIV3.OperationObject
  // Операция для создания (POST, если есть)
  createOperation?: OpenAPIV3.OperationObject
  // Детали сущности (операции с параметром)
  details: EntityDetail[]
  // Дополнительные методы
  methods: EntityMethod[]
}

// Вспомогательные интерфейсы для парсинга
export interface EntityPathOperation {
  method: string
  operation: OpenAPIV3.OperationObject
}

export interface EntityDetailPath {
  path: string
  paramName: string
  operations: EntityPathOperation[]
}

export interface EntityMethodPath {
  path: string
  paramName: string
  methodName: string
  operations: EntityPathOperation[]
}

export interface EntityMapData {
  basePath: string
  fullBasePath: string
  entityName: string
  namespace: string
  version?: string
  listOperation?: OpenAPIV3.OperationObject
  createOperation?: OpenAPIV3.OperationObject
  listResponse?: OpenAPIV3.ResponseObject
  createResponse?: OpenAPIV3.ResponseObject
  detailPaths: EntityDetailPath[]
  methodPaths: EntityMethodPath[]
}

