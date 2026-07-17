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

    <div
      v-if="showLoader"
      v-element-visibility="onElementVisibility"
      :class="items && items.length > 0 ? 'h-[250px]' : 'h-[60vh]'"
    >
      <MainLoader :wh="60" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="ElementType">
import { ref } from "vue"
import { vElementVisibility } from "@vueuse/components"
import MainLoader from "./MainLoader.vue"

import type { PropType } from "vue"

const properties = defineProps({
  fetchVisibleItemNumber: { required: true, type: Number },
  items: {
    required: false,
    type: Array as PropType<ElementType[]>,
  },
  listClass: { required: false, type: String },
  showLoader: { required: true, type: Boolean },
})

const emit = defineEmits<(event: "fetchNextPage") => Promise<void>>()

const isFetchingNext = ref(false)

async function onElementVisibility(state: boolean) {
  if (
    state === true &&
    properties.items !== undefined &&
    properties.items.length > 0 &&
    !isFetchingNext.value
  ) {
    isFetchingNext.value = true
    try {
      await emit("fetchNextPage")
    } finally {
      isFetchingNext.value = false
    }
  }
}
</script>
