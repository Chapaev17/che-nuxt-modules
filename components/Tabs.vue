<template>
  <div>
    <ChContainerMarginRight
      :active="valideContainerMarginRightActive === true"
      class="overflow-x-auto"
    >
      <div
        :class="
          valideContainerMarginRightActive === true &&
          'pl-[15px] sm:pl-[30px] xl:pl-0'
        "
      >
        <div class="w-full overflow-auto">
          <div class="flex pb-1.5">
            <div v-for="(tab, index) in tabs" :key="index" class="flex">
              <div v-if="index !== 0" class="flex flex-col justify-between">
                <div />

                <div class="h-0.5 w-[45px] bg-slate-300" />
              </div>

              <div>
                <button
                  :class="
                    selectedCardIndex === index
                      ? 'font-bold text-blue-700'
                      : 'font-normal text-zinc-800'
                  "
                  class="whitespace-nowrap px-2.5 pb-2.5 font-['Manrope'] text-lg"
                  @click="
                    () => {
                      onButtonClick(index, tab)
                    }
                  "
                >
                  {{ tab.title }}
                </button>

                <div
                  class="h-0.5"
                  :class="
                    selectedCardIndex === index
                      ? 'bg-blue-700'
                      : 'bg-slate-300'
                  "
                />
              </div>

              <div v-if="index === tabs.length - 1" class="w-5" />
            </div>
          </div>
        </div>
      </div>
    </ChContainerMarginRight>

    <div class="overflow-hidden">
      <div ref="card">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { title: string }">
import anime from "animejs"

const properties = defineProps({
  tabs: {
    type: Array as PropType<T[]>,
    required: true,
  },
  containerMarginRightActive: {
    type: Boolean,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits<{
  (event: "button-click", tab: T): void
}>()

const viewport = useViewport()

const selectedCardIndex = defineModel<number>("active-index")

const card = ref<Element>()
const cardAnimation = ref<anime.AnimeInstance>()

const defaultContainerMarginRightActive = computed(() =>
  viewport.isLessThan("sm"),
)

const valideContainerMarginRightActive = computed(() =>
  properties.containerMarginRightActive !== undefined
    ? properties.containerMarginRightActive
    : defaultContainerMarginRightActive.value,
)

function onButtonClick(index: number, tab: T) {
  emit("button-click", tab)
  setSelectedCardIndex(index)
}

function setSelectedCardIndex(value: number) {
  const oldValue = selectedCardIndex.value
  const translateXfrom =
    oldValue !== undefined && value > oldValue ? "100%" : "-100%"
  selectedCardIndex.value = value
  if (oldValue !== value) {
    cardAnimation.value?.pause()
    cardAnimation.value = anime({
      targets: card.value,
      opacity: [0, 1],
      translateX: [translateXfrom, "0%"],
      duration: 100,
      easing: "easeOutQuad",
    })
  }
}
</script>
