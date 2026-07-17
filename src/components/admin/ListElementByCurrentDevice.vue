<script setup lang="tsx">
import CheModal from "../Modal.vue"
import EntityOperationsList from "./EntityOperationsList.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"

interface Props {
  isMobile?: boolean
}

const props = defineProps<Props>()
const adminPanelStore = useAdminPanelStore()
</script>

<template>
  <div class="flex h-full flex-1 flex-col overflow-y-auto">
    <!-- Controlled mode: isMobile explicitly passed -->
    <template v-if="props.isMobile !== undefined">
      <div v-if="!props.isMobile" class="desktop-version h-full">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <button
            class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            @click="adminPanelStore.clearEntity()"
          >
            &larr; All endpoints
          </button>
          <span class="text-xs text-gray-400">
            {{ adminPanelStore.activeEntity ? adminPanelStore.activeEntity.entityName : "No entity selected" }}
          </span>
        </div>
        <EntityOperationsList :entity="adminPanelStore.activeEntity" />
      </div>

      <div v-else class="mobile-version h-full">
        <CheModal
          :show="adminPanelStore.showListModal"
          @set-visible="adminPanelStore.closeModal()"
        >
          <div class="p-4">
            <div class="mb-4 flex items-center justify-between">
              <button
                class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                @click="adminPanelStore.clearEntity()"
              >
                &larr; All endpoints
              </button>
              <button
                class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                @click="adminPanelStore.closeModal()"
              >
                Close
              </button>
            </div>
            <EntityOperationsList :entity="adminPanelStore.activeEntity" />
          </div>
        </CheModal>
      </div>
    </template>

    <!-- Uncontrolled mode: responsive via Tailwind -->
    <template v-else>
      <div class="hidden h-full md:flex md:flex-col desktop-version">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <button
            class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            @click="adminPanelStore.clearEntity()"
          >
            &larr; All endpoints
          </button>
          <span class="text-xs text-gray-400">
            {{ adminPanelStore.activeEntity ? adminPanelStore.activeEntity.entityName : "No entity selected" }}
          </span>
        </div>
        <EntityOperationsList :entity="adminPanelStore.activeEntity" />
      </div>

      <div class="block h-full md:hidden mobile-version">
        <CheModal
          :show="adminPanelStore.showListModal"
          @set-visible="adminPanelStore.closeModal()"
        >
          <div class="p-4">
            <div class="mb-4 flex items-center justify-between">
              <button
                class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                @click="adminPanelStore.clearEntity()"
              >
                &larr; All endpoints
              </button>
              <button
                class="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                @click="adminPanelStore.closeModal()"
              >
                Close
              </button>
            </div>
            <EntityOperationsList :entity="adminPanelStore.activeEntity" />
          </div>
        </CheModal>
      </div>
    </template>
  </div>
</template>
