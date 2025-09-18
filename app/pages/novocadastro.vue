<template>
  <div class="py-8">
    <!-- Título da página -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Novo Cadastro</h1>
      <p class="text-muted-foreground mt-2">
        Cadastre um novo funcionário no sistema
      </p>
    </div>

    <!-- Formulário de cadastro -->
    <FormFuncionario :is-novo="true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import FormFuncionario from "~/components/FormFuncionario.vue";

const { user, checkAuth } = useAuth();

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth();

  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo("/login");
  }
});
</script>
