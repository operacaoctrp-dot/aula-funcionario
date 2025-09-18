<template>
  <div class="py-8">
    <!-- Título da página -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground mt-2">
        Gerencie os funcionários da sua empresa
      </p>
    </div>

    <!-- Tabela de funcionários -->
    <FuncionarioTable
      :funcionarios="funcionarios"
      :loading="loading"
      :error="error"
      @refresh="handleRefresh"
      @add-funcionario="handleAddFuncionario"
      @view-funcionario="handleViewFuncionario"
      @edit-funcionario="handleEditFuncionario"
      @delete-funcionario="handleDeleteFuncionario"
    />

    <!-- Modal de confirmação de exclusão -->
    <ConfirmModal
      ref="confirmModal"
      :title="'Excluir Funcionário'"
      :message="modalMessage"
      :confirm-text="'Excluir'"
      :cancel-text="'Cancelar'"
      :loading="deletingFuncionario"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Funcionario } from "~/types/funcionario";
import FuncionarioTable from "~/components/FuncionarioTable.vue";
import ConfirmModal from "~/components/ConfirmModal.vue";

const { user, checkAuth } = useAuth();
const { funcionarios, loading, error, fetchFuncionarios, deleteFuncionario } =
  useFuncionario();
const toast = useToast();

// Estados para o modal de exclusão
const confirmModal = ref();
const funcionarioToDelete = ref<Funcionario | null>(null);
const modalMessage = ref("");
const deletingFuncionario = ref(false);

// Verificar autenticação ao carregar a página
onMounted(async () => {
  await checkAuth();

  // Se não estiver logado, redirecionar para login
  if (!user.value) {
    await navigateTo("/login");
    return;
  }

  // Buscar funcionários ao montar a página
  await fetchFuncionarios();
});

// Função para atualizar dados
const handleRefresh = async () => {
  await fetchFuncionarios();
};

// Função para adicionar funcionário
const handleAddFuncionario = () => {
  // TODO: Navegar para página de cadastro ou abrir modal
  navigateTo("/novocadastro");
};

// Função para visualizar funcionário
const handleViewFuncionario = (funcionario: Funcionario) => {
  navigateTo(`/funcionario/${funcionario.id}`);
};

// Função para editar funcionário
const handleEditFuncionario = (funcionario: Funcionario) => {
  console.log(
    "🚀 Navegando para edição:",
    `/funcionario/${funcionario.id}/editar`
  );
  // Usar $router.push em vez de navigateTo para forçar navegação correta
  const router = useRouter();
  router.push(`/funcionario/${funcionario.id}/editar`);
};

// Função para deletar funcionário
const handleDeleteFuncionario = async (funcionario: Funcionario) => {
  funcionarioToDelete.value = funcionario;
  modalMessage.value = `Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?\n\nEsta ação não pode ser desfeita.`;
  confirmModal.value?.show();
};

// Função chamada quando o usuário confirma a exclusão
const confirmDelete = async () => {
  if (!funcionarioToDelete.value) return;

  try {
    deletingFuncionario.value = true;
    const result = await deleteFuncionario(funcionarioToDelete.value.id);

    if (result.success) {
      toast.success(
        `Funcionário "${funcionarioToDelete.value.nome}" excluído com sucesso!`
      );
      confirmModal.value?.hide();
    } else {
      toast.error(result.error || "Erro ao excluir funcionário");
    }
  } catch (err) {
    console.error("Erro ao excluir funcionário:", err);
    toast.error("Erro inesperado ao excluir funcionário");
  } finally {
    deletingFuncionario.value = false;
    funcionarioToDelete.value = null;
  }
};

// Função chamada quando o usuário cancela a exclusão
const cancelDelete = () => {
  funcionarioToDelete.value = null;
  modalMessage.value = "";
};
</script>
