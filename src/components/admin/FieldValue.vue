<script setup lang="ts">
interface Properties {
  value: unknown
}
defineProps<Properties>()

defineOptions({ name: "FieldValue" })

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
</script>

<template>
  <template v-if="value === null || value === undefined">
    <span class="text-gray-300">—</span>
  </template>
  <template v-else-if="typeof value === 'boolean'">
    <span
      class="inline-flex rounded px-1.5 py-0.5 text-xs font-medium"
      :class="
        value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      "
    >
      {{ value ? "Yes" : "No" }}
    </span>
  </template>
  <template v-else-if="typeof value === 'number'">
    <span class="font-mono text-sm text-gray-600">
      {{ value.toLocaleString() }}
    </span>
  </template>
  <template v-else-if="typeof value === 'string'">
    <span class="text-sm text-gray-700">{{ value }}</span>
  </template>
  <template v-else-if="Array.isArray(value)">
    <div class="space-y-1">
      <div v-for="(el, i) in value" :key="i" class="ml-3">
        <FieldValue :value="el" />
      </div>
    </div>
  </template>
  <template v-else-if="isObject(value)">
    <div class="ml-3 space-y-1 rounded border border-gray-100 bg-gray-50 p-2">
      <div v-for="(v, k) in value" :key="k" class="flex items-start gap-2">
        <span class="mt-0.5 shrink-0 font-mono text-xs text-gray-400">
          {{ k }}:
        </span>
        <FieldValue :value="v" />
      </div>
    </div>
  </template>
  <template v-else>
    <span class="text-sm text-gray-400">{{ String(value) }}</span>
  </template>
</template>
