import schemaJson from "../../../src/data/api_schema.json"
import { OpenAPIV3 } from "openapi-types"
import { ref, computed, watch } from "vue"
import { ofetch } from "ofetch"
import { defineStore } from "pinia"

interface MySecurityRequirement {
  cookieAuth?: string[]
  basicAuth?: string[]
}
type MyOpenAPIDocument = Omit<OpenAPIV3.Document, "security"> & {
  security?: MySecurityRequirement[]
}
const apiSchema: MyOpenAPIDocument = schemaJson as any

// Интерфейсы для парсинга сущностей
interface EntityOperation {
  method: string
  operation: OpenAPIV3.OperationObject
  fullPath: string
}

interface EntityDetail {
  paramName: string
  paramType: string
  operations: EntityOperation[]
}

interface EntityMethod {
  methodName: string
  operations: EntityOperation[]
}

interface ParsedEntity {
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

// Функция для парсинга сущностей
function parseEntities(schema: MyOpenAPIDocument): ParsedEntity[] {
  const entities: ParsedEntity[] = []
  
  if (!schema.paths) return entities
  
  // Регулярные выражения для анализа путей
  const basePathRegex = /^\/api\/v\d+\/([^\/]+)\/([^\/]+)\/$/
  const detailPathRegex = /^\/api\/v\d+\/([^\/]+)\/([^\/]+)\/\{([^}]+)\}\/$/
  const methodPathRegex = /^\/api\/v\d+\/([^\/]+)\/([^\/]+)\/\{([^}]+)\}\/([^\/]+)\/$/
  
  // Сначала собираем все пути и группируем их
  const pathEntries = Object.entries(schema.paths)
  
  // Группируем пути по базовому пути сущности
  const entityMap = new Map<string, {
    basePath: string
    fullBasePath: string
    entityName: string
    namespace: string
    listOperation?: OpenAPIV3.OperationObject
    createOperation?: OpenAPIV3.OperationObject
    detailPaths: Array<{
      path: string
      paramName: string
      operations: Array<{
        method: string
        operation: OpenAPIV3.OperationObject
      }>
    }>
    methodPaths: Array<{
      path: string
      paramName: string
      methodName: string
      operations: Array<{
        method: string
        operation: OpenAPIV3.OperationObject
      }>
    }>
  }>()
  
  for (const [path, pathItem] of pathEntries) {
    if (!pathItem) continue
    
    // Проверяем базовый путь (для списка)
    const baseMatch = path.match(basePathRegex)
    if (baseMatch) {
      const namespace = baseMatch[1] || ''
      const entityName = baseMatch[2] || ''
      const basePath = `/${namespace}/${entityName}/`
      const fullBasePath = path
      
      if (!entityMap.has(basePath)) {
        entityMap.set(basePath, {
          basePath,
          fullBasePath,
          entityName,
          namespace,
          detailPaths: [],
          methodPaths: []
        })
      }
      
      const entity = entityMap.get(basePath)!
      
      // Проверяем операции в pathItem (только HTTP методы)
      const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']
      for (const [method, operation] of Object.entries(pathItem)) {
        if (httpMethods.includes(method) && typeof operation === 'object') {
          if (method === 'get') {
            entity.listOperation = operation as OpenAPIV3.OperationObject
          } else if (method === 'post') {
            entity.createOperation = operation as OpenAPIV3.OperationObject
          }
        }
      }
      
      continue
    }
    
    // Проверяем путь деталей (с параметром)
    const detailMatch = path.match(detailPathRegex)
    if (detailMatch) {
      const namespace = detailMatch[1] || ''
      const entityName = detailMatch[2] || ''
      const paramName = detailMatch[3] || ''
      const basePath = `/${namespace}/${entityName}/`
      
      if (!entityMap.has(basePath)) {
        entityMap.set(basePath, {
          basePath,
          fullBasePath: `/api/v1/${namespace}/${entityName}/`,
          entityName,
          namespace,
          detailPaths: [],
          methodPaths: []
        })
      }
      
      const entity = entityMap.get(basePath)!
      
      // Собираем операции для этого пути (только HTTP методы)
      const operations: Array<{method: string, operation: OpenAPIV3.OperationObject}> = []
      const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']
      for (const [method, operation] of Object.entries(pathItem)) {
        if (httpMethods.includes(method) && typeof operation === 'object') {
          operations.push({ method, operation: operation as OpenAPIV3.OperationObject })
        }
      }
      
      entity.detailPaths.push({
        path,
        paramName,
        operations
      })
      
      continue
    }
    
    // Проверяем путь метода (с параметром и методом)
    const methodMatch = path.match(methodPathRegex)
    if (methodMatch) {
      const namespace = methodMatch[1] || ''
      const entityName = methodMatch[2] || ''
      const paramName = methodMatch[3] || ''
      const methodName = methodMatch[4] || ''
      const basePath = `/${namespace}/${entityName}/`
      
      if (!entityMap.has(basePath)) {
        entityMap.set(basePath, {
          basePath,
          fullBasePath: `/api/v1/${namespace}/${entityName}/`,
          entityName,
          namespace,
          detailPaths: [],
          methodPaths: []
        })
      }
      
      const entity = entityMap.get(basePath)!
      
      // Собираем операции для этого пути (только HTTP методы)
      const operations: Array<{method: string, operation: OpenAPIV3.OperationObject}> = []
      const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']
      for (const [method, operation] of Object.entries(pathItem)) {
        if (httpMethods.includes(method) && typeof operation === 'object') {
          operations.push({ method, operation: operation as OpenAPIV3.OperationObject })
        }
      }
      
      entity.methodPaths.push({
        path,
        paramName,
        methodName,
        operations
      })
    }
  }
  
  // Преобразуем Map в массив ParsedEntity
  for (const entityData of entityMap.values()) {
    // Группируем детали по параметру
    const detailsMap = new Map<string, EntityDetail>()
    
    for (const detailPath of entityData.detailPaths) {
      if (!detailsMap.has(detailPath.paramName)) {
        detailsMap.set(detailPath.paramName, {
          paramName: detailPath.paramName,
          paramType: 'string', // По умолчанию, можно извлечь из схемы параметров
          operations: []
        })
      }
      
      const detail = detailsMap.get(detailPath.paramName)!
      detail.operations.push(...detailPath.operations.map(op => ({
        method: op.method,
        operation: op.operation,
        fullPath: detailPath.path
      })))
    }
    
    // Группируем методы по имени метода
    const methodsMap = new Map<string, EntityMethod>()
    
    for (const methodPath of entityData.methodPaths) {
      if (!methodsMap.has(methodPath.methodName)) {
        methodsMap.set(methodPath.methodName, {
          methodName: methodPath.methodName,
          operations: []
        })
      }
      
      const method = methodsMap.get(methodPath.methodName)!
      method.operations.push(...methodPath.operations.map(op => ({
        method: op.method,
        operation: op.operation,
        fullPath: methodPath.path
      })))
    }
    
    const parsedEntity: ParsedEntity = {
      basePath: entityData.basePath,
      fullBasePath: entityData.fullBasePath,
      entityName: entityData.entityName,
      namespace: entityData.namespace,
      listOperation: entityData.listOperation,
      createOperation: entityData.createOperation,
      details: Array.from(detailsMap.values()),
      methods: Array.from(methodsMap.values())
    }
    
    entities.push(parsedEntity)
  }
  
  return entities
}

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const schema = ref(apiSchema)
  const activeEntity = ref<ParsedEntity>()
  const activeList = ref()

  const showListModal = computed(() => activeEntity.value !== undefined)

  // Добавляем вычисляемое свойство для парсинга сущностей
  const parsedEntities = computed(() => {
    if (!schema.value.paths) return []
    return parseEntities(schema.value)
  })

  watch(activeEntity, async () => {
    if (activeEntity.value?.fullBasePath) {
      activeList.value = await ofetch(
        `https://api.tula-term.ru${activeEntity.value.fullBasePath}`,
      )
    }
  })

  return {
    schema,
    showListModal,
    activeEntity,
    activeList,
    parsedEntities, // Экспортируем парсированные сущности
  }
})
