"use client";

import { useState } from "react";
import type { PlanningResult as PlanningResultType } from "@/lib/types";
import { SectionCard } from "@/components/planning/SectionCard";

/**
 * Serializa string[] → string com itens separados por \n (para edição em textarea).
 */
function listToText(items: string[]): string {
  return items.join("\n");
}

/**
 * Deserializa string → string[], descartando linhas vazias.
 */
function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Formata o planejamento completo como texto simples para cópia.
 * Cada seção recebe um título em caixa alta e separadores para facilitar
 * a leitura quando colado em qualquer editor de texto.
 *
 * Requisito: RF10
 */
function formatAsText(r: PlanningResultType): string {
  const sep = "─".repeat(48);
  const lines: string[] = [];

  lines.push(r.identificacao.toUpperCase());
  lines.push(`Turma: ${r.turma} | Faixa etária: ${r.faixaEtaria} | Tema: ${r.tema}`);
  lines.push("");

  lines.push(sep);
  lines.push("CAMPO DE EXPERIÊNCIA");
  lines.push(r.campoExperiencia);
  lines.push("");

  lines.push(sep);
  lines.push("DIREITOS DE APRENDIZAGEM");
  r.direitosAprendizagem.forEach((d) => lines.push(`• ${d}`));
  lines.push("");

  lines.push(sep);
  lines.push("OBJETIVO DE APRENDIZAGEM");
  lines.push(r.objetivoAprendizagem);
  lines.push("");

  lines.push(sep);
  lines.push("VIVÊNCIA DE APRENDIZAGEM");
  lines.push(r.vivenciaAprendizagem);
  lines.push("");

  lines.push(sep);
  lines.push("METODOLOGIA");
  r.metodologia.forEach((etapa, i) => lines.push(`${i + 1}. ${etapa}`));
  lines.push("");

  lines.push(sep);
  lines.push("MATERIAIS NECESSÁRIOS");
  r.materiaisNecessarios.forEach((m) => lines.push(`• ${m}`));
  lines.push("");

  lines.push(sep);
  lines.push("AVALIAÇÃO POR OBSERVAÇÃO");
  lines.push(r.avaliacaoObservacao);
  lines.push("");

  lines.push(sep);
  lines.push("ADAPTAÇÕES POSSÍVEIS");
  r.adaptacoesPossiveis.forEach((a) => lines.push(`• ${a}`));
  lines.push("");

  lines.push(sep);
  lines.push("OBSERVAÇÃO FINAL");
  lines.push(r.observacaoFinal);

  return lines.join("\n");
}

/**
 * Componente de exibição e edição do planejamento pedagógico gerado.
 *
 * - Cada seção possui um botão "Editar" discreto no cabeçalho.
 * - Apenas uma seção fica em edição por vez.
 * - A edição ocorre apenas em memória (sem API, sem banco).
 * - Textos simples → textarea; listas → textarea com um item por linha.
 *
 * Requisitos: RF08, RF09, RB02
 */
