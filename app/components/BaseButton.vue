<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    @click="handleClick"
  >
    <span v-if="loading" class="mr-2 inline-flex items-center">
      <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const emit = defineEmits<{
  click: [event: Event];
}>();

const props = defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}>();

const variant = computed(() => props.variant ?? "primary");
const size = computed(() => props.size ?? "md");

const base =
  "inline-flex items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-700",
  secondary: "bg-secondary text-secondary-foreground hover:bg-ink-700",
  accent: "bg-accent text-accent-foreground hover:bg-primary",
  ghost: "bg-transparent text-foreground hover:bg-secondary/20",
  outline: "border border-primary text-primary hover:bg-primary/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const classes = computed(() => [
  base,
  variantClasses[variant.value],
  sizeClasses[size.value],
  props.block ? "w-full" : "",
]);

const type = computed(() => props.type ?? "button");
const disabled = computed(() => props.disabled ?? false);
const loading = computed(() => props.loading ?? false);

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
