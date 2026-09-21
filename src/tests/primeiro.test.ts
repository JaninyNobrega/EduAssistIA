import { describe, expect, it } from "vitest";

describe("Meu primeiro teste automatizado", () => {
  it("deve somar dois números corretamente", () => {
    const resultado = 2 + 3;

    expect(resultado).toBe(5);
  });
});