<script setup lang="tsx">
import CheModal from "./Modal.vue"
import { useAdminPanelStore } from "../stores/adminPanel"
import { isObject, isString } from "lodash-es"

const viewport = useViewport()

const adminPanelStore = useAdminPanelStore()

const {
  parsedEntities,
  activeEntity,
  showListModal,
  activeList,
} = storeToRefs(adminPanelStore)

const ListBody = () => (
  <div class="flex justify-center">
    <div>
      {activeList.value?.map((listElement: any, listElementIndex: number) => (
        <div class={[listElementIndex !== 0 && "mt-7"]}>
          {isObject(listElement) &&
            Object.entries(listElement).map(([key, value]) => (
              <div>
                {isString(value) ? (
                  <div>
                    {`${key} - ${value.length > 40 ? `${value?.slice(0, 40)}...` : value}`}
                  </div>
                ) : (
                  <div>
                    {key} - {value.toString()}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  </div>
)

const SidebarEndpointsMenu = () => (
  <div class="w-full rounded-xl bg-[#15193b] px-2 md:w-[250px]">
    {parsedEntities.value.map((entity, index) => (
      <button
        class={[
          "block w-full border-[#2d304f] p-2 text-[#dbdbe0]",
          index !== 0 && "border-t",
        ]}
        onClick={() => {
          activeEntity.value = entity
        }}
      >
        {entity.entityName}
      </button>
    ))}
  </div>
)

const ListElementByCurrentDevice = () => (
  <div class="flex-1">
    {viewport.isGreaterThan("md") ? (
      <div>
        <div class="flex justify-center">
          <button
            class="ml-3 h-[35px] w-[35px] rounded-xl border"
            onClick={() => {
              activeEntity.value = undefined
            }}
          >
            +
          </button>
        </div>

        <div class="mt-2">
          <ListBody />
        </div>
      </div>
    ) : (
      <CheModal
        onSetVisible={() => {
          activeEntity.value = undefined
        }}
        show={showListModal.value}
      >
        <div class="mt-3">
          <div class="flex justify-between">
            <button
              class="ml-3 h-[35px] w-[35px] rounded-xl border"
              onClick={() => {
                activeEntity.value = undefined
              }}
            >
              +
            </button>

            <button
              class="mr-3 h-[35px] w-[35px] rounded-xl border"
              onClick={() => {
                activeEntity.value = undefined
              }}
            >
              x
            </button>
          </div>

          <ListBody />
        </div>
      </CheModal>
    )}
  </div>
)

useRender(() => (
  <div class="md:flex">
    <div>
      <SidebarEndpointsMenu />
    </div>

    <ListElementByCurrentDevice />
  </div>
))
</script>
