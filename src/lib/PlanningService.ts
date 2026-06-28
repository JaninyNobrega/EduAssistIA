import type { PlanningFormData, PlanningResult } from "@/lib/types";
import type { PlanningProvider } from "@/lib/providers/PlanningProvider";
import { MockProvider } from "@/lib/providers/MockProvider";

/**
 * Serviço responsável por orquestrar a geração do planejamento pedagógico.
 *
 * Recebe os dados do formulário, delega a geração ao provedor configurado
 * e retorna o PlanningResult para a camada de interface (API Route).
 *
 * O provedor é injetado no construtor, permitindo que a troca entre
 * MockProvider e OpenAIProvider ocorra sem nenhuma alteração na interface
 * ou no fluxo principal da aplicação.
 *
 * Requisitos: RF05, RF11, RNF03, RNF04
 */
export class PlanningService {
  private readonly provider: PlanningProvider;

  /**
   * @param provider Provedor de geração a ser utilizado.
   * Se omitido, usa MockProvider por padrão (modo demonstração do MVP).
   */
  constructor(provider?: PlanningProvider) {
    this.provider = provider ?? new MockProvider();
  }

  /**
   * Gera uma sugestão estruturada de plano de aula a partir dos dados
   * informados pelo professor.
   *
   * @param data Dados preenchidos no formulário (obrigatórios e opcionais).
   * @returns PlanningResult seguindo o contrato definido em requirements.md § 6.
   */
  async generate(data: PlanningFormData): Promise<PlanningResult> {
    return this.provider.generate(data);
  }
}
