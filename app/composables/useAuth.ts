import type { User } from "@supabase/supabase-js";

// Função para traduzir erros de autenticação para português
const translateAuthError = (errorMessage: string): string => {
  const translations: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos",
    "Email not confirmed": "Email não confirmado",
    "User not found": "Usuário não encontrado",
    "Invalid email": "Email inválido",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres",
    "Signup requires a valid password": "Cadastro requer uma senha válida",
    "User already registered": "Usuário já cadastrado",
    "Email already registered": "Email já cadastrado",
    "Too many requests": "Muitas tentativas. Tente novamente mais tarde",
    "Network request failed": "Falha na conexão. Verifique sua internet",
    "Invalid API key": "Erro de configuração. Contate o suporte",
    "Database error": "Erro no banco de dados",
    "Weak password": "Senha muito fraca",
  };

  // Procurar por traduções exatas ou parciais
  for (const [english, portuguese] of Object.entries(translations)) {
    if (errorMessage.toLowerCase().includes(english.toLowerCase())) {
      return portuguese;
    }
  }

  // Se não encontrar tradução, retornar mensagem genérica
  return "Erro de autenticação. Tente novamente";
};

export const useAuth = () => {
  const { $supabase } = useNuxtApp();

  // Estado reativo do usuário
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: authError } =
        await $supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        const errorMessage = translateAuthError(authError.message);
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      }

      user.value = data.user;
      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? translateAuthError(err.message)
          : "Erro desconhecido";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Função de cadastro com senha
  const register = async (name: string, email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: authError } = await $supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (authError) {
        const errorMessage = translateAuthError(authError.message);
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      }

      // Se o cadastro foi bem-sucedido mas precisa de confirmação de email
      if (data.user && !data.session) {
        return {
          success: true,
          user: data.user,
          needsConfirmation: true,
          message:
            "Cadastro realizado! Verifique seu email para confirmar a conta.",
        };
      }

      // Se o cadastro foi bem-sucedido e já está logado
      user.value = data.user;
      return { success: true, user: data.user, needsConfirmation: false };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? translateAuthError(err.message)
          : "Erro desconhecido";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Função para criar conta apenas com nome e email (sem senha)
  const createAccount = async (name: string, email: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Gerar uma senha temporária aleatória
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";

      const { data, error: authError } = await $supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            name: name,
            temp_password: true, // Flag para indicar que é senha temporária
          },
        },
      });

      if (authError) {
        const errorMessage = translateAuthError(authError.message);
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      }

      // Sempre precisará de confirmação de email para contas criadas assim
      return {
        success: true,
        user: data.user,
        needsConfirmation: true,
        message:
          "Conta criada com sucesso! Verifique seu email para confirmar e definir sua senha.",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? translateAuthError(err.message)
          : "Erro desconhecido";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      loading.value = true;
      const { error: authError } = await $supabase.auth.signOut();

      if (authError) {
        const errorMessage = translateAuthError(authError.message);
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      }

      user.value = null;
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? translateAuthError(err.message)
          : "Erro desconhecido";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Verificar se usuário está logado
  const checkAuth = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await $supabase.auth.getUser();
      user.value = currentUser;
      return currentUser;
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      user.value = null;
      return null;
    }
  };

  // Computed para verificar se está autenticado
  const isAuthenticated = computed(() => !!user.value);

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    login,
    register,
    createAccount,
    logout,
    checkAuth,
  };
};
