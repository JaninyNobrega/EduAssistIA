// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {  cleanup, render, screen } from "@testing-library/react";
import PlanejamentoPage from "../app/planejamento/page";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

vi.stubGlobal("scrollTo", vi.fn());

afterEach(() => {
  cleanup();
});

describe("Interface de planejamento", () => {
  it("deve apresentar a primeira etapa do formulário", () => {
    render(<PlanejamentoPage />);

    expect(
      screen.getByRole("heading", { name: "Novo Planejamento" })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", { name: "Sobre a turma" })
    ).toBeTruthy();
  });
  it("deve impedir o avanço quando a turma não foi selecionada", async () => {
  const user = userEvent.setup();

  render(<PlanejamentoPage />);

  await user.click(
  screen.getByRole("button", { name: "Continuar" })
);

  expect(
    screen.getByRole("alert")
  ).toHaveTextContent("Selecione a turma.");

  expect(
    screen.getByRole("heading", { name: "Sobre a turma" })
  ).toBeTruthy();
});
it("deve preencher a faixa etária automaticamente ao selecionar a turma", async () => {
  const user = userEvent.setup();

  render(<PlanejamentoPage />);

  await user.selectOptions(
    screen.getByRole("combobox", { name: /Turma/i }),
    "Infantil II"
  );

  expect(
    screen.getByText("4 a 5 anos")
  ).toBeInTheDocument();
});
it("deve avançar para a segunda etapa após selecionar uma turma", async () => {
  const user = userEvent.setup();

  render(<PlanejamentoPage />);

  await user.selectOptions(
    screen.getByRole("combobox", { name: /Turma/i }),
    "Infantil II"
  );

  await user.click(
    screen.getByRole("button", { name: "Continuar" })
  );

  expect(
    screen.getByRole("heading", { name: "Sobre a atividade" })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", { name: "Sobre a turma" })
  ).not.toBeInTheDocument();
});
});