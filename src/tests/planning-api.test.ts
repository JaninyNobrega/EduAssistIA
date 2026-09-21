import { describe, expect, it } from "vitest";
import { POST } from "../app/api/planning/route";

describe("API de planejamento", () => {
  it("deve rejeitar um planejamento sem turma", async () => {
    const dados = {
      faixaEtaria: "4 a 5 anos",
      tema: "Cores",
      campoExperiencia: "Traços, sons, cores e formas",
      direitosAprendizagem: ["Explorar"],
      objetivoAprendizagem: "Explorar diferentes cores.",
    };

    const request = new Request("http://localhost/api/planning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const response = await POST(request);
    const resultado = await response.json();

    expect(response.status).toBe(400);
    expect(resultado.error).toBe("Campos obrigatórios ausentes.");
    expect(resultado.campos).toContain("turma");
  });

  it("deve rejeitar um objetivo de aprendizagem em branco", async () => {
    const dados = {
      turma: "Infantil IV",
      faixaEtaria: "4 a 5 anos",
      tema: "Cores",
      campoExperiencia: "Traços, sons, cores e formas",
      direitosAprendizagem: ["Explorar"],
      objetivoAprendizagem: "   ",
    };

    const request = new Request("http://localhost/api/planning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const response = await POST(request);
    const resultado = await response.json();

    expect(response.status).toBe(400);
    expect(resultado.error).toBe("Campos obrigatórios ausentes.");
    expect(resultado.campos).toContain("objetivoAprendizagem");
  });
  it("deve rejeitar uma lista vazia de direitos de aprendizagem", async () => {
    const dados = {
      turma: "Infantil IV",
      faixaEtaria: "4 a 5 anos",
      tema: "Cores",
      campoExperiencia: "Traços, sons, cores e formas",
      direitosAprendizagem: [],
      objetivoAprendizagem: "Explorar diferentes cores.",
    };

    const request = new Request("http://localhost/api/planning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const response = await POST(request);
    const resultado = await response.json();

    expect(response.status).toBe(400);
    expect(resultado.error).toBe("Campos obrigatórios ausentes.");
    expect(resultado.campos).toContain("direitosAprendizagem");
  });
  it("deve rejeitar um corpo que não seja um JSON válido", async () => {
  const request = new Request("http://localhost/api/planning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{ json inválido",
  });

  const response = await POST(request);
  const resultado = await response.json();

  expect(response.status).toBe(400);
  expect(resultado.error).toBe(
    "O corpo da requisição deve ser um JSON válido."
  );
});
it("deve gerar um planejamento quando os campos obrigatórios estão preenchidos", async () => {
  const dados = {
    turma: "Infantil IV",
    faixaEtaria: "4 a 5 anos",
    tema: "Cores",
    campoExperiencia: "Traços, sons, cores e formas",
    direitosAprendizagem: ["Explorar"],
    objetivoAprendizagem: "Explorar diferentes cores.",
  };

  const request = new Request("http://localhost/api/planning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const response = await POST(request);
  const resultado = await response.json();

  expect(response.status).toBe(200);
  expect(resultado.turma).toBe("Infantil IV");
  expect(resultado.tema).toBe("Cores");
  expect(resultado.objetivoAprendizagem).toBe(
    "Explorar diferentes cores."
  );
  expect(resultado.vivenciaAprendizagem).toEqual(expect.any(String));
});
});
