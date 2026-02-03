<template>
  <UseElementBounding v-slot="{ left, bottom, width }" v-if="show">
    <div
      class="absolute z-10 origin-top-right opacity-0 focus:outline-none"
      style="transform: scale(0.95)"
      ref="openElement"
      :style="getPositionStyles(left, bottom, width)"
    >
      <slot />
    </div>
  </UseElementBounding>

  <div v-else-if="unmountOnClose === false" class="hidden">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { UseElementBounding } from "@vueuse/components"

import { animate, type JSAnimation } from "animejs"

// as PropType<"bottom-start" | "bottom-end">
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
    default: "bottom-start",
  },
  unmountOnClose: {
    type: Boolean,
    required: false,
    default: false,
  },
  triggerHeight: {
    type: Number,
    required: true,
  },
})

const animation = ref<JSAnimation>()
const { width: windowWidth, height: windowHeight } = useWindowSize()

const needShow = defineModel<boolean>()
const openElement = ref()
const show = ref<boolean>(false)

watch(needShow, runAnimate)

const positionParameters = computed(() => properties.position.split("-"))

function getPositionStyles(
  toLeft: number,
  toTop: number,
  triggerWidth: number,
) {
  const width = openElement.value?.offsetWidth
  const height = openElement.value?.clientHeight
  const rightPosition = toLeft + width

  const toRight = windowWidth.value - rightPosition
  // const toBottom = windowHeight.value - toTop + height

  const parameters = positionParameters.value
  const styles = {} as {
    left?: number
    right?: number
    top?: number
    bottom?: number
    paddingTop?: number
    paddingBottom?: number
    paddingLeft: number
    paddingRight?: number
  }

  if (parameters.includes("top") || parameters.includes("bottom")) {
    if (parameters.includes("start")) styles.left = 0
    if (parameters.includes("center"))
      styles.left = (width / 2) * -1 + triggerWidth / 2
    if (parameters.includes("end")) styles.left = (width - triggerWidth) * -1
  }

  if (parameters.includes("left") || parameters.includes("right")) {
    if (parameters.includes("start"))
      styles.top = properties.triggerHeight * -1
    if (parameters.includes("center")) styles.bottom = (height / 2) * -1
    if (parameters.includes("end")) styles.bottom = properties.triggerHeight
  }

  if (parameters.includes("left")) styles.left = width * -1
  if (parameters.includes("right")) styles.left = triggerWidth

  function fixedOutsidePosition(
    oldPosition: number,
    toStart: number,
    toEnd: number,
  ) {
    // Indentations taking into account the old position.
    const currentToStart = toStart + oldPosition
    const currentToEnd = toEnd - oldPosition

    if (currentToStart < 0) return toStart * -1
    if (currentToEnd > 0) return oldPosition

    // Need fix outsite end.
    const needFixPostionValue = oldPosition - currentToEnd * -1
    return currentToStart - oldPosition < needFixPostionValue * -1
      ? currentToStart * -1 + oldPosition
      : needFixPostionValue
  }

  // Fix start or end is outside.
  if (styles.left !== undefined)
    styles.left = fixedOutsidePosition(styles.left, toLeft, toRight)

  function bodyToBottom() {
    styles.paddingTop = properties.distance
  }

  function bodyToTop() {
    styles.bottom = properties.triggerHeight
    styles.paddingBottom = properties.distance
  }

  const bottomSpace =
    toTop > 0 ? windowHeight.value - toTop : windowHeight.value
  if (parameters.includes("bottom")) {
    const noSpaceInBottom = bottomSpace < height
    if (noSpaceInBottom && toTop > bottomSpace) bodyToTop()
    else bodyToBottom()
  }
  if (parameters.includes("top")) {
    if (toTop < height + properties.triggerHeight && toTop < bottomSpace)
      bodyToBottom()
    else bodyToTop()
  }

  return {
    left: styles.left && `${styles.left}px`,
    right: styles.right && `${styles.right}px`,
    top: styles.top && `${styles.top}px`,
    bottom: styles.bottom && `${styles.bottom}px`,

    paddingTop: styles.paddingTop && `${styles.paddingTop}px`,
    paddingBottom: styles.paddingBottom && `${styles.paddingBottom}px`,
    paddingLeft: styles.paddingLeft && `${styles.paddingLeft}px`,
    paddingRight: styles.paddingRight && `${styles.paddingRight}px`,
  }
}

async function runAnimate(open: boolean | undefined) {
  if (open === undefined) return
  animation.value?.pause()
  show.value = true
  await nextTick()
  animation.value = animate(openElement.value, {
    opacity: open === true ? 1 : 0,
    scale: open === true ? 1 : 0.95,
    duration: 100,
    ease: "outQuad",
    onComplete() {
      if (open === false) show.value = false
    },
  })
}
</script>
