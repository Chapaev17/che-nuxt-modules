<template>
  <div>
    <div :class="listClass">
      <div v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index" />

        <div
          v-if="index + 1 === itemNumberForFetchWhenVisible"
          v-element-visibility="onElementVisibility"
        />
      </div>
    </div>

    <MainLoader
      v-element-visibility="onElementVisibility"
      v-if="showLoader"
      :class="items && items.length > 0 ? 'h-[250px]' : 'h-[60vh]'"
      :wh="60"
    />
  </div>
</template>

<script setup lang="ts" generic="ElementType">
import { vElementVisibility } from "@vueuse/components"

const properties = defineProps({
  items: {
    type: Array as PropType<ElementType[]>,
    required: false,
  },
  showLoader: { type: Boolean, required: true },
  listClass: { type: String, required: false },
  fetchVisibleItemNumber: { type: Number, required: false, default: 6 },
})

const emit = defineEmits<{
  (event: "fetchNextPage"): Promise<void>
}>()

const itemNumberForFetchWhenVisible = computed(() => {
  if (properties.items === undefined) return 0
  const length = properties.items?.length
  return Math.round(length * (2 / 3))
})

async function onElementVisibility(state: boolean) {
  if (state === true && properties.items !== undefined)
    await emit("fetchNextPage")
}
</script>
