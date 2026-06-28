import { PlanningService } from "@/lib/PlanningService";
import type { PlanningFormData } from "@/lib/types";

/**
 * POST /api/planning
 *
 * Recebe os dados do formulário preenchido pelo professor e retorna
 * uma sugestão estruturada de plano de aula.
 *
 * Entrada:  PlanningFormData (JSON)
 * Saída:    PlanningResult   (JSON) — contrato definido em requirements.md § 6
 *
 * A rota não contém lógica de negócio: apenas valida a presença dos
 * campos obrigatórios e delega a geração ao PlanningService.
 *
 * Nenhuma chamada a APIs externas ocorre nesta versão (RF06).
 *
 * Requisitos: RF05, RF06
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "O corpo da requisição deve ser um JSON válido." },
      { status: 400 }
    );
  }

  // Validação mínima dos campos obrigatórios (requirements.md § 3.1)
  const data = body as Partial<PlanningFormData>;

  const camposFaltando: string[] = [];

  if (!data.turma?.trim()) camposFaltando.push("turma");
  if (!data.faixaEtaria?.trim()) camposFaltando.push("faixaEtaria");
  if (!data.tema?.trim()) camposFaltando.push("tema");
  if (!data.campoExperiencia?.trim()) camposFaltando.push("campoExperiencia");
  if (!data.objetivoAprendizagem?.trim()) camposFaltando.push("objetivoAprendizagem");
  if (
    !Array.isArray(data.direitosAprendizagem) ||
    data.direitosAprendizagem.length === 0
  ) {
    camposFaltando.push("direitosAprendizagem");
  }

  if (camposFaltando.length > 0) {
    return Response.json(
      {
        error: "Campos obrigatórios ausentes.",
        campos: camposFaltando,
      },
      { status: 400 }
    );
  }

  try {
    const service = new PlanningService();
    const result = await service.generate(data as PlanningFormData);
    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error("[POST /api/planning] Erro ao gerar planejamento:", err);
    return Response.json(
      { error: "Erro interno ao gerar o planejamento. Tente novamente." },
      { status: 500 }
    );
  }
}
