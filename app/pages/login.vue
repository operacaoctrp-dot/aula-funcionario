<template>
  <div class="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Sistema de Cadastro
      </h2>
      <p class="mt-2 text-center text-sm text-gray-300">
        Faça login ou crie sua conta
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/LoginForm.vue'

const { user, checkAuth } = useAuth()

// Verificar se já está logado ao carregar a página
onMounted(async () => {
  await checkAuth()
  
  // Se já estiver logado, redirecionar para home
  if (user.value) {
    await navigateTo('/')
  }
})

// Remove o layout padrão desta página
definePageMeta({
  layout: false
})
</script>
