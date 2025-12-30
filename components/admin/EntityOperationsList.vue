<script setup lang="tsx">
import type { ParsedEntity } from "../../stores/adminPanel/types"

interface Props {
  entity: ParsedEntity | undefined
}

const props = defineProps<Props>()
</script>

<template>
  <div v-if="props.entity" class="flex justify-center">
    <div class="w-full max-w-2xl">
      <!-- Entity name header -->
      <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-[#dbdbe0]">
          {{ props.entity.entityName }}
        </h2>
        <div class="mt-2 text-sm text-gray-400">
          {{
            props.entity.namespace
              ? `Namespace: ${props.entity.namespace}`
              : "No namespace"
          }}
        </div>
      </div>

      <!-- Base operations -->
      <div class="mb-8">
        <h3
          class="mb-4 border-b border-[#2d304f] pb-2 text-lg font-semibold text-[#dbdbe0]"
        >
          Base Operations
        </h3>
        <div class="space-y-3">
          <div
            v-if="props.entity.listOperation"
            class="flex items-center justify-between rounded-lg bg-[#1a1d3a] p-4"
          >
            <div>
              <span class="font-mono text-sm text-green-400">GET</span>
              <span class="ml-3 text-[#dbdbe0]"
                >List {{ props.entity.entityName }}</span
              >
            </div>
            <div class="text-sm text-gray-400">
              {{ props.entity.fullBasePath }}
            </div>
          </div>
          <div
            v-if="props.entity.createOperation"
            class="flex items-center justify-between rounded-lg bg-[#1a1d3a] p-4"
          >
            <div>
              <span class="font-mono text-sm text-blue-400">POST</span>
              <span class="ml-3 text-[#dbdbe0]"
                >Create {{ props.entity.entityName }}</span
              >
            </div>
            <div class="text-sm text-gray-400">
              {{ props.entity.fullBasePath }}
            </div>
          </div>
        </div>
      </div>

      <!-- Detail operations -->
      <div v-if="props.entity.details.length > 0" class="mb-8">
        <h3
          class="mb-4 border-b border-[#2d304f] pb-2 text-lg font-semibold text-[#dbdbe0]"
        >
          Detail Operations
        </h3>
        <div class="space-y-3">
          <div
            v-for="(detail, index) in props.entity.details"
            :key="index"
            class="rounded-lg bg-[#1a1d3a] p-4"
          >
            <div class="mb-2 flex items-center">
              <span class="font-mono rounded bg-[#2d304f] px-2 py-1 text-xs">
                {{ detail.paramName }}
              </span>
              <span class="ml-3 text-sm text-gray-400"
                >({{ detail.paramType }})</span
              >
            </div>
            <div class="space-y-2">
              <div
                v-for="(op, opIndex) in detail.operations"
                :key="opIndex"
                class="flex items-center justify-between"
              >
                <div>
                  <span
                    :class="`font-mono text-sm ${
                      op.method === 'GET'
                        ? 'text-green-400'
                        : op.method === 'POST'
                          ? 'text-blue-400'
                          : op.method === 'PUT'
                            ? 'text-yellow-400'
                            : op.method === 'PATCH'
                              ? 'text-yellow-400'
                              : op.method === 'DELETE'
                                ? 'text-red-400'
                                : 'text-gray-400'
                    }`"
                  >
                    {{ op.method }}
                  </span>
                  <span class="ml-3 text-[#dbdbe0]">
                    {{
                      op.method === "GET"
                        ? "Retrieve"
                        : op.method === "PUT" || op.method === "PATCH"
                          ? "Update"
                          : op.method === "DELETE"
                            ? "Delete"
                            : "Execute"
                    }}
                    {{ props.entity.entityName }}
                  </span>
                </div>
                <div class="text-sm text-gray-400">{{ op.fullPath }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom methods -->
      <div v-if="props.entity.methods.length > 0" class="mb-8">
        <h3
          class="mb-4 border-b border-[#2d304f] pb-2 text-lg font-semibold text-[#dbdbe0]"
        >
          Custom Methods
        </h3>
        <div class="space-y-3">
          <div
            v-for="(method, index) in props.entity.methods"
            :key="index"
            class="rounded-lg bg-[#1a1d3a] p-4"
          >
            <div class="mb-2">
              <span
                class="font-mono rounded bg-[#2d304f] px-2 py-1 text-sm text-[#dbdbe0]"
              >
                {{ method.methodName }}
              </span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(op, opIndex) in method.operations"
                :key="opIndex"
                class="flex items-center justify-between"
              >
                <div>
                  <span
                    :class="`font-mono text-sm ${
                      op.method === 'GET'
                        ? 'text-green-400'
                        : op.method === 'POST'
                          ? 'text-blue-400'
                          : op.method === 'PUT'
                            ? 'text-yellow-400'
                            : op.method === 'PATCH'
                              ? 'text-yellow-400'
                              : op.method === 'DELETE'
                                ? 'text-red-400'
                                : 'text-gray-400'
                    }`"
                  >
                    {{ op.method }}
                  </span>
                  <span class="ml-3 text-[#dbdbe0]">{{
                    method.methodName
                  }}</span>
                </div>
                <div class="text-sm text-gray-400">{{ op.fullPath }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
