<template>
  <div ref="dropdown" as="div" class="relative">
    <slot name="trigger" />

    <DroppingBody
      ref="dropdown"
      v-model="dropdownIsHovered"
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
import DroppingBody from "./DroppingBody.vue"

defineProps({
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
    default: "bottom-start",
  },
  unmountOnClose: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const dropdown = useTemplateRef<HTMLDivElement>("dropdown")
const dropdownIsHovered = useElementHover(dropdown)
const { height: triggerHeight } = useElementSize(dropdown)
</script>
