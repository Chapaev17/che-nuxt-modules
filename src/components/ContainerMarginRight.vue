<template>
  <div>
    <div ref="containerElement" class="container" />

    <div :style="`margin-left: ${containerLeftMargin}`">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core"
import { ref } from "vue"

const properties = defineProps({
  active: { default: true, required: false, type: Boolean },
})

const containerElement = ref<HTMLDivElement>()
const containerLeftMargin = ref("0px")

function setMarginByContainerMargin() {
  if (containerElement.value) {
    if (properties.active) {
      const computedStyle = getComputedStyle(containerElement.value)
      const marginLeftInPixel = computedStyle.getPropertyValue("margin-left")
      containerLeftMargin.value = marginLeftInPixel
    } else {
      containerLeftMargin.value = "0px"
    }
  }
}

if (import.meta.client) {
  useResizeObserver(document.documentElement, setMarginByContainerMargin)
}
</script>
