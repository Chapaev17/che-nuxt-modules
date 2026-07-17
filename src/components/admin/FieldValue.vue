<script setup lang="ts">
interface Props {
  value: any
}
defineProps<Props>()

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === "object" && !Array.isArray(val)
}
</script>

<template>
  <span v-if="value === null || value === undefined" class="text-gray-300">
    —
  </span>
  <span
    v-else-if="typeof value === 'boolean'"
    class="inline-flex rounded px-1.5 py-0.5 text-xs font-medium"
    :class="
      value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    "
  >
    {{ value ? "Yes" : "No" }}
  </span>
  <span v-else-if="typeof value === 'number'" class="font-mono text-sm text-gray-600">
    {{ value.toLocaleString() }}
  </span>
  <span v-else-if="typeof value === 'string'" class="text-sm text-gray-700">
    {{ value }}
  </span>
  <div v-else-if="Array.isArray(value)" class="space-y-1">
    <FieldValue
      v-for="(el, i) in value"
      :key="i"
      :value="el"
      class="ml-3"
    />
  </div>
  <div v-else-if="isObject(value)" class="ml-3 space-y-1 rounded border border-gray-100 bg-gray-50 p-2">
    <div
      v-for="(v, k) in value"
      :key="k"
      class="flex items-start gap-2"
    >
      <span class="mt-0.5 shrink-0 font-mono text-xs text-gray-400">
        {{ k }}:
      </span>
      <FieldValue :value="v" />
    </div>
  </div>
  <span v-else class="text-sm text-gray-400">{{ String(value) }}</span>
</template>
