export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  endereco: string | null;
  email: string | null;
  salario: number | null;
  created_at: string | null;
}

export interface CreateFuncionarioData {
  nome: string;
  cargo: string;
  endereco?: string;
  email?: string;
  salario?: number;
}

export interface UpdateFuncionarioData {
  nome?: string;
  cargo?: string;
  endereco?: string;
  email?: string;
  salario?: number;
}
