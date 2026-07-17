<script setup lang="tsx">
import type { MyOpenAPIDocument } from "../../stores/adminPanel/types"
import SidebarEndpointsMenu from "./SidebarEndpointsMenu.vue"
import ListElementByCurrentDevice from "./ListElementByCurrentDevice.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"
import { storeToRefs } from "pinia"
import { useRender } from "@vueuse/components"

interface Props {
  apiSchema: MyOpenAPIDocument
  isMobile?: boolean
}

const props = defineProps<Props>()

const adminPanelStore = useAdminPanelStore()
adminPanelStore.setSchema(props.apiSchema)

const { filteredEntitiesByNamespace } = storeToRefs(adminPanelStore)

useRender(() => (
  <div class="md:flex">
    <div>
      <SidebarEndpointsMenu
        filteredEntitiesByNamespace={filteredEntitiesByNamespace.value}
        isMobile={props.isMobile}
      />
    </div>

    <ListElementByCurrentDevice isMobile={props.isMobile} />
  </div>
))
</script>
