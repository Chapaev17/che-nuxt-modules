<template>
  <div v-if="!(unmountOnClose === true && show === false)">
    <div class="relative z-10" v-show="show">
      <div
        class="z-11 fixed bottom-0 left-0 right-0 top-0 overflow-y-scroll overscroll-none bg-gray-500 bg-opacity-75 opacity-0"
        ref="background"
        @click="close"
      />

      <div
        class="z-9 fixed bottom-0 right-0 top-0 w-[320px] overflow-y-scroll overscroll-none bg-white"
        style="transform: translateX(100%)"
        ref="body"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import anime from "animejs"

const properties = defineProps({
  open: { type: Boolean, required: false, default: undefined },
  unmountOnClose: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits<{
  (emit: "setOpen", value: boolean): void
}>()

const openModel = defineModel<boolean>()
const valideOpen = computed(() =>
  properties.open === undefined ? openModel.value : properties.open,
)

const background = useTemplateRef("background")
const body = useTemplateRef("body")
const backgroundAnimation = ref<anime.AnimeInstance>()
const bodyAnimation = ref<anime.AnimeInstance>()
const backgroundShow = ref<boolean>(false)
const bodyShow = ref<boolean>(false)

const show = computed(
  () => backgroundShow.value === true || bodyShow.value === true,
)

watch(valideOpen, animate)

function setValideOpen(value: boolean) {
  emit("setOpen", value)
  openModel.value = value
}

function close() {
  setValideOpen(false)
}

async function animate(open: boolean | undefined) {
  if (open === undefined) return
  backgroundAnimation.value?.pause()
  bodyAnimation.value?.pause()
  backgroundShow.value = true
  bodyShow.value = true
  await nextTick()

  if (body.value)
    bodyAnimation.value = anime({
      targets: body.value,
      duration: 500,
      translateX: open === true ? "0%" : "100%",
      easing: "easeInOutQuad",
      complete() {
        if (open === false) bodyShow.value = false
      },
    })

  if (background.value)
    bodyAnimation.value = anime({
      targets: background.value,
      duration: 500,
      opacity: open === true ? 1 : 0,
      easing: "easeInOutQuad",
      complete() {
        if (open === false) backgroundShow.value = false
      },
    })
}
</script>
