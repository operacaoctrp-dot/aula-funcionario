<template>
  <div
    class="bg-card rounded-lg shadow-lg border border-border p-6 max-w-lg mx-auto"
  >
    <!-- Título -->
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-foreground">
        {{ isNovo ? "Cadastrar Funcionário" : "Editar Funcionário" }}
      </h2>
      <p class="text-muted-foreground mt-1">
        {{
          isNovo
            ? "Preencha os dados do novo funcionário"
            : "Atualize as informações do funcionário"
        }}
      </p>
    </div>

    <!-- Indicador de página de edição -->
    <div
      v-if="!isNovo && !readOnly"
      class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-center"
    >
      <p class="text-sm text-blue-800 font-medium">
        ✏️ Modifique os campos desejados e clique em "Editar Funcionário"
      </p>
    </div>

    <!-- Formulário -->
    <form @submit.prevent="handleSubmit" class="space-y-4 max-w-md mx-auto">
      <!-- Nome -->
      <BaseInput
        v-model="formData.nome"
        type="text"
        label="Nome *"
        placeholder="Digite o nome completo"
        id="form-funcionario-nome"
        :error="validationErrors.nome"
        :disabled="fieldsDisabled"
        @enter="handleSubmit"
      />

      <!-- Cargo -->
      <BaseDropdown
        v-model="formData.cargo"
        :options="cargoOptions"
        label="Cargo *"
        placeholder="Selecione um cargo"
        id="form-funcionario-cargo"
        :error="validationErrors.cargo"
        :disabled="fieldsDisabled"
      />

      <!-- Email -->
      <BaseInput
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Digite o email (opcional)"
        id="form-funcionario-email"
        :error="validationErrors.email"
        :disabled="fieldsDisabled"
        @enter="handleSubmit"
      />

      <!-- Endereço -->
      <BaseInput
        v-model="formData.endereco"
        type="text"
        label="Endereço"
        placeholder="Digite o endereço (opcional)"
        id="form-funcionario-endereco"
        :error="validationErrors.endereco"
        :disabled="fieldsDisabled"
        @enter="handleSubmit"
      />

      <!-- Salário -->
      <BaseInput
        v-model="formData.salario"
        type="number"
        label="Salário"
        placeholder="Digite o salário (opcional)"
        id="form-funcionario-salario"
        :error="validationErrors.salario"
        :disabled="fieldsDisabled"
        @enter="handleSubmit"
      />

      <!-- Botões -->
      <div v-if="!readOnly" class="flex justify-end space-x-3 pt-4">
        <BaseButton variant="outline" type="button" @click="handleCancel">
          Cancelar
        </BaseButton>

        <BaseButton
          variant="primary"
          type="button"
          :loading="funcionarioLoading"
          :disabled="funcionarioLoading"
          @click="handleButtonClick"
        >
          {{
            funcionarioLoading
              ? "Salvando..."
              : isNovo
              ? "Cadastrar Funcionário"
              : "Editar Funcionário"
          }}
        </BaseButton>
      </div>

      <!-- Espaço para botões externos em modo visualização -->
      <div v-else class="pt-4">
        <!-- Botões são gerenciados pela página pai -->
      </div>

      <!-- Feedback adicional -->
      <div v-if="funcionarioLoading" class="text-center mt-4">
        <p class="text-sm text-muted-foreground">Processando...</p>
      </div>

      <!-- Feedback de sucesso/erro -->
      <div
        v-if="feedbackMessage"
        class="mt-4 p-3 rounded-md text-center"
        :class="{
          'bg-green-50 border border-green-200 text-green-800':
            feedbackType === 'success',
          'bg-red-50 border border-red-200 text-red-800':
            feedbackType === 'error',
        }"
      >
        <p class="text-sm font-medium">{{ feedbackMessage }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, watch, computed } from "vue";
import type { CreateFuncionarioData, Funcionario } from "~/types/funcionario";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
import BaseDropdown from "./BaseDropdown.vue";

// Emits
const emit = defineEmits<{
  "sair-edicao": [];
}>();

// Props
const props = withDefaults(
  defineProps<{
    isNovo?: boolean;
    funcionarioData?: Funcionario | null;
    readOnly?: boolean;
  }>(),
  {
    isNovo: true,
    funcionarioData: null,
    readOnly: false,
  }
);

// Estados
const feedbackMessage = ref("");
const feedbackType = ref<"success" | "error" | "">("");
const isEditing = ref(true); // Iniciar sempre em modo de edição

// Opções de cargo
const cargoOptions = [
  "Analista de Sistemas",
  "Desenvolvedor Backend",
  "Designer UX",
  "Gerente de Projetos",
  "Assistente Administrativo",
  "Engenheiro de Dados",
  "Recrutadora",
  "Desenvolvedor Frontend",
  "Analista de Marketing",
  "Coordenador Financeiro",
];

