<template>
  <div>
    <div ref="containerElement" class="container" />

    <div :style="`margin-left: ${containerLeftMargin}`">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const properties = defineProps({
  active: { type: Boolean, required: false, default: true },
})

const containerElement = ref<HTMLDivElement>()
const containerLeftMargin = ref()

if (import.meta.client) {
  useResizeObserver(document.documentElement, () => {
    if (containerElement.value)
      if (properties.active) {
        const computedStyle = getComputedStyle(containerElement.value)
        const marginLeftInPixel = computedStyle.getPropertyValue("margin-left")
        containerLeftMargin.value = marginLeftInPixel
      } else {
        containerLeftMargin.value = "0px"
      }
  })
}
</script>
