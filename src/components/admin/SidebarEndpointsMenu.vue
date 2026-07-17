<script setup lang="tsx">
import type { ParsedEntity } from "../../stores/adminPanel/types"
import { useAdminPanelStore } from "../../stores/adminPanel/index"

const adminPanelStore = useAdminPanelStore()

interface Props {
  filteredEntitiesByNamespace: Array<{
    namespace: string
    entities: ParsedEntity[]
  }>
  isMobile?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="flex h-full flex-col border-r border-gray-200 bg-gray-50"
    :class="props.isMobile ? 'w-full' : 'w-64'"
  >
    <div class="border-b border-gray-200 px-4 py-3">
      <h2
        class="text-sm font-semibold uppercase tracking-wider text-gray-500"
      >
        Endpoints
      </h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-for="(group, groupIndex) in props.filteredEntitiesByNamespace"
        :key="group.namespace"
      >
        <div
          class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400"
        >
          {{ group.namespace || "No namespace" }}
        </div>

        <div>
          <button
            v-for="entity in group.entities"
            :key="entity.entityName"
            class="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
            :class="{
              'border-l-2 border-l-blue-600 bg-blue-50 font-medium text-blue-700':
                adminPanelStore.activeEntity?.entityName ===
                  entity.entityName &&
                adminPanelStore.activeEntity?.namespace ===
                  entity.namespace,
            }"
            @click="adminPanelStore.activeEntity = entity"
          >
            <div class="flex items-center gap-2">
              <span
                v-if="entity.listOperation"
                class="rounded bg-green-100 px-1.5 py-0.5 font-mono text-xs font-medium text-green-700"
              >
                {{ entity.listOperation ? "GET" : "" }}
              </span>
              {{ entity.entityName }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
