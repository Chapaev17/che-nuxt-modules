<template>
  <div>
    <button class="w-full text-left" @click="switchNeedShowBody">
      <div class="flex justify-between">
        <div class="flex flex-col justify-center">
          <h3
            class="text-xl font-normal leading-normal text-white"
            :class="`font-['${titleFont}']`"
          >
            {{ title }}
          </h3>
        </div>

        <div class="h-100 flex flex-col justify-center p-2.5">
          <IconsArrowRight
            v-if="needShowBody === true"
            class="h-4 w-4 [&>path]:fill-white"
          />

          <IconsArrowDown v-else class="h-4 w-4 [&>path]:fill-white" />
        </div>
      </div>
    </button>

    <div ref="contentElement" class="h-0 overflow-y-hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import anime from "animejs"

defineProps({
  title: { type: String, required: true },
  titleFont: { type: String, default: "Manrope" },
})

const contentElement = ref<HTMLDivElement>()
const needShowBody = ref<boolean>(false)
const animation = ref<anime.AnimeInstance>()

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
  const duration = animationDuration(height) || 200
  animation.value = anime({
    height: open === true ? height : "0px",
    targets: contentElement.value,
    duration,
    easing: "easeInOutQuad",
  })
}

function animationDuration(height: string | undefined) {
  if (height === undefined) return undefined
  const numberHeight = parseHeight(height)
  if (numberHeight === undefined) return undefined
  return Math.floor(numberHeight / 1)
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
