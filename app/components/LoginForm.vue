<template>
  <div class="w-full max-w-md mx-auto bg-gray-900 rounded-lg shadow-2xl p-6 border border-gray-700">
    <!-- Tabs -->
    <div class="flex mb-6 border-b border-gray-600">
      <button
        @click="activeTab = 'login'"
        :class="[
          'flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors',
          activeTab === 'login'
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
        ]"
      >
        Entrar
      </button>
      <button
        @click="activeTab = 'register'"
        :class="[
          'flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors',
          activeTab === 'register'
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
        ]"
      >
        Criar conta
      </button>
    </div>

    <!-- Login Tab -->
    <div v-if="activeTab === 'login'" class="space-y-4">
      <!-- Exibir erro se houver -->
      <div v-if="error" class="p-3 rounded-md bg-red-900/20 border border-red-500/50">
        <p class="text-sm text-red-400">{{ error }}</p>
      </div>

      <BaseInput
        v-model="loginForm.email"
        type="email"
        label="Email"
        placeholder="Digite seu email"
        id="login-email"
        :error="validationErrors.email"
        @enter="handleLogin"
      />
      
      <BaseInput
        v-model="loginForm.password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        id="login-password"
        :error="validationErrors.password"
        @enter="handleLogin"
      />
      
      <BaseButton
        variant="primary"
        size="md"
        block
        class="mt-6"
        :loading="loading"
        @click="handleLogin"
      >
        Entrar
      </BaseButton>
    </div>

    <!-- Register Tab -->
    <div v-if="activeTab === 'register'" class="space-y-4">
      <!-- Exibir erro se houver -->
      <div v-if="error" class="p-3 rounded-md bg-red-900/20 border border-red-500/50">
        <p class="text-sm text-red-400">{{ error }}</p>
      </div>

      <!-- Exibir mensagem de sucesso se houver -->
      <div v-if="successMessage" class="p-3 rounded-md bg-green-900/20 border border-green-500/50">
        <p class="text-sm text-green-400">{{ successMessage }}</p>
      </div>

      <BaseInput
        v-model="registerForm.email"
        type="email"
        label="Email"
        placeholder="Digite seu email"
        id="register-email"
        :error="registerValidationErrors.email"
        @enter="handleRegister"
      />
      
      <BaseInput
        v-model="registerForm.password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        id="register-password"
        :error="registerValidationErrors.password"
        @enter="handleRegister"
      />
      
      <BaseInput
        v-model="registerForm.confirmPassword"
        type="password"
        label="Confirmar senha"
        placeholder="Confirme sua senha"
        id="register-confirm-password"
        :error="registerValidationErrors.confirmPassword"
        @enter="handleRegister"
      />
      
      <BaseButton
        variant="primary"
        size="md"
        block
        class="mt-6"
        :loading="loading"
        @click="handleRegister"
      >
        Criar conta
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

// Active tab state
const activeTab = ref<'login' | 'register'>('login')

// Form data
const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Auth composable
const { login, register, loading, error } = useAuth()

// Estado para mensagem de sucesso
const successMessage = ref('')

// Estados de validação
const validationErrors = ref({
  email: '',
  password: ''
})

const registerValidationErrors = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Função para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar campos
const validateForm = (): boolean => {
  validationErrors.value = { email: '', password: '' }
  let isValid = true

  // Validar email
  if (!loginForm.value.email.trim()) {
    validationErrors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!isValidEmail(loginForm.value.email)) {
    validationErrors.value.email = 'Digite um email válido'
    isValid = false
  }

  // Validar senha
  if (!loginForm.value.password.trim()) {
    validationErrors.value.password = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}

// Função para validar formulário de cadastro
const validateRegisterForm = (): boolean => {
  registerValidationErrors.value = { email: '', password: '', confirmPassword: '' }
  let isValid = true

  // Validar email
  if (!registerForm.value.email.trim()) {
    registerValidationErrors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!isValidEmail(registerForm.value.email)) {
    registerValidationErrors.value.email = 'Digite um email válido'
    isValid = false
  }

  // Validar senha
  if (!registerForm.value.password.trim()) {
    registerValidationErrors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (registerForm.value.password.length < 6) {
    registerValidationErrors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  // Validar confirmação de senha
  if (!registerForm.value.confirmPassword.trim()) {
    registerValidationErrors.value.confirmPassword = 'Confirmação de senha é obrigatória'
    isValid = false
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerValidationErrors.value.confirmPassword = 'Senhas não coincidem'
    isValid = false
  }

  return isValid
}

// Função para lidar com o cadastro
const handleRegister = async () => {
  // Limpar mensagens anteriores
  successMessage.value = ''
  
  // Validar formulário
  if (!validateRegisterForm()) {
    return
  }

  const result = await register(
    '', // Nome vazio já que não temos mais o campo
    registerForm.value.email,
    registerForm.value.password
  )
  
  if (result.success) {
    if (result.needsConfirmation) {
      // Mostrar mensagem de confirmação de email
      successMessage.value = result.message || 'Cadastro realizado! Verifique seu email para confirmar a conta.'
      // Limpar formulário
      registerForm.value = { email: '', password: '', confirmPassword: '' }
    } else {
      // Usuário já está logado, redirecionar
      await navigateTo('/')
    }
  }
  // O erro já é gerenciado pelo composable useAuth e exibido no template
}

// Função para lidar com o login
const handleLogin = async () => {
  // Limpar mensagens anteriores
  successMessage.value = ''
  
  // Validar formulário
  if (!validateForm()) {
    return
  }

  const result = await login(loginForm.value.email, loginForm.value.password)
  
  if (result.success) {
    // Redirecionar para página principal ou dashboard
    await navigateTo('/')
  }
  // O erro já é gerenciado pelo composable useAuth e exibido no template
}
</script>
