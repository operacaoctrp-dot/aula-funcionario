import type { Funcionario, CreateFuncionarioData } from "~/types/funcionario";

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

  // Função para criar funcionário
  const createFuncionario = async (funcionarioData: CreateFuncionarioData) => {
    try {
      loading.value = true;
      error.value = null;

      // Preparar dados para inserção (remover campos vazios opcionais)
      const dataToInsert = {
        nome: funcionarioData.nome.trim(),
        cargo: funcionarioData.cargo.trim(),
        endereco: funcionarioData.endereco?.trim() || null,
        email: funcionarioData.email?.trim() || null,
        salario: funcionarioData.salario || null,
      };

      const { data, error: insertError } = await $supabase
        .from("funcionarios")
        .insert([dataToInsert])
        .select()
        .single();

      if (insertError) {
        error.value = "Erro ao cadastrar funcionário: " + insertError.message;
        return { success: false, error: error.value };
      }

      // Atualizar lista local
      funcionarios.value.unshift(data);

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? "Erro ao cadastrar funcionário: " + err.message
          : "Erro desconhecido ao cadastrar funcionário";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Função para atualizar funcionário
  const updateFuncionario = async (
    id: number,
    funcionarioData: CreateFuncionarioData
  ) => {
    console.log("🔧 updateFuncionario chamado com:", { id, funcionarioData });
    try {
      loading.value = true;
      error.value = null;

      // Preparar dados para atualização (remover campos vazios opcionais)
      const dataToUpdate = {
        nome: funcionarioData.nome.trim(),
        cargo: funcionarioData.cargo.trim(),
        endereco: funcionarioData.endereco?.trim() || null,
        email: funcionarioData.email?.trim() || null,
        salario: funcionarioData.salario || null,
      };

      const { data, error: updateError } = await $supabase
        .from("funcionarios")
        .update(dataToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        error.value = "Erro ao atualizar funcionário: " + updateError.message;
        return { success: false, error: error.value };
      }

      // Atualizar funcionário na lista local
      const index = funcionarios.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        funcionarios.value[index] = data;
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? "Erro ao atualizar funcionário: " + err.message
          : "Erro desconhecido ao atualizar funcionário";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Função para deletar funcionário
  const deleteFuncionario = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await $supabase
        .from("funcionarios")
        .delete()
        .eq("id", id);

      if (deleteError) {
        error.value = "Erro ao deletar funcionário: " + deleteError.message;
        return { success: false, error: error.value };
      }

      // Remover funcionário da lista local
      const index = funcionarios.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        funcionarios.value.splice(index, 1);
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? "Erro ao deletar funcionário: " + err.message
          : "Erro desconhecido ao deletar funcionário";
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
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
  };
};
