<template>
  <div
    v-on-click-outside="() => setOpen(false)"
    class="relative"
    ref="tooltip"
  >
    <div v-element-hover="setOpen" @click="onTriggerClick">
      <slot name="trigger" />
    </div>

    <DroppingBody
      v-model="open"
      :trigger-height="triggerHeight"
      :distance="distance"
      :position="position"
      :unmount-on-close="unmountOnClose"
    >
      <slot />
    </DroppingBody>
  </div>
</template>

<script setup lang="ts">
import { vElementHover, vOnClickOutside } from "@vueuse/components"

import DroppingBody from "./DroppingBody.vue"

const properties = defineProps({
  distance: {
    type: Number,
    required: false,
    defautl: 0,
  },
  position: {
    type: String as PropType<
      | "top-start"
      | "top-center"
      | "top-end"
      | "bottom-start"
      | "bottom-center"
      | "bottom-end"
    >,
    required: false,
    default: "bottom-center",
  },
  unmountOnClose: {
    type: Boolean,
    required: false,
    default: false,
  },
  openOnClick: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const tooltip = useTemplateRef<HTMLDivElement>("tooltip")
const { height: triggerHeight } = useElementSize(tooltip)

const open = ref<boolean>(false)

function setOpen(value: boolean) {
  open.value = value
}

function onTriggerClick() {
  if (properties.openOnClick) setOpen(true)
}
</script>
