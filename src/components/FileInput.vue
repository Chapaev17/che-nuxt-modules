<script setup lang="tsx">
import { computed, ref } from "vue"

import { useDropZone } from "@vueuse/core"
import useRender from "../composables/useRender"

const properties = defineProps<{
  accept?: string
  multiple?: boolean
  value?: File[]
}>()
const emit = defineEmits<{
  change: [files: File[]]
}>()
const slots = defineSlots<{
  default(properties: { files: File[]; isOver: boolean }): unknown
}>()

const model = defineModel<File[]>()

const currentFiles = computed(() => model.value ?? properties.value ?? [])

const dropZoneReference = ref<HTMLDivElement>()
const inputReference = ref<HTMLInputElement>()
const multiple = computed(() => properties.multiple ?? true)

const { isOverDropZone } = useDropZone(dropZoneReference, {
  multiple: multiple.value,
  onDrop,
})

function handleChange(files: File[]) {
  model.value = files
  emit("change", files)
}

function onInputChange(event: Event) {
  const { files } = event.target as HTMLInputElement
  if (files) handleChange([...files])
}

function onDrop(files: File[] | null) {
  if (files) handleChange(files)
}

function onInputClick() {
  inputReference.value?.click()
}

function onInputKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") inputReference.value?.click()
}

useRender(() => (
  <div
    class={{ "is-over": isOverDropZone.value }}
    onClick={onInputClick}
    onKeydown={onInputKeyDown}
    ref={dropZoneReference}
    role="button"
    tabindex={0}
  >
    <input
      accept={properties.accept}
      multiple={multiple.value}
      onChange={onInputChange}
      ref={inputReference}
      style={{ display: "none" }}
      type="file"
    />

    {slots.default?.({
      files: currentFiles.value,
      isOver: isOverDropZone.value,
    })}
  </div>
))
</script>
