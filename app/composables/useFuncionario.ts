import type { Funcionario } from "~/types/funcionario";

export const useFuncionario = () => {
  const { $supabase } = useNuxtApp();

  // Estados reativos
  const funcionarios = ref<Funcionario[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Função para buscar todos os funcionários
  const fetchFuncionarios = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await $supabase
        .from("funcionarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        error.value = "Erro ao buscar funcionários: " + fetchError.message;
        return { success: false, error: error.value };
      }

      funcionarios.value = data || [];
      return { success: true, data: data || [] };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? "Erro ao buscar funcionários: " + err.message
          : "Erro desconhecido ao buscar funcionários";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  return {
    funcionarios: readonly(funcionarios),
    loading: readonly(loading),
    error: readonly(error),
    fetchFuncionarios,
  };
};
