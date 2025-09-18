<template>
  <div>
    <label
      v-if="label"
      :for="elementId"
      class="block text-sm font-medium text-primary-300"
    >
      {{ label }}
    </label>
    <div class="mt-1 relative">
      <input
        :id="elementId"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        v-bind="attrs"
        v-model="localValue"
        @keydown.enter="$emit('enter')"
        :class="[
          'w-full rounded-md bg-transparent shadow-sm focus:border-primary focus:ring-primary',
          'border',
          error ? 'border-red-500' : 'border-primary/60',
          sizeClass,
          type === 'password' ? 'pr-10' : '',
        ]"
      />
      <!-- Botão para mostrar/ocultar senha -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        <svg
          v-if="showPassword"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
      <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
      <p v-else-if="hint" class="mt-1 text-xs text-muted-foreground">
        {{ hint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";

type InputSize = "sm" | "md" | "lg";

const props = defineProps<{
  modelValue?: string | number;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  size?: InputSize;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | undefined): void;
  (e: "enter"): void;
}>();

const attrs = useAttrs();

// Gerar ID único se não fornecido - usar ref para manter consistência
const generatedId = ref(
  `input-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
);
const elementId = computed(() => props.id || generatedId.value);

// Estado para controlar visibilidade da senha
const showPassword = ref(false);

const localValue = computed({
  get: () => props.modelValue as any,
  set: (val: any) => emit("update:modelValue", val),
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-sm";
    case "lg":
      return "px-4 py-2.5 text-base";
    default:
      return "px-3 py-2 text-sm";
  }
});

// Tipo do input que muda baseado na visibilidade da senha
const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type ?? "text";
});

// Função para alternar visibilidade da senha
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const type = computed(() => props.type ?? "text");
const placeholder = computed(() => props.placeholder ?? "");
const disabled = computed(() => props.disabled ?? false);
const error = computed(() => props.error ?? "");
const hint = computed(() => props.hint ?? "");
const id = computed(() => props.id);
const label = computed(() => props.label);
</script>
