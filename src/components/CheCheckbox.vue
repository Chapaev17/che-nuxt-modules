<template>
  <input v-model="model" type="checkbox" />
</template>

<script setup lang="ts">
const properties = defineProps({
  checked: { type: Boolean, default: undefined },
})

const emit = defineEmits<{
  (emit: "change", value: boolean): void
}>()

const model = defineModel<boolean>({
  get(value) {
    return properties.checked === undefined ? value : properties.checked
  },
  set(value) {
    emit("change", value)
    return value
  },
})
</script>
