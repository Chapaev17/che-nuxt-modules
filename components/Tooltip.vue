<template>
  <div v-on-click-outside="() => setTooltipIsHovered(false)" class="relative">
    <button
      v-element-hover="setTooltipIsHovered"
      @click="() => setTooltipIsHovered(true)"
    >
      <slot name="button" />
    </button>

    <div
      v-show="showTooltipBody"
      ref="tooltipBody"
      class="absolute z-10 opacity-0 focus:outline-none sm:left-1/2"
      style="transform: scale(0.95)"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import anime from "animejs"
import { vElementHover, vOnClickOutside } from "@vueuse/components"

const tooltipBody = ref()
const showTooltipBody = ref<boolean>(false)
const animation = ref<anime.AnimeInstance>()

function setTooltipIsHovered(open: boolean) {
  animation.value?.pause()
  showTooltipBody.value = true
  animation.value = anime({
    targets: tooltipBody.value,
    opacity: open === true ? 1 : 0,
    scale: open === true ? 1 : 0.95,
    duration: 100,
    easing: "easeOutQuad",
    complete() {
      if (open === false) showTooltipBody.value = false
    },
  })
}
</script>
