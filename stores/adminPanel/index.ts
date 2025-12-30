import schemaJson from "../../../../src/data/api_schema.json"
import { ref, computed, watch } from "vue"
import { ofetch } from "ofetch"
import { defineStore } from "pinia"
import type { MyOpenAPIDocument, ParsedEntity } from "./types"
import { parseEntities } from "./parser"

const apiSchema: MyOpenAPIDocument = schemaJson as any

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const schema = ref(apiSchema)
  const activeEntity = ref<ParsedEntity>()
  const activeList = ref()

  const showListModal = computed(() => activeEntity.value !== undefined)

  // Добавляем вычисляемое свойство для парсинга сущностей
  const parsedData = computed(() => {
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

  watch(activeEntity, async () => {
    if (activeEntity.value?.fullBasePath) {
      activeList.value = await ofetch(
        `https://api.tula-term.ru${activeEntity.value.fullBasePath}`,
      )
    }
  })

  function clearEntity() {
    activeEntity.value = undefined
  }

  function closeModal() {
    activeEntity.value = undefined
  }

  return {
    schema,
    showListModal,
    activeEntity,
    activeList,
    parsedEntities, // Экспортируем парсированные сущности
    namespaces, // Экспортируем список неймспейсов
    filteredEntitiesByNamespace, // Экспортируем отфильтрованные сущности с listOperation
    clearEntity,
    closeModal,
  }
})
