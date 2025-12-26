<script setup lang="tsx">
import { CheModal } from "#components"
import { useAdminPanelStore } from "../stores/adminPanel"

const viewport = useViewport()

const adminPanelStore = useAdminPanelStore()

const {
  activeListComponentData,
  activeListComponentName,
  apiComponents,
  showListModal,
  activeList,
} = storeToRefs(adminPanelStore)

const ListBody = () => (
  <div class="flex justify-center">
    <div>
      {activeList.value?.map((listElement, listElementIndex) => (
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

const SidebarComponentsMenu = () => (
  <div class="w-full rounded-xl bg-[#15193b] px-2  md:w-[250px]">
    {apiComponents.value.map((component, index) => (
      <button
        class={[
          "block w-full  border-[#2d304f] p-2 text-[#dbdbe0]",
          index !== 0 && "border-t",
        ]}
        onClick={() => {
          activeListComponentName.value = component
        }}
      >
        {component}
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
            class="ml-3 h-[35px] w-[35px] rounded-xl border "
            onClick={() => {
              activeListComponentName.value = undefined
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
          activeListComponentName.value = undefined
        }}
        show={showListModal.value}
      >
        <div class="mt-3">
          <div class="flex justify-between">
            <button
              class="ml-3 h-[35px] w-[35px] rounded-xl border "
              onClick={() => {
                activeListComponentName.value = undefined
              }}
            >
              +
            </button>

            <button
              class="mr-3 h-[35px] w-[35px] rounded-xl border "
              onClick={() => {
                activeListComponentName.value = undefined
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
      <SidebarComponentsMenu />
    </div>

    <ListElementByCurrentDevice />
  </div>
))
</script>
