<script setup lang="ts">
import type { OpenAPIV3 } from "openapi-types"
import { computed, ref, watch } from "vue"
import { FetchError, ofetch } from "ofetch"
import FormErrors from "./FormErrors.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"
import type { RequestStatus } from "../../types"

const HTTP_STATUS_BAD_REQUEST = 400

interface Properties {
  baseUrl: string
  show: boolean
}

const properties = defineProps<Properties>()
const emit = defineEmits<{
  (event: "close"): void
  (event: "created"): void
}>()

const adminPanelStore = useAdminPanelStore()

interface SchemaField {
  description?: string
  isReadOnly: boolean
  key: string
  type: "boolean" | "integer" | "number" | "object" | "string"
}

const schemaFields = computed<SchemaField[]>(() => {
  const schema = adminPanelStore.activeEntityCreateSchema
  if (!schema || !("properties" in schema) || !schema.properties) return []
  const { properties } = schema

  return Object.entries(properties)
    .filter(([, prop]) => {
      if (!prop || typeof prop !== "object") return false
      const p = prop as OpenAPIV3.SchemaObject
      return p.readOnly !== true
    })
    .map(([key, prop]) => {
      const p = prop as OpenAPIV3.SchemaObject
      return {
        description: p.description,
        isReadOnly: p.readOnly === true,
        key,
        type: (["boolean", "integer", "number", "object"].includes(p.type ?? "")
          ? p.type
          : "string") as SchemaField["type"],
      }
    })
})

const form = ref<Record<string, unknown>>({})
const sendStatus = ref<RequestStatus>("idle")
const formErrors = ref<Record<string, string[] | undefined>>()
const requestError = ref<string>()

function buildBlankForm(): Record<string, unknown> {
  const blank: Record<string, unknown> = {}
  for (const field of schemaFields.value) {
    switch (field.type) {
      case "boolean": {
        blank[field.key] = false
        break
      }
      case "integer":
      case "number": {
        blank[field.key] = undefined
        break
      }
      default: {
        blank[field.key] = ""
        break
      }
    }
  }
  return blank
}

watch(
  () => properties.show,
  (isShown) => {
    if (isShown) {
      form.value = buildBlankForm()
      sendStatus.value = "idle"
      formErrors.value = undefined
      requestError.value = undefined
    }
  },
)

const submitUrl = computed(() => {
  const entity = adminPanelStore.activeEntity
  if (!entity?.fullBasePath) return ""
  return `${properties.baseUrl}${entity.fullBasePath}`
})

async function handleSubmit(submitEvent: SubmitEvent) {
  submitEvent.preventDefault()
  sendStatus.value = "pending"
  formErrors.value = undefined
  requestError.value = undefined

  try {
    await ofetch(submitUrl.value, {
      body: form.value,
      method: "post",
    })
    sendStatus.value = "success"
    emit("created")
  } catch (catchError) {
    if (catchError instanceof FetchError && catchError.statusCode === HTTP_STATUS_BAD_REQUEST) {
      formErrors.value = catchError.data as Record<string, string[] | undefined>
    } else {
      requestError.value = "Failed to create record"
    }
    sendStatus.value = "error"
  }
}

function handleClose() {
  emit("close")
}
</script>

<template>
  <div
    v-if="properties.show"
    class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 pt-[10vh]"
    @click.self="handleClose()"
  >
    <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">
          Create {{ adminPanelStore.activeEntity?.entityName ?? "record" }}
        </h2>
        <button
          class="text-gray-400 transition-colors hover:text-gray-600"
          @click="handleClose()"
        >
          ✕
        </button>
      </div>

      <form class="px-6 py-4" @submit="handleSubmit">
        <div class="space-y-4">
          <div
            v-for="field in schemaFields"
            :key="field.key"
          >
            <label class="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
              {{ field.key }}
            </label>

            <input
              v-if="field.type === 'boolean'"
              v-model="form[field.key]"
              class="h-4 w-4"
              type="checkbox"
            />

            <input
              v-else-if="field.type === 'integer' || field.type === 'number'"
              v-model.number="form[field.key]"
              class="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400"
              type="number"
            />

            <textarea
              v-else-if="field.key === 'description'"
              v-model="form[field.key]"
              class="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400"
              rows="3"
            />

            <input
              v-else
              v-model="form[field.key]"
              class="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400"
              type="text"
            />

            <p
              v-if="field.description"
              class="mt-1 text-xs text-gray-400"
            >
              {{ field.description }}
            </p>
          </div>
        </div>

        <FormErrors :errors="formErrors" class="mt-4" />

        <div
          v-if="requestError"
          class="mt-2 text-sm text-red-500"
        >
          {{ requestError }}
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            class="rounded border border-gray-300 px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            type="button"
            @click="handleClose()"
          >
            Cancel
          </button>
          <button
            class="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            :disabled="sendStatus === 'pending'"
            type="submit"
          >
            {{ sendStatus === "pending" ? "Creating..." : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
