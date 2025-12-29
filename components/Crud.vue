<script setup lang="tsx">
import CheModal from "./Modal.vue"
import { useAdminPanelStore } from "../stores/adminPanel/index"

const viewport = useViewport()

const adminPanelStore = useAdminPanelStore()

const {
  activeEntity,
  showListModal,
  filteredEntitiesByNamespace,
} = storeToRefs(adminPanelStore)

const EntityOperationsList = () => {
  if (!activeEntity.value) return null
  
  const entity = activeEntity.value
  
  return (
    <div class="flex justify-center">
      <div class="w-full max-w-2xl">
        {/* Entity name header */}
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-[#dbdbe0]">{entity.entityName}</h2>
          <div class="mt-2 text-sm text-gray-400">
            {entity.namespace ? `Namespace: ${entity.namespace}` : 'No namespace'}
          </div>
        </div>
        
        {/* Base operations */}
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-[#dbdbe0] border-b border-[#2d304f] pb-2">
            Base Operations
          </h3>
          <div class="space-y-3">
            {entity.listOperation && (
              <div class="flex items-center justify-between rounded-lg bg-[#1a1d3a] p-4">
                <div>
                  <span class="font-mono text-sm text-green-400">GET</span>
                  <span class="ml-3 text-[#dbdbe0]">List {entity.entityName}</span>
                </div>
                <div class="text-sm text-gray-400">{entity.fullBasePath}</div>
              </div>
            )}
            {entity.createOperation && (
              <div class="flex items-center justify-between rounded-lg bg-[#1a1d3a] p-4">
                <div>
                  <span class="font-mono text-sm text-blue-400">POST</span>
                  <span class="ml-3 text-[#dbdbe0]">Create {entity.entityName}</span>
                </div>
                <div class="text-sm text-gray-400">{entity.fullBasePath}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Detail operations */}
        {entity.details.length > 0 && (
          <div class="mb-8">
            <h3 class="mb-4 text-lg font-semibold text-[#dbdbe0] border-b border-[#2d304f] pb-2">
              Detail Operations
            </h3>
            <div class="space-y-3">
              {entity.details.map((detail, index) => (
                <div key={index} class="rounded-lg bg-[#1a1d3a] p-4">
                  <div class="mb-2 flex items-center">
                    <span class="rounded bg-[#2d304f] px-2 py-1 text-xs font-mono">
                      {detail.paramName}
                    </span>
                    <span class="ml-3 text-sm text-gray-400">({detail.paramType})</span>
                  </div>
                  <div class="space-y-2">
                    {detail.operations.map((op, opIndex) => (
                      <div key={opIndex} class="flex items-center justify-between">
                        <div>
                          <span class={`font-mono text-sm ${
                            op.method === 'GET' ? 'text-green-400' :
                            op.method === 'POST' ? 'text-blue-400' :
                            op.method === 'PUT' ? 'text-yellow-400' :
                            op.method === 'PATCH' ? 'text-yellow-400' :
                            op.method === 'DELETE' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {op.method}
                          </span>
                          <span class="ml-3 text-[#dbdbe0]">
                            {op.method === 'GET' ? 'Retrieve' :
                             op.method === 'PUT' || op.method === 'PATCH' ? 'Update' :
                             op.method === 'DELETE' ? 'Delete' : 'Execute'} {entity.entityName}
                          </span>
                        </div>
                        <div class="text-sm text-gray-400">{op.fullPath}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Custom methods */}
        {entity.methods.length > 0 && (
          <div class="mb-8">
            <h3 class="mb-4 text-lg font-semibold text-[#dbdbe0] border-b border-[#2d304f] pb-2">
              Custom Methods
            </h3>
            <div class="space-y-3">
              {entity.methods.map((method, index) => (
                <div key={index} class="rounded-lg bg-[#1a1d3a] p-4">
                  <div class="mb-2">
                    <span class="rounded bg-[#2d304f] px-2 py-1 text-sm font-mono text-[#dbdbe0]">
                      {method.methodName}
                    </span>
                  </div>
                  <div class="space-y-2">
                    {method.operations.map((op, opIndex) => (
                      <div key={opIndex} class="flex items-center justify-between">
                        <div>
                          <span class={`font-mono text-sm ${
                            op.method === 'GET' ? 'text-green-400' :
                            op.method === 'POST' ? 'text-blue-400' :
                            op.method === 'PUT' ? 'text-yellow-400' :
                            op.method === 'PATCH' ? 'text-yellow-400' :
                            op.method === 'DELETE' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {op.method}
                          </span>
                          <span class="ml-3 text-[#dbdbe0]">{method.methodName}</span>
                        </div>
                        <div class="text-sm text-gray-400">{op.fullPath}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


const SidebarEndpointsMenu = () => (
  <div class="w-full rounded-xl bg-[#15193b] px-2 md:w-[250px]">
    {filteredEntitiesByNamespace.value.map((group: {namespace: string, entities: any[]}, groupIndex: number) => (
      <div key={group.namespace}>
        {/* Заголовок неймспейса */}
        <div
          class={[
            "border-[#2d304f] p-2 font-semibold text-[#dbdbe0]",
            groupIndex !== 0 && "border-t",
          ]}
        >
          {group.namespace || "Без неймспейса"}
        </div>

        {/* Список энтети с небольшим отступом */}
        <div class="ml-3">
          {group.entities.map((entity: any, entityIndex: number) => (
            <button
              key={entity.entityName}
              class={[
                "block w-full border-[#2d304f] p-2 text-[#dbdbe0]",
                entityIndex !== 0 && "border-t",
              ]}
              onClick={() => {
                activeEntity.value = entity
              }}
            >
              {entity.entityName}
            </button>
          ))}
        </div>
      </div>
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
          <EntityOperationsList />
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

          <EntityOperationsList />
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
