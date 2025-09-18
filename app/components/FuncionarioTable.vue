<template>
  <div
    class="bg-card rounded-lg shadow-lg border border-border overflow-hidden"
  >
    <!-- Header da tabela -->
    <div class="px-6 py-4 border-b border-border">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-foreground">
          Lista de Funcionários
        </h2>
        <div class="flex items-center space-x-2">
          <BaseButton
            variant="outline"
            size="sm"
            :loading="loading"
            @click="refreshData"
          >
            Atualizar
          </BaseButton>
          <span class="text-sm text-muted-foreground">
            {{ funcionarios.length }}
            {{ funcionarios.length === 1 ? "funcionário" : "funcionários" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && funcionarios.length === 0" class="p-8">
      <div class="flex items-center justify-center space-x-2">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
        ></div>
        <span class="text-muted-foreground">Carregando funcionários...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-6">
      <div class="bg-red-900/20 border border-red-500/50 rounded-md p-4">
        <p class="text-red-400 text-sm">{{ error }}</p>
        <BaseButton
          variant="outline"
          size="sm"
          class="mt-3"
          @click="refreshData"
        >
          Tentar novamente
        </BaseButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="funcionarios.length === 0" class="p-8">
      <div class="text-center">
        <div class="text-muted-foreground mb-4">
          <svg
            class="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">
          Nenhum funcionário encontrado
        </h3>
        <p class="text-muted-foreground mb-4">
          Não há funcionários cadastrados no momento.
        </p>
        <BaseButton
          variant="primary"
          size="sm"
          @click="$emit('add-funcionario')"
        >
          Cadastrar primeiro funcionário
        </BaseButton>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Cargo
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr
            v-for="funcionario in funcionarios"
            :key="funcionario.id"
            class="hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-foreground">
                {{ funcionario.nome }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-foreground">
                {{ funcionario.cargo }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-foreground">
                {{ funcionario.email || "Não informado" }}
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="flex justify-end space-x-2">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  @click="$emit('view-funcionario', funcionario)"
                >
                  Ver
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  @click="$emit('edit-funcionario', funcionario)"
                >
                  Editar
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  @click="$emit('delete-funcionario', funcionario)"
                  class="text-red-400 hover:text-red-300"
                >
                  Excluir
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Funcionario } from "~/types/funcionario";
import BaseButton from "./BaseButton.vue";

// Props
const props = defineProps<{
  funcionarios: readonly Funcionario[];
  loading: boolean;
  error: string | null;
}>();

// Emits
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "add-funcionario"): void;
  (e: "view-funcionario", funcionario: Funcionario): void;
  (e: "edit-funcionario", funcionario: Funcionario): void;
  (e: "delete-funcionario", funcionario: Funcionario): void;
}>();

// Função para atualizar dados
const refreshData = () => {
  emit("refresh");
};
</script>