// Dados do formulário
const formData = reactive<CreateFuncionarioData>({
  nome: "",
  cargo: "",
  endereco: "",
  email: "",
  salario: undefined,
});

// Computed property para determinar se os campos devem estar desabilitados
const fieldsDisabled = computed(() => {
  console.log("🔍 fieldsDisabled check:", {
    readOnly: props.readOnly,
    isNovo: props.isNovo,
  });

  // Se for novo cadastro, sempre habilitar campos
  if (props.isNovo) {
    return false;
  }

  // Se for edição, só habilitar quando não estiver em readOnly (modo edição ativo)
  return props.readOnly;
});

// Erros de validação
const validationErrors = reactive({
  nome: "",
  cargo: "",
  email: "",
  endereco: "",
  salario: "",
});

// Função para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar formulário
const validateForm = (): boolean => {
  console.log("🔍 Iniciando validação com dados:", { ...formData });

  // Limpar erros anteriores
  validationErrors.nome = "";
  validationErrors.cargo = "";
  validationErrors.email = "";
  validationErrors.endereco = "";
  validationErrors.salario = "";

  let isValid = true;

  // Validar nome (obrigatório)
  if (!formData.nome.trim()) {
    validationErrors.nome = "Nome é obrigatório";
    isValid = false;
  } else if (formData.nome.trim().length < 2) {
    validationErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    isValid = false;
  }

  // Validar cargo (obrigatório)
  if (!formData.cargo.trim()) {
    validationErrors.cargo = "Cargo é obrigatório";
    isValid = false;
  } else if (formData.cargo.trim().length < 2) {
    validationErrors.cargo = "Cargo deve ter pelo menos 2 caracteres";
    isValid = false;
  }

  // Validar email (opcional, mas se preenchido deve ser válido)
  if (
    formData.email &&
    formData.email.trim() &&
    !isValidEmail(formData.email.trim())
  ) {
    validationErrors.email = "Digite um email válido";
    isValid = false;
  }

  // Validar salário (opcional, mas se preenchido deve ser positivo)
  if (
    formData.salario !== undefined &&
    formData.salario !== null &&
    formData.salario < 0
  ) {
    validationErrors.salario = "Salário deve ser um valor positivo";
    isValid = false;
  }

  console.log("🔍 Resultado da validação:", {
    isValid,
    errors: validationErrors,
  });
  return isValid;
};

// Composables
const toast = useToast();
const {
  createFuncionario,
  updateFuncionario,
  loading: funcionarioLoading,
} = useFuncionario();

// Função para preencher formulário com dados do funcionário
const preencherFormulario = (funcionario: Funcionario) => {
  formData.nome = funcionario.nome || "";
  formData.cargo = funcionario.cargo || "";
  formData.endereco = funcionario.endereco || "";
  formData.email = funcionario.email || "";
  formData.salario = funcionario.salario || undefined;

  console.log("Formulário preenchido com:", funcionario);
};

// Função para resetar formulário
const resetForm = () => {
  formData.nome = "";
  formData.cargo = "";
  formData.endereco = "";
  formData.email = "";
  formData.salario = undefined;

  // Limpar erros
  validationErrors.nome = "";
  validationErrors.cargo = "";
  validationErrors.email = "";
  validationErrors.endereco = "";
  validationErrors.salario = "";
};

// Função específica para o clique do botão
// Função de teste simples
const testeSimples = () => {
  console.log("🚀 TESTE EXECUTADO - BOTÃO FUNCIONANDO!");
  alert("TESTE: Botão clicado com sucesso!");
  feedbackMessage.value = "TESTE: Clique funcionando!";
  feedbackType.value = "success";

  // Fazer update direto
  if (!props.isNovo && props.funcionarioData?.id) {
    updateFuncionario(props.funcionarioData.id, {
      nome: formData.nome.trim(),
      cargo: formData.cargo.trim(),
      email: formData.email?.trim() || undefined,
      endereco: formData.endereco?.trim() || undefined,
      salario: formData.salario || undefined,
    }).then((result) => {
      if (result.success) {
        toast.success("Funcionário atualizado com sucesso!");
        setTimeout(() => navigateTo("/"), 1500);
      } else {
        toast.error("Erro ao atualizar");
      }
    });
  }
};

