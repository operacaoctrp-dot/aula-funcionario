<template>
  <header class="bg-card border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-400">
            Sistema Cadastro
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink
              to="/"
              class="text-foreground hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Início
            </NuxtLink>
            <NuxtLink
              to="/novocadastro"
              class="text-foreground hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Novo Cadastro
            </NuxtLink>
            <NuxtLink
              to="/usuarios"
              class="text-foreground hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Usuários
            </NuxtLink>
            <NuxtLink
              to="/relatorios"
              class="text-foreground hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Relatórios
            </NuxtLink>
          </div>
        </nav>

        <!-- User menu -->
        <div class="hidden md:flex items-center space-x-4">
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <div class="text-right">
              <div class="text-sm text-foreground font-medium">
                {{ user?.email }}
              </div>
              <div class="text-xs text-gray-400">Usuário logado</div>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              :loading="loading"
              @click="handleLogout"
            >
              Sair
            </BaseButton>
          </div>
          <div v-else>
            <NuxtLink to="/login">
              <BaseButton variant="primary" size="sm"> Entrar </BaseButton>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-foreground hover:text-primary-400 p-2 rounded-md"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
          <NuxtLink
            to="/"
            class="text-foreground hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Início
          </NuxtLink>
          <NuxtLink
            to="/novocadastro"
            class="text-foreground hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Novo Cadastro
          </NuxtLink>
          <NuxtLink
            to="/usuarios"
            class="text-foreground hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Usuários
          </NuxtLink>
          <NuxtLink
            to="/relatorios"
            class="text-foreground hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Relatórios
          </NuxtLink>

          <!-- Mobile user menu -->
          <div class="pt-4 border-t border-border">
            <div v-if="isAuthenticated">
              <div class="px-3 py-2">
                <div class="text-sm text-foreground font-medium">
                  {{ user?.email }}
                </div>
                <div class="text-xs text-gray-400">Usuário logado</div>
              </div>
              <BaseButton
                variant="outline"
                size="sm"
                block
                :loading="loading"
                @click="handleLogout"
                class="mx-3 mt-2"
              >
                Sair
              </BaseButton>
            </div>
            <div v-else class="px-3 py-2">
              <NuxtLink to="/login" @click="mobileMenuOpen = false">
                <BaseButton variant="primary" size="sm" block>
                  Entrar
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseButton from "./BaseButton.vue";

const mobileMenuOpen = ref(false);

// Auth composable
const { user, isAuthenticated, logout, loading, checkAuth } = useAuth();

// Verificar autenticação ao montar o componente
onMounted(async () => {
  await checkAuth();
});

// Função para lidar com o logout
const handleLogout = async () => {
  const result = await logout();

  if (result.success) {
    // Redirecionar para página de login após logout
    await navigateTo("/login");
  }

  // Fechar menu mobile se estiver aberto
  mobileMenuOpen.value = false;
};
</script>
