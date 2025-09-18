<template>
  <div class="py-8">
    <!-- Título da página -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Editar Funcionário</h1>
      <p class="text-muted-foreground mt-2">
        Atualize as informações do funcionário
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
        ></div>
        <p class="mt-2 text-muted-foreground">Carregando dados...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div
        class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
      >
        <h3 class="text-lg font-medium text-red-800 mb-2">
          Funcionário não encontrado
        </h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <BaseButton variant="outline" @click="$router.push('/')">
          Voltar ao início
        </BaseButton>
      </div>
    </div>

    <!-- Formulário de edição -->
    <FormFuncionario
      v-else-if="funcionario"
      :is-novo="false"
      :funcionario-data="funcionario"
      :read-only="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Funcionario } from "~/types/funcionario";
import FormFuncionario from "~/components/FormFuncionario.vue";
import BaseButton from "~/components/BaseButton.vue";

// Get route params
const route = useRoute();
const funcionarioId = route.params.id as string;

// Estados
const funcionario = ref<Funcionario | null>(null);
const loading = ref(true);
const error = ref<string>("");

// Composables
const { funcionarios, fetchFuncionarios } = useFuncionario();
const { user, checkAuth } = useAuth();

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth();

  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo("/login");
    return;
  }

  // Buscar funcionário
  await buscarFuncionario();
});

// Função para buscar funcionário
const buscarFuncionario = async () => {
  try {
    loading.value = true;
    error.value = "";

    // Primeiro, verificar se temos funcionários no estado global
    if (funcionarios.value.length === 0) {
      console.log("Funcionários não carregados, buscando...");
      const result = await fetchFuncionarios();
      if (!result.success) {
        error.value = "Erro ao carregar funcionários";
        return;
      }
    }

    // Buscar funcionário pelo ID
    const funcionarioEncontrado = funcionarios.value.find(
      (f) => f.id.toString() === funcionarioId
    );

    if (funcionarioEncontrado) {
      funcionario.value = funcionarioEncontrado;
      console.log("Funcionário encontrado para edição:", funcionarioEncontrado);
    } else {
      error.value = `Funcionário com ID ${funcionarioId} não foi encontrado`;
    }
  } catch (err) {
    console.error("Erro ao buscar funcionário:", err);
    error.value = "Erro inesperado ao buscar funcionário";
  } finally {
    loading.value = false;
  }
};
</script>
