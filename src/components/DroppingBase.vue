<template>
  <div ref="droppingElement" as="div" class="relative">
    <!-- <div v-element-hover="setTooltipIsHovered" @click="() => open"> -->
    <!--   <slot name="trigger" /> -->
    <!-- </div> -->

    <DroppingBody
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

const droppingElement = useTemplateRef<HTMLDivElement>("droppingElement")
const dropdownIsHovered = useElementHover(droppingElement)
const { height: triggerHeight } = useElementSize(droppingElement)

const open = defineModel<boolean>()
</script>
