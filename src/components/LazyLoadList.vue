<template>
  <div>
    <div :class="listClass">
      <div v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index" />

        <div
          v-if="
            items && items.length - fetchVisibleItemNumber + 1 === index + 1
          "
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
  fetchVisibleItemNumber: { type: Number, required: true },
})

const emit = defineEmits<{
  (event: "fetchNextPage"): Promise<void>
}>()

async function onElementVisibility(state: boolean) {
  if (state === true && properties.items !== undefined)
    await emit("fetchNextPage")
}
</script>
