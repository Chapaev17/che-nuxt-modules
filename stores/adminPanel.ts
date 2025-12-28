import schemaJson from "../../../src/data/api_schema.json"
import { OpenAPIV3 } from "openapi-types"
import { ref, computed, watch } from "vue"
import { ofetch } from "ofetch"
import { isString } from "lodash-es"

type ComponentName = keyof typeof schemaJson.components.schemas
import { defineStore } from "pinia"

interface MySecurityRequirement {
  cookieAuth?: string[]
  basicAuth?: string[]
}
type MyOpenAPIDocument = Omit<OpenAPIV3.Document, "security"> & {
  security?: MySecurityRequirement[]
}
const apiSchema: MyOpenAPIDocument = schemaJson as any

function getResponsesByComponentName(
  schema: MyOpenAPIDocument,
  name: ComponentName,
) {
  if (!schema.paths) return undefined
  for (const path of Object.entries(schema.paths)) {
    const responses = path[1]
    const pathValue = path[0]
    if (!responses || !pathValue) continue
    const componentGetReference =
      // @ts-expect-error wrong
      responses.get?.responses["200"].content?.["application/json"].schema
        ?.items?.$ref as string
    if (componentGetReference === `#/components/schemas/${name}`)
      return { responses, path: pathValue }
  }
  return undefined
}

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const schema = ref(apiSchema)
  const activeListComponentName = ref<ComponentName>()
  const activeList = ref()

  const showListModal = computed(() => isString(activeListComponentName.value))
  const apiComponents = computed(() =>
    schema.value.components?.schemas
      ? Object.entries(schema.value.components.schemas)
        .map(([key]) => key as ComponentName)
        .filter((key) => {
          const responses = getResponsesByComponentName(
            schema.value,
            key as ComponentName,
          )

          return responses !== undefined
        })
      : undefined,
  )
  const activeListComponentData = computed(() =>
    activeListComponentName.value === undefined
      ? undefined
      : getResponsesByComponentName(
        schema.value,
        activeListComponentName.value,
      ),
  )

  watch(activeListComponentData, async () => {
    if (activeListComponentData.value?.path)
      activeList.value = await ofetch(
        `https://api.tula-term.ru${activeListComponentData.value.path}`,
      )
  })

  return {
    apiComponents,
    showListModal,
    activeListComponentName,
    activeListComponentData,
    activeList,
  }
})
