<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main content -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";

// Inicializar verificação de autenticação
const { checkAuth } = useAuth();

// Verificar autenticação ao montar o layout
onMounted(async () => {
  await checkAuth();
});
</script>
