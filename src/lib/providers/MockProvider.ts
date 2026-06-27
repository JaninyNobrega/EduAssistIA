import type { PlanningFormData, PlanningResult } from "@/lib/types";
import type { PlanningProvider } from "@/lib/providers/PlanningProvider";

/**
 * Provedor de geração simulada para o modo demonstração do MVP.
 *
 * Implementa PlanningProvider seguindo o contrato definido em
 * requirements.md § 6, sem realizar nenhuma chamada a API externa.
 *
 * Os campos de identificação são derivados dos dados informados pelo
 * professor; os demais campos contêm conteúdo pedagógico fixo e
 * coerente com Educação Infantil / BNCC.
 *
 * Requisitos: RF06, RF08, seção 9 do requirements.md
 */
export class MockProvider implements PlanningProvider {
  async generate(data: PlanningFormData): Promise<PlanningResult> {
    // Delay simulado para que o estado de carregamento (RF07) seja visível
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      // Identificação gerada a partir dos dados informados pelo professor
      identificacao: `Plano de Aula – ${data.turma} | ${data.tema}`,

      // Dados espelhados da entrada
      turma: data.turma,
      faixaEtaria: data.faixaEtaria,
      tema: data.tema,
      campoExperiencia: data.campoExperiencia,
      direitosAprendizagem: data.direitosAprendizagem,
      objetivoAprendizagem: data.objetivoAprendizagem,

      // Conteúdo pedagógico gerado (simulado)
      vivenciaAprendizagem:
        "As crianças serão convidadas a explorar o tema por meio de uma roda de conversa inicial, " +
        "onde poderão compartilhar seus conhecimentos prévios e curiosidades. " +
        "Em seguida, realizarão uma atividade prática em pequenos grupos, " +
        "utilizando materiais concretos para investigar, experimentar e criar. " +
        "A vivência será encerrada com um momento coletivo de socialização das descobertas.",

      metodologia: [
        "Roda de conversa para levantamento de conhecimentos prévios.",
        "Exploração livre com materiais concretos em pequenos grupos.",
        "Observação e registro das descobertas por meio de desenho ou fala.",
        "Socialização coletiva das produções e reflexão conjunta.",
        "Encerramento com música ou história relacionada ao tema.",
      ],

      materiaisNecessarios:
        data.materiaisDisponiveis
          ? data.materiaisDisponiveis
              .split(/[,;\n]/)
              .map((m) => m.trim())
              .filter(Boolean)
          : [
              "Folhas de papel sulfite",
              "Lápis de cor e canetinhas",
              "Materiais naturais (folhas, pedras, sementes)",
              "Cartolina para registro coletivo",
            ],

      avaliacaoObservacao:
        "A avaliação ocorrerá por meio da observação contínua das crianças durante todas as etapas da atividade. " +
        "O professor deverá observar: participação e engajamento na roda de conversa; " +
        "capacidade de colaboração e respeito ao colega durante o trabalho em grupo; " +
        "expressão oral ao compartilhar descobertas; e demonstração de curiosidade e interesse pelo tema. " +
        "Registros fotográficos e anotações no diário de classe poderão complementar a avaliação.",

      adaptacoesPossiveis: [
        "Para crianças com dificuldade de comunicação oral: permitir expressão por gestos, desenho ou apontar.",
        "Para crianças com mobilidade reduzida: adaptar os materiais para manipulação na mesa ou cadeira de rodas.",
        "Para ampliar o desafio: propor que as crianças dicionem perguntas para investigação futura.",
        "Para turmas maiores: organizar em mais grupos com um adulto de apoio em cada.",
      ],

      observacaoFinal:
        "Esta sugestão de plano de aula foi gerada como ponto de partida para o planejamento do professor. " +
        "Recomenda-se que o conteúdo seja revisado, adaptado e complementado de acordo com o contexto " +
        "específico da turma, os recursos disponíveis na instituição e a avaliação diagnóstica das crianças. " +
        "O professor é o principal responsável pela decisão pedagógica final.",
    };
  }
}
