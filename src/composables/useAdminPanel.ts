import { ref, computed } from "vue"
import type {
  MyOpenAPIDocument,
  ParsedEntity,
} from "../stores/adminPanel/types"
import { parseEntities } from "../stores/adminPanel/parser"
import type { EntityOperationTypes } from "../stores/adminPanel/apiTypes"
import {
  getEntityOperationTypes,
  isReferenceObject,
  getSchemaNameFromRef,
} from "../stores/adminPanel/apiTypes"
import type { OpenAPIV3 } from "openapi-types"

const emptyParseResult = { entities: [] as ParsedEntity[], namespaces: [] as string[] }

export function useAdminPanel() {
  const schema = ref<MyOpenAPIDocument>()
  const activeEntity = ref<ParsedEntity>()

  function setSchema(newSchema: MyOpenAPIDocument) {
    schema.value = newSchema
  }

  const showListModal = computed(() => activeEntity.value !== undefined)

  const parsedData = computed(() => {
    if (!schema.value) return emptyParseResult
    return parseEntities(schema.value)
  })

  const parsedEntities = computed(() => parsedData.value.entities)
  const namespaces = computed(() => parsedData.value.namespaces)

  // Геттер для группировки сущностей по неймспейсам с фильтрацией по listOperation
  const filteredEntitiesByNamespace = computed(() => {
    const grouped: Array<{ namespace: string; entities: ParsedEntity[] }> = []

    // Создаем Map для группировки
    const namespaceMap = new Map<string, ParsedEntity[]>()

    for (const entity of parsedEntities.value) {
      // Фильтруем только сущности с listOperation
      if (entity.listOperation) {
        const namespace = entity.namespace || ""
        if (!namespaceMap.has(namespace)) {
          namespaceMap.set(namespace, [])
        }
        namespaceMap.get(namespace)!.push(entity)
      }
    }

    // Преобразуем Map в массив объектов
    for (const [namespace, entities] of namespaceMap.entries()) {
      grouped.push({
        namespace,
        entities,
      })
    }

    // Сортируем по имени неймспейса
    return grouped.sort((a, b) => a.namespace.localeCompare(b.namespace))
  })

  // Геттер для получения типов операций активной сущности
  const activeEntityOperationTypes = computed<EntityOperationTypes>(() => {
    if (!activeEntity.value) return {}
    return getEntityOperationTypes(activeEntity.value)
  })

  // Функция для разрешения ссылок на схемы
  const resolveSchema = (
    schemaObj: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  ) => {
    if (!schemaObj || !schema.value) return undefined

    if (isReferenceObject(schemaObj)) {
      const schemaName = getSchemaNameFromRef(schemaObj)
      if (!schemaName) return undefined

      const components = schema.value.components
      if (components?.schemas && schemaName in components.schemas) {
        return components.schemas[schemaName]
      }
      return undefined
    }

    return schemaObj
  }

  // Геттер для схемы ответа списка активной сущности
  const activeEntityListSchema = computed(() => {
    return resolveSchema(activeEntityOperationTypes.value.listResponse)
  })

  // Геттер для проверки является ли ответ списка пагинированным (django-style)
  const isActiveEntityListPaginated = computed(() => {
    const schema = activeEntityListSchema.value
    if (!schema || !("properties" in schema)) return false
    const props = schema.properties
    if (!props || typeof props !== "object") return false
    const keys = Object.keys(props)
    return (
      keys.includes("count") &&
      keys.includes("next") &&
      keys.includes("previous") &&
      keys.includes("results")
    )
  })

  // Геттер для схемы ответа деталей активной сущности
  const activeEntityDetailSchema = computed(() => {
    return resolveSchema(activeEntityOperationTypes.value.detailResponse)
  })

  // Геттер для схемы ответа обновления активной сущности
  const activeEntityUpdateSchema = computed(() => {
    return resolveSchema(activeEntityOperationTypes.value.updateResponse)
  })

  // Геттер для схемы ответа удаления активной сущности
  const activeEntityDeleteSchema = computed(() => {
    return resolveSchema(activeEntityOperationTypes.value.deleteResponse)
  })

  // Геттер для получения имени схемы из ссылки
  const getSchemaName = (
    schemaObj: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  ): string | undefined => {
    if (!schemaObj) return undefined
    if (isReferenceObject(schemaObj)) {
      return getSchemaNameFromRef(schemaObj)
    }
    return undefined
  }

  // Геттер для получения имени схемы списка активной сущности
  const activeEntityListSchemaName = computed(() => {
    return getSchemaName(activeEntityOperationTypes.value.listResponse)
  })

  function clearEntity() {
    activeEntity.value = undefined
  }

  function closeModal() {
    activeEntity.value = undefined
  }

  return {
    schema,
    setSchema,
    showListModal,
    activeEntity,
    parsedEntities,
    namespaces,
    filteredEntitiesByNamespace,
    activeEntityOperationTypes,
    activeEntityListSchema,
    activeEntityDetailSchema,
    activeEntityUpdateSchema,
    activeEntityDeleteSchema,
    activeEntityListSchemaName,
    isActiveEntityListPaginated,
    resolveSchema,
    getSchemaName,
    clearEntity,
    closeModal,
  }
}
