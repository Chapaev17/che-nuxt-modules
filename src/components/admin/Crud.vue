<script setup lang="tsx">
import SidebarEndpointsMenu from "./SidebarEndpointsMenu.vue"
import ListElementByCurrentDevice from "./ListElementByCurrentDevice.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"

interface Props {
  isMobile?: boolean
}

const props = defineProps<Props>()

const adminPanelStore = useAdminPanelStore()

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
