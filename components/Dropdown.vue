<template>
  <div v-element-hover="setDropdownIsHovered" as="div" class="relative">
    <slot name="button" />

    <div
      v-show="showDropdownBody"
      ref="dropdownBody"
      class="absolute left-0 z-10 origin-top-right opacity-0 focus:outline-none"
      style="transform: scale(0.95)"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import anime from "animejs"
import { vElementHover } from "@vueuse/components"

const dropdownBody = ref()
const showDropdownBody = ref<boolean>(false)
const animation = ref<anime.AnimeInstance>()

function setDropdownIsHovered(open: boolean) {
  animation.value?.pause()
  showDropdownBody.value = true
  animation.value = anime({
    targets: dropdownBody.value,
    opacity: open === true ? 1 : 0,
    scale: open === true ? 1 : 0.95,
    duration: 100,
    easing: "easeOutQuad",
    complete() {
      if (open === false) showDropdownBody.value = false
    },
  })
}
</script>
