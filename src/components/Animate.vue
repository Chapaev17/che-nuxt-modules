<template>
  <div>
    <!-- <Transition -->
    <!--   mode="out-in" -->
    <!--   @before-enter="onBeforeEnter" -->
    <!--   @enter="onEnter" -->
    <!--   @after-enter="onAfterEnter" -->
    <!--   @enter-cancelled="onEnterCancelled" -->
    <!--   @before-leave="onBeforeLeave" -->
    <!--   @leave="onLeave" -->
    <!--   @after-leave="onAfterLeave" -->
    <!--   @leave-cancelled="onLeaveCancelled" -->
    <!--   @enter=" -->
    <!--     (el) => -->
    <!--       anime({ -->
    <!--         targets: el, -->
    <!--         width: '100%', // -> from '28px' to '100%', -->
    <!--         easing: 'easeInOutQuad', -->
    <!--         direction: 'alternate', -->
    <!--       }) -->
    <!--   " -->
    <!-- > -->
    <!-- </Transition> -->
  </div>
</template>

<script setup lang="ts">
import { type AnimeParams } from "animejs"

defineEmits<{
  (event: "before-enter", animeParamameters: AnimeParams): void
  (event: "enter", animeParameters: AnimeParams): void
  (event: "after-enter", animeParameters: AnimeParams): void
  (event: "enter-cancelled", animeParameters: AnimeParams): void
  (event: "before-leave", animeParameters: AnimeParams): void
  (event: "leave", animeParameters: AnimeParams): void
  (event: "after-leave", animeParameters: AnimeParams): void
  (event: "leave-cancelled", animeParameters: AnimeParams): void
}>()
</script>
