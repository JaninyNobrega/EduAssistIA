/**
 * Dados preenchidos pelo professor no formulário de planejamento.
 * Campos obrigatórios e opcionais conforme requirements.md § 3.
 */
export interface PlanningFormData {
  // Campos obrigatórios
  turma: string;
  faixaEtaria: string;
  tema: string;
  campoExperiencia: string;
  direitosAprendizagem: string[]; // pelo menos um
  objetivoAprendizagem: string;

  // Campos opcionais
  turno?: string;
  dataPeriodo?: string;
  duracao?: string;
  tipoAtividade?: string;
  materiaisDisponiveis?: string;
  observacoes?: string;
}

/**
 * Estrutura do plano de aula gerado pelo sistema.
 * Contrato compartilhado entre MockProvider e futuro OpenAIProvider.
 * Conforme requirements.md § 6 (Contrato da Resposta).
 */
export interface PlanningResult {
  identificacao: string;
  turma: string;
  faixaEtaria: string;
  tema: string;
  campoExperiencia: string;
  direitosAprendizagem: string[];
  objetivoAprendizagem: string;
  vivenciaAprendizagem: string;
  metodologia: string[];
  materiaisNecessarios: string[];
  avaliacaoObservacao: string;
  adaptacoesPossiveis: string[];
  observacaoFinal: string;
}
