<script setup lang="ts">
import { watch } from "vue"
import { usePaginatedListApi } from "../../composables/api"
import { useAdminPanelStore } from "../../stores/adminPanel/index"
import FieldValue from "./FieldValue.vue"
import LazyLoadList from "../LazyLoadList.vue"

interface Props {
  baseUrl: string
  isMobile?: boolean
}

const props = defineProps<Props>()
const adminPanelStore = useAdminPanelStore()

const {
  data: entityRecords,
  fetchData: fetchEntityRecords,
  fetchDataStatus: fetchEntityRecordsStatus,
  fetchNextPage: fetchEntityRecordsNextPage,
  showNextPageLoader,
  reset: resetEntityRecords,
} = usePaginatedListApi<Record<string, any>[]>({ url: "" })

watch(
  () => adminPanelStore.activeEntity,
  (newEntity) => {
    resetEntityRecords()
    if (newEntity?.fullBasePath) {
      fetchEntityRecords({ url: `${props.baseUrl}${newEntity.fullBasePath}` })
    }
  },
)

function getObjectKeys(obj: Record<string, any>): string[] {
  return Object.keys(obj).filter(
    (key) =>
      key !== "id" ||
      typeof obj.id === "string" ||
      typeof obj.id === "number",
  )
}
</script>

<template>
  <div class="flex h-full flex-1 flex-col overflow-y-auto bg-gray-50">
    <div
      v-if="adminPanelStore.activeEntity"
      class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
    >
      <button
        class="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        @click="adminPanelStore.clearEntity()"
      >
        &larr; All endpoints
      </button>
      <div class="text-right">
        <h2 class="text-sm font-semibold text-gray-700">
          {{ adminPanelStore.activeEntity.entityName }}
        </h2>
        <p class="text-xs text-gray-400">
          {{ adminPanelStore.activeEntity.fullBasePath }}
        </p>
      </div>
    </div>

    <div v-if="adminPanelStore.activeEntity" class="flex-1 overflow-y-auto p-4">
      <div
        v-if="fetchEntityRecordsStatus === 'pending'"
        class="flex h-64 items-center justify-center"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
        />
      </div>

      <div
        v-else-if="fetchEntityRecordsStatus === 'error'"
        class="flex h-64 items-center justify-center text-sm text-red-500"
      >
        Failed to load data
      </div>

      <template v-else>
        <LazyLoadList
          v-slot="{ item, index }"
          :items="entityRecords"
          :show-loader="showNextPageLoader"
          :fetch-visible-item-number="4"
          list-class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
          @fetch-next-page="fetchEntityRecordsNextPage()"
        >
          <div
            class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs font-medium text-gray-400"
                >#{{ index + 1 }}</span
              >
              <span
                v-if="item.id !== undefined"
                class="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500"
              >
                ID: {{ item.id }}
              </span>
            </div>
            <div class="space-y-2">
              <div
                v-for="key in getObjectKeys(item)"
                :key="key"
                class="flex items-start gap-2"
              >
                <span
                  class="mt-0.5 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500"
                >
                  {{ key }}
                </span>
                <FieldValue :value="item[key]" />
              </div>
            </div>
          </div>
        </LazyLoadList>
      </template>
    </div>

    <div
      v-else
      class="flex flex-1 items-center justify-center text-sm text-gray-400"
    >
      Select an endpoint from the sidebar
    </div>
  </div>
</template>
