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
  <div class="w-full rounded-xl bg-[#15193b] px-2 md:w-[250px]">
    <div
      v-for="(group, groupIndex) in props.filteredEntitiesByNamespace"
      :key="group.namespace"
    >
      <!-- Namespace header -->
      <div
        :class="[
          'border-[#2d304f] p-2 font-semibold text-[#dbdbe0]',
          groupIndex !== 0 && 'border-t',
        ]"
      >
        {{ group.namespace || "No namespace" }}
      </div>

      <!-- Entity list with small indentation -->
      <div class="ml-3">
        <button
          v-for="(entity, entityIndex) in group.entities"
          :key="entity.entityName"
          :class="[
            'block w-full border-[#2d304f] p-2 text-[#dbdbe0]',
            entityIndex !== 0 && 'border-t',
          ]"
          @click="adminPanelStore.activeEntity = entity"
        >
          {{ entity.entityName }}
        </button>
      </div>
    </div>
  </div>
</template>
