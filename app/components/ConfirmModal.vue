<template>
  <teleport to="body">
    <transition
      name="modal"
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="handleBackdropClick"
      >
        <transition
          name="modal-content"
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isVisible"
            class="bg-card rounded-lg shadow-2xl border border-border w-full max-w-md p-6"
            @click.stop
          >
            <!-- Ícone de aviso -->
            <div
              class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20"
            >
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <!-- Título -->
            <h3 class="text-lg font-semibold text-foreground text-center mb-2">
              {{ title }}
            </h3>

            <!-- Mensagem -->
            <p class="text-muted-foreground text-center mb-6 leading-relaxed">
              {{ message }}
            </p>

            <!-- Botões -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-3">
              <BaseButton
                variant="outline"
                class="flex-1 order-2 sm:order-1"
                @click="handleCancel"
                :disabled="loading"
              >
                {{ cancelText }}
              </BaseButton>

              <BaseButton
                variant="accent"
                class="flex-1 order-1 sm:order-2 !bg-red-600 hover:!bg-red-700 !text-white"
                @click="handleConfirm"
                :loading="loading"
              >
                {{ confirmText }}
              </BaseButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import BaseButton from "./BaseButton.vue";

interface Props {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirmar ação",
  message: "Tem certeza que deseja continuar?",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  loading: false,
});

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}>();

const isVisible = ref(false);

// Funções para abrir e fechar o modal
const show = async () => {
  isVisible.value = true;
  await nextTick();
  // Foco no modal para acessibilidade
  document.body.style.overflow = "hidden";
};

const hide = async () => {
  isVisible.value = false;
  await nextTick();
  document.body.style.overflow = "";
};

// Handlers dos eventos
const handleConfirm = () => {
  if (!props.loading) {
    emit("confirm");
  }
};

const handleCancel = () => {
  if (!props.loading) {
    emit("cancel");
    hide();
  }
};

const handleBackdropClick = () => {
  if (!props.loading) {
    handleCancel();
  }
};

// Expor funções para o componente pai
defineExpose({
  show,
  hide,
});

// Cleanup quando o componente for desmontado
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Animações já estão definidas nas classes do Tailwind */
</style>