// Função para clique do botão
const handleButtonClick = async () => {
  console.log("🚀 handleButtonClick executado!", {
    isNovo: props.isNovo,
    funcionarioId: props.funcionarioData?.id,
  });

  // Se for novo cadastro, usar handleSubmit
  if (props.isNovo) {
    return handleSubmit();
  }

  // Validar formulário antes de tentar atualizar
  if (!validateForm()) {
    toast.error("Por favor, corrija os erros no formulário");
    return;
  }

  // Se for edição, executar atualização direta
  if (!props.funcionarioData?.id) {
    toast.error("ID do funcionário não encontrado");
    return;
  }

  try {
    // Mostrar toast de carregamento
    toast.info("Atualizando funcionário...");

    const result = await updateFuncionario(props.funcionarioData.id, {
      nome: formData.nome.trim(),
      cargo: formData.cargo.trim(),
      email: formData.email?.trim() || undefined,
      endereco: formData.endereco?.trim() || undefined,
      salario: formData.salario || undefined,
    });

    if (result.success) {
      // Toast de sucesso
      toast.success("✅ Funcionário atualizado com sucesso!");

      // Feedback visual no componente também
      feedbackMessage.value = "Funcionário atualizado com sucesso!";
      feedbackType.value = "success";

      // Redirecionar após um delay para mostrar o feedback
      setTimeout(() => {
        navigateTo("/");
      }, 2000);
    } else {
      const errorMsg = result.error || "Erro ao atualizar funcionário";
      toast.error(`❌ ${errorMsg}`);
      feedbackMessage.value = errorMsg;
      feedbackType.value = "error";
    }
  } catch (error) {
    console.error("Erro na atualização:", error);
    const errorMsg = "Erro inesperado ao atualizar funcionário";
    toast.error(`❌ ${errorMsg}`);
    feedbackMessage.value = errorMsg;
    feedbackType.value = "error";
  }
};

// Função para lidar com o submit
const handleSubmit = async () => {
  console.log("🚀 handleSubmit executado!", {
    isNovo: props.isNovo,
    funcionarioId: props.funcionarioData?.id,
  });

  // Limpar feedback anterior
  feedbackMessage.value = "";
  feedbackType.value = "";

  if (!validateForm()) {
    feedbackMessage.value = "Por favor, corrija os erros no formulário";
    feedbackType.value = "error";
    toast.error("Por favor, corrija os erros no formulário");
    return;
  }

  if (props.isNovo) {
    // Salvamento de novo funcionário
    try {
      const result = await createFuncionario(formData);

      if (result.success) {
        feedbackMessage.value = "Funcionário cadastrado com sucesso!";
        feedbackType.value = "success";
        toast.success("Funcionário cadastrado com sucesso!");

        // Resetar formulário após um pequeno delay para mostrar o feedback
        setTimeout(() => {
          resetForm();
          feedbackMessage.value = "";
          feedbackType.value = "";
        }, 2000);

        // Redirecionar para a página inicial após sucesso
        setTimeout(async () => {
          await navigateTo("/");
        }, 2500);
      } else {
        const errorMsg = result.error || "Erro ao cadastrar funcionário";
        feedbackMessage.value = errorMsg;
        feedbackType.value = "error";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      const errorMsg = "Erro inesperado ao cadastrar funcionário";
      feedbackMessage.value = errorMsg;
      feedbackType.value = "error";
      toast.error(errorMsg);
    }
  } else {
    // Para edição, usar handleButtonClick diretamente
    await handleButtonClick();
  }
};

// Função para cancelar
const handleCancel = () => {
  console.log("🚀 handleCancel executado!");

  // Limpar mensagens
  feedbackMessage.value = "";
  feedbackType.value = "";

  // Se não é novo, recarregar dados originais e sair da edição
  if (!props.isNovo && props.funcionarioData) {
    preencherFormulario(props.funcionarioData);
    toast.info("🔄 Alterações descartadas - saindo da edição");

    // Emitir evento para a página pai sair da edição
    emit("sair-edicao");
    return;
  }

  // Se é novo cadastro, resetar e redirecionar
  resetForm();
  toast.info("❌ Operação cancelada");
  navigateTo("/");
};

// Watcher para preencher formulário quando funcionarioData mudar
watch(
  () => props.funcionarioData,
  (novoFuncionario) => {
    if (novoFuncionario && !props.isNovo) {
      preencherFormulario(novoFuncionario);
    }
  },
  { immediate: true }
);

// OnMounted para preencher formulário se já tiver dados
onMounted(() => {
  console.log("🔍 PROPS DEBUG onMounted:", {
    isNovo: props.isNovo,
    readOnly: props.readOnly,
    funcionarioData: !!props.funcionarioData,
    funcionarioId: props.funcionarioData?.id,
  });

  if (props.funcionarioData && !props.isNovo) {
    preencherFormulario(props.funcionarioData);
  }
});
</script>
