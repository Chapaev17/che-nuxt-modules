<template>
  <UseElementBounding v-if="show" v-slot="{ left, bottom, width }">
    <div
      ref="openElement"
      class="absolute z-10 origin-top-right opacity-0 focus:outline-none"
      style="transform: scale(0.95)"
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
import { useWindowSize } from "@vueuse/core"
import { animate } from "animejs"
import { computed, nextTick, ref, watch } from "vue"

import type { JSAnimation } from "animejs"
import type { PropType } from "vue"

// as PropType<"bottom-start" | "bottom-end">
const properties = defineProps({
  distance: {
    defautl: 0,
    required: false,
    type: Number,
  },
  position: {
    default: "bottom-start",
    required: false,
    type: String as PropType<
      | "bottom-center"
      | "bottom-end"
      | "bottom-start"
      | "top-center"
      | "top-end"
      | "top-start"
    >,
  },
  triggerHeight: {
    required: true,
    type: Number,
  },
  unmountOnClose: {
    default: false,
    required: false,
    type: Boolean,
  },
})

const animation = ref<JSAnimation>()
const { height: windowHeight, width: windowWidth } = useWindowSize()

const needShow = defineModel<boolean>()
const openElement = ref()
const show = ref<boolean>(false)

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
    bottom?: number
    left?: number
    paddingBottom?: number
    paddingLeft: number
    paddingRight?: number
    paddingTop?: number
    right?: number
    top?: number
  }

  if (parameters.includes("top") || parameters.includes("bottom")) {
    if (parameters.includes("start")) {
      styles.left = 0
    }
    if (parameters.includes("center")) {
      styles.left = (width / 2) * -1 + triggerWidth / 2
    }
    if (parameters.includes("end")) {
      styles.left = (width - triggerWidth) * -1
    }
  }

  if (parameters.includes("left") || parameters.includes("right")) {
    if (parameters.includes("start")) {
      styles.top = properties.triggerHeight * -1
    }
    if (parameters.includes("center")) {
      styles.bottom = (height / 2) * -1
    }
    if (parameters.includes("end")) {
      styles.bottom = properties.triggerHeight
    }
  }

  if (parameters.includes("left")) {
    styles.left = width * -1
  }
  if (parameters.includes("right")) {
    styles.left = triggerWidth
  }

  function fixedOutsidePosition(
    oldPosition: number,
    toStart: number,
    toEnd: number,
  ) {
    // Indentations taking into account the old position.
    const currentToStart = toStart + oldPosition
    const currentToEnd = toEnd - oldPosition

    if (currentToStart < 0) {
      return toStart * -1
    }
    if (currentToEnd > 0) {
      return oldPosition
    }

    // Need fix outsite end.
    const needFixPostionValue = oldPosition - currentToEnd * -1
    return currentToStart - oldPosition < needFixPostionValue * -1
      ? currentToStart * -1 + oldPosition
      : needFixPostionValue
  }

  // Fix start or end is outside.
  if (styles.left !== undefined) {
    styles.left = fixedOutsidePosition(styles.left, toLeft, toRight)
  }

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
    if (noSpaceInBottom && toTop > bottomSpace) {
      bodyToTop()
    } else {
      bodyToBottom()
    }
  }
  if (parameters.includes("top")) {
    if (toTop < height + properties.triggerHeight && toTop < bottomSpace) {
      bodyToBottom()
    } else {
      bodyToTop()
    }
  }

  return {
    bottom: styles.bottom && `${styles.bottom}px`,
    left: styles.left && `${styles.left}px`,
    paddingBottom: styles.paddingBottom && `${styles.paddingBottom}px`,
    paddingLeft: styles.paddingLeft && `${styles.paddingLeft}px`,

    paddingRight: styles.paddingRight && `${styles.paddingRight}px`,
    paddingTop: styles.paddingTop && `${styles.paddingTop}px`,
    right: styles.right && `${styles.right}px`,
    top: styles.top && `${styles.top}px`,
  }
}

async function runAnimate(open: boolean | undefined) {
  if (open === undefined) {
    return
  }
  animation.value?.pause()
  show.value = true
  await nextTick()
  animation.value = animate(openElement.value, {
    duration: 100,
    ease: "outQuad",
    onComplete() {
      if (open === false) {
        show.value = false
      }
    },
    opacity: open === true ? 1 : 0,
    scale: open === true ? 1 : 0.95,
  })
}

watch(needShow, runAnimate)
</script>
