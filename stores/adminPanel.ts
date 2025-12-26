import schema from "@/data/api_schema_87anch.json"

type CompoentName = keyof typeof schema.components.schemas

function getResponsesByComponentName(name: CompoentName) {
  for (const path of Object.entries(schema.paths)) {
    const responses = path.at(1)
    const pathValue = path.at(0)
    const componentGetReference =
      // @ts-expect-error wrong
      responses.get.responses["200"].content?.["application/json"].schema
        ?.items?.$ref as string
    if (componentGetReference === `#/components/schemas/${name}`)
      return { responses, path: pathValue }
  }
}

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const activeListComponentName = ref<CompoentName>()
  const activeList = ref()

  const showListModal = computed(() => isString(activeListComponentName.value))
  const apiComponents = computed(() =>
    Object.entries(schema.components.schemas)
      .map(([key]) => key as CompoentName)
      .filter((key) => {
        const responses = getResponsesByComponentName(key as CompoentName)

        return responses !== undefined
      }),
  )
  const activeListComponentData = computed(() =>
    activeListComponentName.value === undefined
      ? undefined
      : getResponsesByComponentName(activeListComponentName.value),
  )

  watch(activeListComponentData, async () => {
    if (activeListComponentData.value?.path)
      activeList.value = await $fetch(
        `https://api.87anch.local${activeListComponentData.value.path}`,
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
