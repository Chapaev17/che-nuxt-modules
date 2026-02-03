<script setup lang="tsx">
import CheModal from "../Modal.vue"
import EntityOperationsList from "./EntityOperationsList.vue"
import { useAdminPanelStore } from "../../stores/adminPanel/index"

interface Props {
  isMobile?: boolean
}

const props = defineProps<Props>()
const adminPanelStore = useAdminPanelStore()
</script>

<template>
  <div class="flex-1">
    <!-- Контролируемый режим: если isMobile передан -->
    <template v-if="props.isMobile !== undefined">
      <div v-if="!props.isMobile" class="desktop-version">
        <div class="flex justify-center">
          <button
            class="ml-3 h-[35px] w-[35px] rounded-xl border"
            @click="adminPanelStore.clearEntity()"
          >
            +
          </button>
        </div>

        <div class="mt-2">
          <EntityOperationsList :entity="adminPanelStore.activeEntity" />
        </div>
      </div>

      <div v-else class="mobile-version">
        <CheModal
          :show="adminPanelStore.showListModal"
          @set-visible="adminPanelStore.closeModal()"
        >
          <div class="mt-3">
            <div class="flex justify-between">
              <button
                class="ml-3 h-[35px] w-[35px] rounded-xl border"
                @click="adminPanelStore.clearEntity()"
              >
                +
              </button>

              <button
                class="mr-3 h-[35px] w-[35px] rounded-xl border"
                @click="adminPanelStore.closeModal()"
              >
                x
              </button>
            </div>

            <EntityOperationsList :entity="adminPanelStore.activeEntity" />
          </div>
        </CheModal>
      </div>
    </template>

    <!-- Неконтролируемый режим: если isMobile не передан, используем Tailwind классы -->
    <template v-else>
      <!-- Десктопная версия - скрыта на мобильных -->
      <div class="hidden md:block desktop-version">
        <div class="flex justify-center">
          <button
            class="ml-3 h-[35px] w-[35px] rounded-xl border"
            @click="adminPanelStore.clearEntity()"
          >
            +
          </button>
        </div>

        <div class="mt-2">
          <EntityOperationsList :entity="adminPanelStore.activeEntity" />
        </div>
      </div>

      <!-- Мобильная версия - скрыта на десктопе -->
      <div class="block md:hidden mobile-version">
        <CheModal
          :show="adminPanelStore.showListModal"
          @set-visible="adminPanelStore.closeModal()"
        >
          <div class="mt-3">
            <div class="flex justify-between">
              <button
                class="ml-3 h-[35px] w-[35px] rounded-xl border"
                @click="adminPanelStore.clearEntity()"
              >
                +
              </button>

              <button
                class="mr-3 h-[35px] w-[35px] rounded-xl border"
                @click="adminPanelStore.closeModal()"
              >
                x
              </button>
            </div>

            <EntityOperationsList :entity="adminPanelStore.activeEntity" />
          </div>
        </CheModal>
      </div>
    </template>
  </div>
</template>
