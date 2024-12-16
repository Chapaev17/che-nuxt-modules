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
                      setSelectedCardIndex(index)
                      onButtonClick(tab)
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

    <div>
      <div ref="cardText">
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

const cardText = ref<Element>()

const defaultContainerMarginRightActive = computed(() =>
  viewport.isLessThan("sm"),
)

const valideContainerMarginRightActive = computed(() =>
  properties.containerMarginRightActive !== undefined
    ? properties.containerMarginRightActive
    : defaultContainerMarginRightActive.value,
)

function onButtonClick(tab: T) {
  emit("button-click", tab)
}

function animate({
  element,
  reverse,
  complete,
}: {
  element: Element
  reverse: boolean | undefined
  complete?: () => void
}) {
  anime({
    targets: element,
    width: ["1%", "100%"],
    duration: 50,
    opacity: [0, 1],
    easing: "easeInOutQuad",
    direction: reverse === true ? "reverse" : "normal",
    complete,
  })
}

function setSelectedCardIndex(value: number) {
  if (cardText.value)
    animate({
      element: cardText.value,
      reverse: true,
      complete: () => {
        if (cardText.value) {
          selectedCardIndex.value = value
          animate({ element: cardText.value, reverse: false })
        }
      },
    })
}
</script>
