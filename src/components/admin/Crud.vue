<script setup lang="tsx">
import { ref, onMounted } from "vue"
import type { MyOpenAPIDocument } from "../../stores/adminPanel/types"
import SidebarEndpointsMenu from "./SidebarEndpointsMenu.vue"
import ListElementByCurrentDevice from "./ListElementByCurrentDevice.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"
import { storeToRefs } from "pinia"
import useRender from "../../composables/useRender"

interface Props {
  apiSchema: MyOpenAPIDocument
  baseUrl: string
  isMobile?: boolean
}

const props = defineProps<Props>()

const isReady = ref(false)
onMounted(() => { isReady.value = true })

const adminPanelStore = useAdminPanelStore()
adminPanelStore.setSchema(props.apiSchema)

const { filteredEntitiesByNamespace } = storeToRefs(adminPanelStore)

useRender(() => isReady.value
  ? (
    <div class="flex h-[calc(100vh-56px)] bg-white">
      <SidebarEndpointsMenu
        filteredEntitiesByNamespace={filteredEntitiesByNamespace.value}
        isMobile={props.isMobile}
      />

      <ListElementByCurrentDevice baseUrl={props.baseUrl} isMobile={props.isMobile} />
    </div>
  )
  : null)
</script>
