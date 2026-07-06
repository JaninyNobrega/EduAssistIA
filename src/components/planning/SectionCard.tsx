"use client";

import { useState } from "react";

/**
 * Configuração de edição injetada pelo PlanningResult.
 * Quando presente, o card exibe o botão "Editar" e gerencia o modo de edição.
 */
export type EditConfig = {
  /** Identificador único desta seção (ex: "metodologia") */
  sectionKey: string;
  /** Valor atual serializado para o textarea (texto simples ou itens separados por \n) */
  currentValue: string;
  /** Qual seção está atualmente em edição (null = nenhuma) */
  editingSection: string | null;
  /** Abre o modo de edição para esta seção */
  onEdit: (key: string, value: string) => void;
  /** Salva o rascunho e fecha o modo de edição */
  onSave: (key: string, value: string) => void;
  /** Descarta o rascunho e fecha o modo de edição */
  onCancel: () => void;
};

/**
 * Card reutilizável para cada seção do planejamento gerado.
 *
 * Segue o padrão visual definido no design-system.md:
 * - cantos arredondados (rounded-2xl)
 * - sombra suave (shadow-sm)
 * - espaçamento generoso
 * - ícone azul + título em destaque
 *
 * Quando editConfig for fornecido, o card suporta edição inline:
 * - botão "Editar" discreto no cabeçalho
 * - textarea substitui o conteúdo em modo de edição
 * - botões Salvar / Cancelar durante a edição
 *
 * Requisito: RF09, RB02
 */
export function SectionCard({
  title,
  icon,
  children,
  editConfig,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  editConfig?: EditConfig;
}) {
  const [draft, setDraft] = useState("");

  const isEditing =
    editConfig !== undefined &&
    editConfig.editingSection === editConfig.sectionKey;

  function handleEditClick() {
    if (!editConfig) return;
    setDraft(editConfig.currentValue);
    editConfig.onEdit(editConfig.sectionKey, editConfig.currentValue);
  }

  function handleSave() {
    if (!editConfig) return;
    editConfig.onSave(editConfig.sectionKey, draft);
  }

  function handleCancel() {
    if (!editConfig) return;
    editConfig.onCancel();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">

      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 shrink-0"
            aria-hidden="true"
          >
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
            {title}
          </h3>
        </div>

        {/* Botão Editar — exibido apenas quando não há edição ativa nesta seção */}
        {editConfig && !isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
            aria-label={`Editar seção ${title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
        )}
      </div>

      {/* Conteúdo: modo leitura ou edição */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            autoFocus
            className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none resize-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 leading-relaxed"
            aria-label={`Editar ${title}`}
          />
          <p className="text-xs text-slate-400">
            {editConfig?.currentValue.includes("\n")
              ? "Cada linha será salva como um item separado."
              : "Edite o texto acima conforme necessário."}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="w-3.5 h-3.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Salvar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="w-3.5 h-3.5" aria-hidden="true">
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

    </div>
  );
}
