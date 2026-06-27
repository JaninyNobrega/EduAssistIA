import type { PlanningFormData, PlanningResult } from "@/lib/types";

/**
 * Contrato que todo provedor de geração de planejamento deve implementar.
 *
 * O MockProvider (MVP) e o futuro OpenAIProvider deverão implementar
 * esta interface sem que a Interface Web precise ser alterada.
 *
 * Requisitos: RF11, RNF03, RNF04
 */
export interface PlanningProvider {
  generate(data: PlanningFormData): Promise<PlanningResult>;
}
