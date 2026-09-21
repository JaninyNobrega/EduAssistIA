import { describe, expect, it } from "vitest";
import { MockProvider } from "../lib/providers/MockProvider";
import type { PlanningFormData } from "../lib/types";

describe("MockProvider", () => {
  it("deve transformar os materiais informados em uma lista sem espaços excedentes", async () => {
    const dados: PlanningFormData = {
      turma: "Infantil IV",
      faixaEtaria: "4 a 5 anos",
      tema: "Cores",
      campoExperiencia: "Traços, sons, cores e formas",
      direitosAprendizagem: ["Explorar"],
      objetivoAprendizagem: "Explorar diferentes cores.",
      materiaisDisponiveis: " Papel , tinta; pincéis\n cartolina ",
    };

    const provider = new MockProvider();
    const resultado = await provider.generate(dados);

    expect(resultado.materiaisNecessarios).toEqual([
      "Papel",
      "tinta",
      "pincéis",
      "cartolina",
    ]);
  });
  it("deve fornecer materiais padrão quando o professor não informa materiais", async () => {
  const dados: PlanningFormData = {
    turma: "Infantil IV",
    faixaEtaria: "4 a 5 anos",
    tema: "Cores",
    campoExperiencia: "Traços, sons, cores e formas",
    direitosAprendizagem: ["Explorar"],
    objetivoAprendizagem: "Explorar diferentes cores.",
  };

  const provider = new MockProvider();
  const resultado = await provider.generate(dados);

  expect(Array.isArray(resultado.materiaisNecessarios)).toBe(true);
  expect(resultado.materiaisNecessarios.length).toBeGreaterThan(0);
});
it("deve preservar os dados informados pelo professor", async () => {
  const dados: PlanningFormData = {
    turma: "Infantil IV",
    faixaEtaria: "4 a 5 anos",
    tema: "Cores",
    campoExperiencia: "Traços, sons, cores e formas",
    direitosAprendizagem: ["Explorar", "Brincar"],
    objetivoAprendizagem: "Explorar diferentes cores.",
    dataPeriodo: "21/09/2026",
  };

  const provider = new MockProvider();
  const resultado = await provider.generate(dados);

  expect(resultado.turma).toBe(dados.turma);
  expect(resultado.faixaEtaria).toBe(dados.faixaEtaria);
  expect(resultado.tema).toBe(dados.tema);
  expect(resultado.campoExperiencia).toBe(dados.campoExperiencia);
  expect(resultado.direitosAprendizagem).toEqual(
    dados.direitosAprendizagem
  );
  expect(resultado.objetivoAprendizagem).toBe(
    dados.objetivoAprendizagem
  );
  expect(resultado.dataPeriodo).toBe(dados.dataPeriodo);
});
});