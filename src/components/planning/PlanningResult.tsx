"use client";

import { useState } from "react";
import type { PlanningResult as PlanningResultType } from "@/lib/types";
import { generatePdf } from "@/lib/generatePdf";


// ─── Helpers de serialização (edição) ────────────────────────────────────────

function listToText(items: string[]): string {
  return items.join("\n");
}
function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  function formatDateBR(value?: string): string {
    if (!value) return "";

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return value;

    const [, year, month, day] = match;

    return `${day}/${month}/${year}`;
  }
}
export function formatDateBR(date: Date | string | number | null | undefined): string {
  if (!date) return "";

  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

// ─── Formatar para cópia ─────────────────────────────────────────────────────

function formatAsText(r: PlanningResultType): string {
  const sep = "─".repeat(48);
  const lines: string[] = [];
  lines.push(r.identificacao.toUpperCase());
  lines.push(`Turma: ${r.turma}`);
  lines.push(`Faixa etária: ${r.faixaEtaria}`);

  if (r.dataPeriodo) {
    lines.push(`Data ou período: ${formatDateBR(r.dataPeriodo)}`);
  }

  lines.push(`Tema: ${r.tema}`);
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
  r.metodologia.forEach((e, i) => lines.push(`${i + 1}. ${e}`));
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

// ─── DocSection: seção leve dentro do documento único ────────────────────────

/**
 * Substituiu o SectionCard.
 * Sem card individual — apenas título, separador discreto e conteúdo.
 * Botão "Editar" discreto à direita do título.
 * Em modo de edição exibe textarea + Salvar / Cancelar.
 */
function DocSection({
  title,
  sectionKey,
  editingSection,
  currentValue,
  onEdit,
  onSave,
  onCancel,
  children,
}: {
  title: string;
  sectionKey: string;
  editingSection: string | null;
  currentValue: string;
  onEdit: (key: string) => void;
  onSave: (key: string, value: string) => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const [draft, setDraft] = useState("");
  const isEditing = editingSection === sectionKey;

  function handleEditClick() {
    setDraft(currentValue);
    onEdit(sectionKey);
  }

  return (
    <div className="py-4">
      {/* Título da seção + botão Editar */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
          {title}
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
            aria-label={`Editar ${title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
        )}
      </div>

      {/* Conteúdo: leitura ou edição */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            autoFocus
            className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-slate-700 outline-none resize-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 leading-relaxed shadow-sm"
            aria-label={`Editar ${title}`}
          />
          {currentValue.includes("\n") && (
            <p className="text-xs text-slate-400">
              Cada linha representa um item separado.
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSave(sectionKey, draft)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-1.5 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}

      {/* Separador discreto */}
      <div className="mt-4 border-b border-slate-100" aria-hidden="true" />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * UX-R02: apresentação como documento pedagógico único.
 * - Um único card branco contendo todas as seções
 * - Separadores discretos entre seções
 * - Títulos em azul pequeno, sem ícones em excesso
 * - Botões Copiar / Exportar PDF ao lado do título do documento
 * - Edição por seção preservada (T12)
 *
 * Requisitos: RF08, RF09, RF10, RB02, UX02, UX03, UX07
 */
export function PlanningResult({
  result: initialResult,
}: {
  result: PlanningResultType;
}) {
  const [result, setResult] = useState<PlanningResultType>(initialResult);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [dateDraft, setDateDraft] = useState(initialResult.dataPeriodo ?? "");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "error">(
    "idle",
  );

  function handleEdit(key: string) {
    setEditingSection(key);
  }
  function handleCancel() {
    setEditingSection(null);
  }

  function handleEditDate() {
    setDateDraft(result.dataPeriodo ?? "");
    setEditingSection("dataPeriodo");
  }

  function handleSaveDate() {
    setResult((prev) => ({
      ...prev,
      dataPeriodo: dateDraft.trim() || undefined,
    }));

    setEditingSection(null);
  }

  function handleSave(key: string, value: string) {
    setResult((prev) => {
      const updated = { ...prev };
      const listFields: (keyof PlanningResultType)[] = [
        "direitosAprendizagem",
        "metodologia",
        "materiaisNecessarios",
        "adaptacoesPossiveis",
      ];
      (updated as Record<string, unknown>)[key] = listFields.includes(
        key as keyof PlanningResultType,
      )
        ? textToList(value)
        : value;
      return updated;
    });
    setEditingSection(null);
  }

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

  async function handleExportPdf() {
    setPdfState("generating");
    try {
      await generatePdf(result);
      setPdfState("idle");
    } catch {
      setPdfState("error");
      setTimeout(() => setPdfState("idle"), 3000);
    }
  }

  function ec(sectionKey: string, value: string | string[]) {
    return {
      sectionKey,
      currentValue: Array.isArray(value) ? listToText(value) : value,
      editingSection,
      onEdit: handleEdit,
      onSave: handleSave,
      onCancel: handleCancel,
    };
  }

  return (
    <section aria-label="Planejamento gerado" className="mt-2 mb-10">
      {/* Documento único */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Topo do documento: identificação + ações */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
                Planejamento Pedagógico
              </p>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {result.identificacao}
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  result.turma,
                  result.faixaEtaria,
                  result.dataPeriodo ? formatDateBR(result.dataPeriodo) : null,
                  result.tema,
                ]
                  .filter((tag): tag is string => Boolean(tag))
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
              <div className="mt-2">
                {editingSection === "dataPeriodo" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="date"
                      value={dateDraft}
                      onChange={(e) => setDateDraft(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      aria-label="Editar data do planejamento"
                    />

                    <button
                      type="button"
                      onClick={handleSaveDate}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Salvar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDateDraft(result.dataPeriodo ?? "");
                        setEditingSection(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditDate}
                    className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {result.dataPeriodo ? "Editar data" : "Adicionar data"}
                  </button>
                )}
              </div>
            </div>

            {/* Ações — ao lado do título */}
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={handleCopy}
                aria-live="polite"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-600 text-xs font-medium px-3 py-1.5 transition-colors"
              >
                {copyState === "copied" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 text-blue-600"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copiado!
                  </>
                ) : copyState === "error" ? (
                  "Erro"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={pdfState === "generating"}
                aria-live="polite"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pdfState === "generating" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 animate-spin"
                      aria-hidden="true"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Gerando...
                  </>
                ) : pdfState === "error" ? (
                  "Erro ao gerar"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Corpo do documento: seções */}
        <div className="px-6 divide-y-0">
          <DocSection
            title="Campo de Experiência"
            {...ec("campoExperiencia", result.campoExperiencia)}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.campoExperiencia}
            </p>
          </DocSection>

          <DocSection
            title="Direitos de Aprendizagem"
            {...ec("direitosAprendizagem", result.direitosAprendizagem)}
          >
            <div className="flex flex-wrap gap-1.5">
              {result.direitosAprendizagem.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {d}
                </span>
              ))}
            </div>
          </DocSection>

          <DocSection
            title="Objetivo de Aprendizagem"
            {...ec("objetivoAprendizagem", result.objetivoAprendizagem)}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.objetivoAprendizagem}
            </p>
          </DocSection>

          <DocSection
            title="Vivência de Aprendizagem"
            {...ec("vivenciaAprendizagem", result.vivenciaAprendizagem)}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.vivenciaAprendizagem}
            </p>
          </DocSection>

          <DocSection
            title="Metodologia"
            {...ec("metodologia", result.metodologia)}
          >
            <ol className="flex flex-col gap-1.5">
              {result.metodologia.map((etapa, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {etapa}
                  </span>
                </li>
              ))}
            </ol>
          </DocSection>

          <DocSection
            title="Materiais Necessários"
            {...ec("materiaisNecessarios", result.materiaisNecessarios)}
          >
            <ul className="flex flex-col gap-1">
              {result.materiaisNecessarios.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-blue-400 shrink-0"
                    aria-hidden="true"
                  />
                  {m}
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection
            title="Avaliação por Observação"
            {...ec("avaliacaoObservacao", result.avaliacaoObservacao)}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.avaliacaoObservacao}
            </p>
          </DocSection>

          <DocSection
            title="Adaptações Possíveis"
            {...ec("adaptacoesPossiveis", result.adaptacoesPossiveis)}
          >
            <ul className="flex flex-col gap-1.5">
              {result.adaptacoesPossiveis.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-slate-400 shrink-0 mt-2"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </DocSection>

          {/* Última seção — sem separador no final */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                Observação Final
              </h3>
              {editingSection !== "observacaoFinal" && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSection("observacaoFinal");
                  }}
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                  aria-label="Editar Observação Final"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3"
                    aria-hidden="true"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
            {editingSection === "observacaoFinal" ? (
              <ObsFinalEditor
                value={result.observacaoFinal}
                onSave={(v) => handleSave("observacaoFinal", v)}
                onCancel={handleCancel}
              />
            ) : (
              <p className="text-sm text-slate-500 leading-relaxed italic">
                {result.observacaoFinal}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Editor simples para observacaoFinal (campo sem spread de editConfig)
function ObsFinalEditor({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        autoFocus
        className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-slate-700 outline-none resize-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 leading-relaxed shadow-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-1.5 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Cancelar
        </button>
      </div>
    </div>
  );
}
