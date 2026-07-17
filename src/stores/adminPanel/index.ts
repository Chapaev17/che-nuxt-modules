import { defineStore } from "pinia"
import { useAdminPanel } from "../../composables/useAdminPanel"

export const useAdminPanelStore = defineStore("admin-panel", () => {
  const adminPanel = useAdminPanel()

  return {
    schema: adminPanel.schema,
    setSchema: adminPanel.setSchema,
    showListModal: adminPanel.showListModal,
    activeEntity: adminPanel.activeEntity,
    parsedEntities: adminPanel.parsedEntities,
    namespaces: adminPanel.namespaces,
    filteredEntitiesByNamespace: adminPanel.filteredEntitiesByNamespace,
    activeEntityOperationTypes: adminPanel.activeEntityOperationTypes,
    activeEntityListSchema: adminPanel.activeEntityListSchema,
    activeEntityDetailSchema: adminPanel.activeEntityDetailSchema,
    activeEntityUpdateSchema: adminPanel.activeEntityUpdateSchema,
    activeEntityDeleteSchema: adminPanel.activeEntityDeleteSchema,
    clearEntity: adminPanel.clearEntity,
    closeModal: adminPanel.closeModal,
  }
})
