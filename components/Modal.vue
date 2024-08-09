<template>
  <HeadlessTransitionRoot as="template" :show="valideShow">
    <HeadlessDialog class="relative z-10" @close="setClose">
      <HeadlessTransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </HeadlessTransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <HeadlessTransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <HeadlessDialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full"
              :style="`max-width: ${maxWidth}`"
            >
              <slot />
            </HeadlessDialogPanel>
          </HeadlessTransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<script setup lang="ts">
const properties = defineProps({
  show: { type: Boolean, default: undefined },
  maxWidth: { type: String, default: "520px" },
})

const showModel = defineModel<boolean>("show")
const valideShow = computed(() =>
  properties.show === undefined ? showModel.value : properties.show,
)

const emit = defineEmits<{
  (emit: "setVisible", value: boolean): void
}>()

function setClose() {
  emit("setVisible", false)
  showModel.value = false
}
</script>
