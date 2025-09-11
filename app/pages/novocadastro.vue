<template>
  <div>
    <!-- Página em branco por enquanto -->
  </div>
</template>

<script setup lang="ts">
const { user, checkAuth } = useAuth()

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth()
  
  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo('/login')
  }
})
</script>
