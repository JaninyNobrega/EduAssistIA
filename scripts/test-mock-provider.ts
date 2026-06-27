/**
 * Script de teste manual do MockProvider.
 * Executa com: npx tsx --tsconfig tsconfig.json scripts/test-mock-provider.ts
 *
 * Não é um arquivo de produção — pode ser removido após validação.
 */
import { MockProvider } from "@/lib/providers/MockProvider";
import type { PlanningFormData } from "@/lib/types";

const input: PlanningFormData = {
  // Campos obrigatórios
  turma: "Maternal II",
  faixaEtaria: "3 a 4 anos",
  tema: "Animais da Fazenda",
  campoExperiencia: "Escuta, fala, pensamento e imaginação",
  direitosAprendizagem: ["Conviver", "Brincar", "Explorar"],
  objetivoAprendizagem:
    "Ampliar o vocabulário e o conhecimento sobre animais por meio de experiências lúdicas.",

  // Campos opcionais
  turno: "Manhã",
  dataPeriodo: "Semana 1 – Junho 2025",
  duracao: "45 minutos",
  tipoAtividade: "Roda de conversa + atividade manual",
  materiaisDisponiveis: "Figuras de animais, EVA colorido, cola, tesoura",
  observacoes: "Duas crianças com alergia a látex — evitar balões.",
};

async function main() {
  console.log("=== Testando MockProvider ===\n");
  console.log("Dados de entrada:");
  console.log(JSON.stringify(input, null, 2));
  console.log("\n--- Gerando planejamento (aguarde ~800ms) ---\n");

  const provider = new MockProvider();
  const result = await provider.generate(input);

  console.log("Resultado recebido:");
  console.log(JSON.stringify(result, null, 2));

  // Validações básicas do contrato (requirements.md § 6)
  const camposObrigatorios: (keyof typeof result)[] = [
    "identificacao",
    "turma",
    "faixaEtaria",
    "tema",
    "campoExperiencia",
    "direitosAprendizagem",
    "objetivoAprendizagem",
    "vivenciaAprendizagem",
    "metodologia",
    "materiaisNecessarios",
    "avaliacaoObservacao",
    "adaptacoesPossiveis",
    "observacaoFinal",
  ];

  console.log("\n--- Verificando contrato da resposta ---");
  let todosPresentes = true;
  for (const campo of camposObrigatorios) {
    const valor = result[campo];
    const presente =
      valor !== undefined &&
      valor !== null &&
      (Array.isArray(valor) ? valor.length > 0 : String(valor).length > 0);
    console.log(`  ${presente ? "✅" : "❌"} ${campo}`);
    if (!presente) todosPresentes = false;
  }

  // Verificar espelhamento dos dados de entrada
  console.log("\n--- Verificando espelhamento dos dados de entrada ---");
  console.log(`  ${result.turma === input.turma ? "✅" : "❌"} turma`);
  console.log(`  ${result.faixaEtaria === input.faixaEtaria ? "✅" : "❌"} faixaEtaria`);
  console.log(`  ${result.tema === input.tema ? "✅" : "❌"} tema`);
  console.log(`  ${result.campoExperiencia === input.campoExperiencia ? "✅" : "❌"} campoExperiencia`);
  console.log(
    `  ${JSON.stringify(result.direitosAprendizagem) === JSON.stringify(input.direitosAprendizagem) ? "✅" : "❌"} direitosAprendizagem`
  );

  // Verificar materiais opcionais parseados
  console.log("\n--- Verificando materiais (campo opcional parseado) ---");
  console.log("  Materiais no resultado:", result.materiaisNecessarios);

  console.log(
    `\n${todosPresentes ? "✅ Todos os campos do contrato estão presentes." : "❌ Campos ausentes detectados."}`
  );
}

main().catch((err) => {
  console.error("Erro durante o teste:", err);
  process.exit(1);
});
