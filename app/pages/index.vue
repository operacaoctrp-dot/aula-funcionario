<template>
  <div class="py-8">
    <!-- Título da página -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground mt-2">Gerencie os funcionários da sua empresa</p>
    </div>

    <!-- Tabela de funcionários -->
    <FuncionarioTable
      :funcionarios="funcionarios"
      :loading="loading"
      :error="error"
      @refresh="handleRefresh"
      @add-funcionario="handleAddFuncionario"
      @view-funcionario="handleViewFuncionario"
      @edit-funcionario="handleEditFuncionario"
      @delete-funcionario="handleDeleteFuncionario"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { Funcionario } from "~/types/funcionario";
import FuncionarioTable from "~/components/FuncionarioTable.vue";

const { user, checkAuth } = useAuth();
const { funcionarios, loading, error, fetchFuncionarios } = useFuncionario();

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth();
  
  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo('/login');
    return;
  }
  
  // Buscar funcionários ao montar a página
  await fetchFuncionarios();
});

// Função para atualizar dados
const handleRefresh = async () => {
  await fetchFuncionarios();
};

// Função para adicionar funcionário
const handleAddFuncionario = () => {
  // TODO: Navegar para página de cadastro ou abrir modal
  navigateTo('/novocadastro');
};

// Função para visualizar funcionário
const handleViewFuncionario = (funcionario: Funcionario) => {
  // TODO: Implementar visualização detalhada
  console.log('Ver funcionário:', funcionario);
};

// Função para editar funcionário
const handleEditFuncionario = (funcionario: Funcionario) => {
  // TODO: Navegar para página de edição ou abrir modal
  console.log('Editar funcionário:', funcionario);
};

// Função para deletar funcionário
const handleDeleteFuncionario = (funcionario: Funcionario) => {
  // TODO: Implementar confirmação e exclusão
  console.log('Deletar funcionário:', funcionario);
};
</script>
