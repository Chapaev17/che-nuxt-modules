<script setup lang="tsx">
import type { ParsedEntity } from "../../stores/adminPanel/types"
import { computed } from "vue"

interface Props {
  entity: ParsedEntity | undefined
}

const props = defineProps<Props>()

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
}

const methodLabels: Record<string, string> = {
  GET: "Retrieve",
  POST: "Create",
  PUT: "Update",
  PATCH: "Update",
  DELETE: "Delete",
}
</script>

<template>
  <div v-if="props.entity" class="mx-auto w-full max-w-3xl px-4 py-6">
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold text-gray-800">
          {{ props.entity.entityName }}
        </h2>
        <span
          v-if="props.entity.namespace"
          class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500"
        >
          {{ props.entity.namespace }}
        </span>
      </div>
      <p class="mt-1 text-xs text-gray-400">
        {{ props.entity.fullBasePath }}
      </p>
    </div>

    <!-- Base operations -->
    <div class="mb-8">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Base Operations
      </h3>
      <div class="space-y-2">
        <div
          v-if="props.entity.listOperation"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <span
              class="rounded px-2 py-0.5 font-mono text-xs font-semibold bg-green-100 text-green-700"
            >
              GET
            </span>
            <span class="text-sm text-gray-700"
              >List {{ props.entity.entityName }}</span
            >
          </div>
          <span class="text-xs text-gray-400">{{
            props.entity.fullBasePath
          }}</span>
        </div>
        <div
          v-if="props.entity.createOperation"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <span
              class="rounded px-2 py-0.5 font-mono text-xs font-semibold bg-blue-100 text-blue-700"
            >
              POST
            </span>
            <span class="text-sm text-gray-700"
              >Create {{ props.entity.entityName }}</span
            >
          </div>
          <span class="text-xs text-gray-400">{{
            props.entity.fullBasePath
          }}</span>
        </div>
      </div>
    </div>

    <!-- Detail operations -->
    <div v-if="props.entity.details.length > 0" class="mb-8">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Detail Operations
      </h3>
      <div class="space-y-3">
        <div
          v-for="(detail, index) in props.entity.details"
          :key="index"
          class="rounded-lg border border-gray-200 bg-white"
        >
          <div
            class="flex items-center gap-2 border-b border-gray-100 px-4 py-2"
          >
            <span
              class="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600"
            >
              {{ detail.paramName }}
            </span>
            <span class="text-xs text-gray-400">({{ detail.paramType }})</span>
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="(op, opIndex) in detail.operations"
              :key="opIndex"
              class="flex items-center justify-between px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <span
                  class="rounded px-2 py-0.5 font-mono text-xs font-semibold"
                  :class="methodColors[op.method] || 'bg-gray-100 text-gray-600'"
                >
                  {{ op.method }}
                </span>
                <span class="text-sm text-gray-700">
                  {{ methodLabels[op.method] || "Execute" }}
                  {{ props.entity.entityName }}
                </span>
              </div>
              <span class="text-xs text-gray-400">{{ op.fullPath }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom methods -->
    <div v-if="props.entity.methods.length > 0" class="mb-8">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Custom Methods
      </h3>
      <div class="space-y-3">
        <div
          v-for="(method, index) in props.entity.methods"
          :key="index"
          class="rounded-lg border border-gray-200 bg-white"
        >
          <div
            class="flex items-center gap-2 border-b border-gray-100 px-4 py-2"
          >
            <span
              class="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-700"
            >
              {{ method.methodName }}
            </span>
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="(op, opIndex) in method.operations"
              :key="opIndex"
              class="flex items-center justify-between px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <span
                  class="rounded px-2 py-0.5 font-mono text-xs font-semibold"
                  :class="methodColors[op.method] || 'bg-gray-100 text-gray-600'"
                >
                  {{ op.method }}
                </span>
                <span class="text-sm text-gray-700">{{
                  method.methodName
                }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ op.fullPath }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