export function PlanningResult({ result: initialResult }: { result: PlanningResultType }) {
  // Estado do planejamento — mutável apenas em memória
  const [result, setResult] = useState<PlanningResultType>(initialResult);

  // Qual seção está em edição (null = nenhuma)
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Estado do botão de cópia: idle | copied | error
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  /** Abre o modo de edição para uma seção. */
  function handleEdit(key: string) {
    setEditingSection(key);
  }

  /** Salva o rascunho: atualiza o resultado em memória e fecha a edição. */
  function handleSave(key: string, value: string) {
    setResult((prev) => {
      const updated = { ...prev };

      // Campos que são listas (string[])
      const listFields: (keyof PlanningResultType)[] = [
        "direitosAprendizagem",
        "metodologia",
        "materiaisNecessarios",
        "adaptacoesPossiveis",
      ];

      if (listFields.includes(key as keyof PlanningResultType)) {
        (updated as Record<string, unknown>)[key] = textToList(value);
      } else {
        (updated as Record<string, unknown>)[key] = value;
      }

      return updated;
    });

    setEditingSection(null);
  }

  /** Descarta o rascunho e fecha a edição. */
  function handleCancel() {
    setEditingSection(null);
  }

  /** Copia o planejamento formatado para a área de transferência. RF10 */
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatAsText(result));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  /**
   * Monta o editConfig para cada seção, centralizando a lógica de edição.
   * Campos lista são serializados com listToText para exibição no textarea.
   */
  function editConfig(sectionKey: string, value: string | string[]) {
    const currentValue = Array.isArray(value) ? listToText(value) : value;
    return {
      sectionKey,
      currentValue,
      editingSection,
      onEdit: handleEdit,
      onSave: handleSave,
      onCancel: handleCancel,
    };
  }

  return (
    <section aria-label="Planejamento gerado" className="flex flex-col gap-4 mt-2 mb-10">

      {/* Cabeçalho do resultado — identificação (não editável) */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4 opacity-80" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-sm font-medium opacity-90">Planejamento gerado com sucesso</span>
        </div>
        <h2 className="text-lg font-bold leading-snug">{result.identificacao}</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">
            {result.turma}
          </span>
          <span className="inline-flex items-center rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">
            {result.faixaEtaria}
          </span>
          <span className="inline-flex items-center rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">
            {result.tema}
          </span>
        </div>

        {/* Botão Copiar — RF10 */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 transition-colors"
            aria-live="polite"
          >
            {copyState === "copied" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Planejamento copiado!
              </>
            ) : copyState === "error" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Não foi possível copiar
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar planejamento
              </>
            )}
          </button>
        </div>
      </div>

      {/* Campo de Experiência */}
      <SectionCard
        title="Campo de Experiência"
        editConfig={editConfig("campoExperiencia", result.campoExperiencia)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">{result.campoExperiencia}</p>
      </SectionCard>

      {/* Direitos de Aprendizagem */}
      <SectionCard
        title="Direitos de Aprendizagem"
        editConfig={editConfig("direitosAprendizagem", result.direitosAprendizagem)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        }
      >
        <div className="flex flex-wrap gap-2">
          {result.direitosAprendizagem.map((direito) => (
            <span
              key={direito}
              className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {direito}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Objetivo de Aprendizagem */}
      <SectionCard
        title="Objetivo de Aprendizagem"
        editConfig={editConfig("objetivoAprendizagem", result.objetivoAprendizagem)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">{result.objetivoAprendizagem}</p>
      </SectionCard>

      {/* Vivência de Aprendizagem */}
      <SectionCard
        title="Vivência de Aprendizagem"
        editConfig={editConfig("vivenciaAprendizagem", result.vivenciaAprendizagem)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">{result.vivenciaAprendizagem}</p>
      </SectionCard>

      {/* Metodologia */}
      <SectionCard
        title="Metodologia"
        editConfig={editConfig("metodologia", result.metodologia)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        }
      >
        <ol className="flex flex-col gap-2">
          {result.metodologia.map((etapa, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed">{etapa}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Materiais Necessários */}
      <SectionCard
        title="Materiais Necessários"
        editConfig={editConfig("materiaisNecessarios", result.materiaisNecessarios)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        }
      >
        <ul className="flex flex-col gap-1.5">
          {result.materiaisNecessarios.map((material, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" aria-hidden="true" />
              {material}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Avaliação por Observação */}
      <SectionCard
        title="Avaliação por Observação"
        editConfig={editConfig("avaliacaoObservacao", result.avaliacaoObservacao)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">{result.avaliacaoObservacao}</p>
      </SectionCard>

      {/* Adaptações Possíveis */}
      <SectionCard
        title="Adaptações Possíveis"
        editConfig={editConfig("adaptacoesPossiveis", result.adaptacoesPossiveis)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
        }
      >
        <ul className="flex flex-col gap-2">
          {result.adaptacoesPossiveis.map((adaptacao, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" aria-hidden="true" />
              <span className="leading-relaxed">{adaptacao}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Observação Final */}
      <SectionCard
        title="Observação Final"
        editConfig={editConfig("observacaoFinal", result.observacaoFinal)}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      >
        <p className="text-sm text-slate-500 leading-relaxed italic">{result.observacaoFinal}</p>
      </SectionCard>

    </section>
  );
}
