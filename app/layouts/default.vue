<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main content -->
    <main class="flex-1 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";

// Inicializar verificação de autenticação
const { checkAuth } = useAuth();

// Verificar autenticação ao montar o layout
onMounted(async () => {
  await checkAuth();
});
</script>
