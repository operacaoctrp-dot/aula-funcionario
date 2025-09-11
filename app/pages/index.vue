<template>
  <div>
    <!-- Página em branco -->
  </div>
</template>

<script setup lang="ts">
const { user, logout, loading, checkAuth } = useAuth()

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth()
  
  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo('/login')
  }
})

// Função para fazer logout
const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    await navigateTo('/login')
  }
}
</script>
