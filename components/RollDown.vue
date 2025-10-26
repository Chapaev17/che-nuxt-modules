<template>
  <div>
    <button
      @click="switchNeedShowBody"
      :class="buttonClasses"
      v-if="!buttonDown"
    >
      <slot name="button-content" :open="needShowBody">
        {{ title }}
      </slot>
    </button>

    <div ref="contentElement" class="h-0 overflow-y-hidden">
      <slot />
    </div>

    <button
      @click="switchNeedShowBody"
      :class="buttonClasses"
      v-if="buttonDown"
    >
      <slot name="button-content" :open="needShowBody">
        {{ title }}
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { animate, type JSAnimation } from "animejs"

const minDuration = 250

defineProps({
  title: { type: String, required: false },
  titleFont: { type: String, default: "Manrope" },
  buttonClasses: { type: String, required: false },
  buttonDown: { type: Boolean, required: false, default: false },
})

const contentElement = ref<HTMLDivElement>()
const needShowBody = ref<boolean>(false)
const animation = ref<JSAnimation>()

function getFilledContendElementHeight() {
  if (contentElement.value === undefined) return undefined
  const currentValue = contentElement.value.style.height
  contentElement.value.style.height = "auto" // temporarily change value
  const tweenValue = getComputedStyle(contentElement.value).getPropertyValue(
    "height",
  )
  contentElement.value.style.height = currentValue // reset original value
  return tweenValue
}

function setShowBody(open: boolean) {
  animation.value?.pause()
  const height = getFilledContendElementHeight()
  if (open === true && height === undefined) return

  if (contentElement.value) {
    contentElement.value.style.overflowY = "hidden"
  }

  const duration = animationDuration(height) || 200

  let animationHeight
  if (open === true) animationHeight = height
  else {
    const currentContentHeight = contentElement.value?.style.height
    if (currentContentHeight) {
      const startHeight =
        currentContentHeight === "auto" ? height : currentContentHeight
      animationHeight = startHeight ? [startHeight, "0px"] : "0px"
    }
  }

  if (contentElement.value && animationHeight)
    animation.value = animate(contentElement.value, {
      height: animationHeight,
      duration,
      ease: "inOutQuad",
      onComplete: () => {
        if (open === true && contentElement.value) {
          contentElement.value.style.overflowY = "visible"
          contentElement.value.style.height = "auto"
        }
      },
    })
}

function animationDuration(height: string | undefined) {
  if (height === undefined) return undefined
  const numberHeight = parseHeight(height)
  if (numberHeight === undefined) return undefined
  const rounded = Math.floor(numberHeight / 1)
  return rounded >= minDuration ? rounded : minDuration
}

function parseHeight(height: string) {
  if (height.length > 2 && height.slice(-2) === "px") {
    const clearHeight = height.slice(0, -2)
    const parsedNumber = Number.parseInt(clearHeight, 10)
    return Number.isNaN(parsedNumber) ? undefined : parsedNumber
  }
  return undefined
}

function switchNeedShowBody() {
  const oppositeValue = !needShowBody.value
  needShowBody.value = oppositeValue
  setShowBody(oppositeValue)
}
</script>
