<template>
  <div>
    <label
      v-if="label"
      :id="elementId + '-label'"
      :for="elementId"
      class="block text-sm font-medium text-primary-300 mb-1"
    >
      {{ label }}
    </label>

    <Listbox v-model="selectedValue" :disabled="disabled">
      <div class="relative">
        <ListboxButton
          :id="elementId"
          :aria-labelledby="label ? elementId + '-label' : undefined"
          :class="[
            'relative w-full cursor-default rounded-md bg-transparent border py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            error ? 'border-red-500' : 'border-primary/60',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            sizeClass,
          ]"
        >
          <span class="block truncate text-foreground">
            {{ selectedValue || placeholder || "Selecione uma opção" }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-card border border-border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in options"
              :key="option"
              :value="option"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-primary/10 text-primary' : 'text-foreground',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ option }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-muted-foreground">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

type DropdownSize = "sm" | "md" | "lg";

const props = defineProps<{
  modelValue?: string;
  options: string[];
  label?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  size?: DropdownSize;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Gerar ID único se não fornecido - usar ref para manter consistência
const generatedId = ref(
  `dropdown-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
);
const elementId = computed(() => props.id || generatedId.value);

const selectedValue = computed({
  get: () => props.modelValue || "",
  set: (val: string) => emit("update:modelValue", val),
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "text-base py-2.5";
    default:
      return "text-sm";
  }
});
</script>
