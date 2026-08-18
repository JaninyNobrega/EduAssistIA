"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { PlanningFormData, PlanningResult } from "@/lib/types";
import { PlanningResult as PlanningResultComponent } from "@/components/planning/PlanningResult";

// ─── Dados estáticos ──────────────────────────────────────────────────────────

const TURMAS = [
  "Berçário",
  "Maternal I",
  "Maternal II",
  "Infantil I",
  "Infantil II",
] as const;

const FAIXAS_ETARIAS = [
  "0 a 1 ano",
  "1 a 2 anos",
  "2 a 3 anos",
  "3 a 4 anos",
  "4 a 5 anos",
] as const;

/**
 * UX-R03: mapeamento automático turma → faixa etária conforme BNCC.
 * Elimina preenchimento redundante e evita combinações incoerentes.
 */
const TURMA_FAIXA_ETARIA: Record<string, string> = {
  Berçário: "0 a 1 ano",
  "Maternal I": "1 a 2 anos",
  "Maternal II": "2 a 3 anos",
  "Infantil I": "3 a 4 anos",
  "Infantil II": "4 a 5 anos",
};

const TURNOS = ["Manhã", "Tarde", "Integral"] as const;

/** UX-R04: lista atualizada de tipos de atividade para Educação Infantil */
const TIPOS_ATIVIDADE = [
  "Contação de história",
  "Musicalização",
  "Pintura",
  "Colagem",
  "Desenho",
  "Movimento corporal",
  "Exploração sensorial",
  "Brincadeira orientada",
  "Roda de conversa",
  "Dramatização",
  "Atividade com materiais concretos",
] as const;

const DURACOES = [
  "20 minutos",
  "30 minutos",
  "40 minutos",
  "50 minutos",
] as const;

const CAMPOS_EXPERIENCIA = [
  "O eu, o outro e o nós",
  "Corpo, gestos e movimentos",
  "Traços, sons, cores e formas",
  "Escuta, fala, pensamento e imaginação",
  "Espaços, tempos, quantidades, relações e transformações",
] as const;

const DIREITOS_APRENDIZAGEM = [
  "Conviver",
  "Brincar",
  "Participar",
  "Explorar",
  "Expressar",
  "Conhecer-se",
] as const;

/** UX-R04: sugestões de tema para Educação Infantil */
const TEMAS_SUGERIDOS = [
  "Animais",
  "Cores",
  "Formas",
  "Família",
  "Natureza",
  "Corpo e movimentos",
  "Alimentação",
  "Música e sons",
  "Água",
  "Meio ambiente",
  "Folclore",
  "Identidade e emoções",
] as const;

/** UX-R04: materiais selecionáveis para Educação Infantil */
const MATERIAIS_OPCOES = [
  "Papel",
  "Cartolina",
  "Tinta guache",
  "Pincel",
  "Giz de cera",
  "Lápis de cor",
  "Cola",
  "EVA",
  "Massinha",
  "Livros",
  "Figuras",
  "Brinquedos",
  "Instrumentos musicais",
  "Materiais recicláveis",
  "Elementos da natureza",
] as const;

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FormErrors = {
  turma?: string;
  faixaEtaria?: string;
  tema?: string;
  campoExperiencia?: string;
  direitosAprendizagem?: string;
  objetivoAprendizagem?: string;
};

type FormState = Omit<
  PlanningFormData,
  "direitosAprendizagem" | "tipoAtividade"
> & {
  direitosAprendizagem: string[];
  tipoAtividade: string[];
};

const initialState: FormState = {
  turma: "",
  faixaEtaria: "",
  turno: "",
  dataPeriodo: "",
  tema: "",
  tipoAtividade: [],
  duracao: "",
  campoExperiencia: "",
  direitosAprendizagem: [],
  objetivoAprendizagem: "",
  materiaisDisponiveis: "",
  observacoes: "",
};

// ─── Validação ────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.turma) {
    errors.turma = "Selecione a turma.";
  }

  if (!form.faixaEtaria) {
    errors.faixaEtaria = "Selecione a faixa etária.";
  }

  if (!form.tema.trim()) {
    errors.tema = "Informe o tema da atividade.";
  }

  if (!form.campoExperiencia) {
    errors.campoExperiencia = "Selecione o campo de experiência.";
  }

  if (form.direitosAprendizagem.length === 0) {
    errors.direitosAprendizagem =
      "Selecione pelo menos um direito de aprendizagem.";
  }

  if (!form.objetivoAprendizagem.trim()) {
    errors.objetivoAprendizagem =
      "Descreva o objetivo de aprendizagem.";
  }

  return errors;
}

// ─── Componentes auxiliares ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p role="alert" className="mt-0.5 text-xs text-red-500">
      {message}
    </p>
  );
}

function SelectField({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  invalid = false,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: readonly string[];
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      aria-invalid={invalid}
      className={`h-9 w-full rounded-xl border bg-white px-3 py-1 text-sm text-foreground shadow-sm transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        invalid
          ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
          : "border-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
      }`}
    >
      <option value="">{placeholder}</option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function SectionTitle({
  id,
  icon,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2
        id={id}
        className="text-sm font-semibold uppercase tracking-wide text-slate-800"
      >
        {children}
      </h2>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PlanejamentoPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // UX-R01: formulário oculto após geração
  const [showForm, setShowForm] = useState(true);

  // UX-R04: estados locais para tema personalizado e materiais selecionáveis
  const [isOutroTema, setIsOutroTema] = useState(false);
  const [temaCustom, setTemaCustom] = useState("");
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<string[]>(
    [],
  );
  const [materiaisOutro, setMateriaisOutro] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      // UX-R03: inferência automática da faixa etária ao selecionar a turma
      if (name === "turma") {
        next.faixaEtaria = TURMA_FAIXA_ETARIA[value] ?? "";
      }

      return next;
    });
  }

  function handleCheckboxList(
    field: "direitosAprendizagem" | "tipoAtividade",
    value: string,
    checked: boolean,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }));
  }

  /** UX-R04: toggle de material selecionável */
  function handleMaterialToggle(material: string, checked: boolean) {
    setMateriaisSelecionados((prev) => {
      const next = checked
        ? [...prev, material]
        : prev.filter((m) => m !== material);

      const todos = materiaisOutro.trim()
        ? [...next, materiaisOutro.trim()]
        : next;

      setForm((f) => ({
        ...f,
        materiaisDisponiveis: todos.join(", "),
      }));

      return next;
    });
  }

  /** UX-R04: campo "Outros materiais" */
  function handleMateriaisOutro(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;

    setMateriaisOutro(value);

    const todos = value.trim()
      ? [...materiaisSelecionados, value.trim()]
      : materiaisSelecionados;

    setForm((prev) => ({
      ...prev,
      materiaisDisponiveis: todos.join(", "),
    }));
  }

  /** UX-R04: selecionar tema sugerido ou alternar para outro tema */
  function handleTemaSelect(tema: string) {
    if (tema === "__outro__") {
      setIsOutroTema(true);

      setForm((prev) => ({
        ...prev,
        tema: temaCustom,
      }));
    } else {
      setIsOutroTema(false);
      setTemaCustom("");

      setForm((prev) => ({
        ...prev,
        tema,
      }));
    }
  }

  /** UX-R04: campo livre de "Outro tema" */
  function handleTemaCustom(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = e.target.value;

    setTemaCustom(value);

    setForm((prev) => ({
      ...prev,
      tema: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitted(true);

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      document
        .getElementById(Object.keys(validationErrors)[0])
        ?.focus();

      return;
    }

    setIsLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const response = await fetch("/api/planning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setApiError(
          "Não foi possível gerar o planejamento. Tente novamente.",
        );
        return;
      }

      const data: PlanningResult = await response.json();

      setResult(data);
      setShowForm(false);
    } catch {
      setApiError(
        "Erro de conexão. Verifique sua internet e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
            aria-label="Voltar para a página inicial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>

            Voltar
          </Link>

          <span className="text-slate-200" aria-hidden="true">
            |
          </span>

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
                aria-hidden="true"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            <span className="text-sm font-semibold text-slate-700">
              EduAssist IA
            </span>
          </div>
        </div>
      </header>

      {/* UX08: menos espaço vertical geral */}
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Título — só visível quando o formulário está aberto */}
        {showForm && (
          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Novo Planejamento
            </h1>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Preencha os dados da proposta. Campos com{" "}
              <span
                className="font-semibold text-red-500"
                aria-label="obrigatório"
              >
                *
              </span>{" "}
              são obrigatórios.
            </p>
          </div>
        )}

        {/* UX-R01: resumo compacto quando o resultado está visível */}
        {!showForm && result && (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">
                {result.turma} · {result.faixaEtaria} · {result.tema}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Dados do planejamento
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="ml-4 flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>

              Editar informações
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* UX-R01: formulário oculto quando resultado existe */}
          {showForm && (
            <>
              {/* ───────────────────────────────────────────────────────────── */}
              {/* Seção 1 — Sobre a Turma */}
              {/* ───────────────────────────────────────────────────────────── */}

              <section
                aria-labelledby="secao-turma"
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <SectionTitle
                  id="secao-turma"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                >
                  Sobre a Turma
                </SectionTitle>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="turma">
                      Turma{" "}
                      <span
                        className="text-red-500"
                        aria-label="obrigatório"
                      >
                        *
                      </span>
                    </Label>

                    <SelectField
                      id="turma"
                      name="turma"
                      value={form.turma}
                      onChange={handleChange}
                      placeholder="Selecione a turma"
                      options={TURMAS}
                      invalid={submitted && !!errors.turma}
                    />

                    <FieldError
                      message={submitted ? errors.turma : undefined}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="faixaEtaria">Faixa Etária</Label>

                    <div
                      id="faixaEtaria"
                      aria-label="Faixa etária inferida automaticamente"
                      className="flex h-9 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                    >
                      {form.faixaEtaria || (
                        <span className="italic text-slate-400">
                          Definida conforme a turma
                        </span>
                      )}
                    </div>

                    {form.faixaEtaria && (
                      <p className="text-xs text-slate-400">
                        Definida automaticamente conforme a turma.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="turno">Turno</Label>

                    <SelectField
                      id="turno"
                      name="turno"
                      value={form.turno || ""}
                      onChange={handleChange}
                      placeholder="Selecione o turno"
                      options={TURNOS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dataPeriodo">Data / Período</Label>

                    <input
                      type="date"
                      id="dataPeriodo"
                      name="dataPeriodo"
                      value={form.dataPeriodo}
                      onChange={handleChange}
                      className="h-9 w-full rounded-xl border border-input bg-white px-3 py-1 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    />
                  </div>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* Seção 2 — Sobre a Atividade */}
              {/* ───────────────────────────────────────────────────────────── */}

              <section
                aria-labelledby="secao-atividade"
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <SectionTitle
                  id="secao-atividade"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  }
                >
                  Sobre a Atividade
                </SectionTitle>

                <div className="flex flex-col gap-1.5">
                  <Label>
                    Tema{" "}
                    <span
                      className="text-red-500"
                      aria-label="obrigatório"
                    >
                      *
                    </span>
                  </Label>

                  <div
                    className="flex flex-wrap gap-1.5"
                    role="group"
                    aria-label="Sugestões de tema"
                  >
                    {TEMAS_SUGERIDOS.map((tema) => (
                      <button
                        key={tema}
                        type="button"
                        onClick={() => handleTemaSelect(tema)}
                        className={`rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                          !isOutroTema && form.tema === tema
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {tema}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleTemaSelect("__outro__")}
                      className={`rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                        isOutroTema
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      Outro tema
                    </button>
                  </div>

                  {isOutroTema && (
                    <Input
                      id="tema"
                      name="tema"
                      value={temaCustom}
                      onChange={handleTemaCustom}
                      placeholder="Descreva o tema..."
                      className={`mt-1 h-9 rounded-xl shadow-sm${
                        submitted && errors.tema
                          ? " border-red-400"
                          : ""
                      }`}
                      autoComplete="off"
                      aria-label="Descreva o tema"
                    />
                  )}

                  <FieldError
                    message={submitted ? errors.tema : undefined}
                  />
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    Tipo de Atividade
                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                      — pode selecionar mais de um
                    </span>
                  </legend>

                  {/* UX08: 2 colunas mobile / 3 desktop */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TIPOS_ATIVIDADE.map((tipo) => (
                      <label
                        key={tipo}
                        htmlFor={`tipo-${tipo}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-2 transition-colors hover:border-blue-200 hover:bg-blue-50 has-[:checked]:border-blue-300 has-[:checked]:bg-blue-50"
                      >
                        <Checkbox
                          id={`tipo-${tipo}`}
                          checked={form.tipoAtividade.includes(tipo)}
                          onCheckedChange={(checked) =>
                            handleCheckboxList(
                              "tipoAtividade",
                              tipo,
                              checked === true,
                            )
                          }
                        />

                        <span className="text-sm text-slate-700 select-none">
                          {tipo}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-1.5 sm:max-w-xs">
                  <Label htmlFor="duracao">Duração</Label>

                  <SelectField
                    id="duracao"
                    name="duracao"
                    value={form.duracao || ""}
                    onChange={handleChange}
                    placeholder="Selecione a duração"
                    options={DURACOES}
                  />
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* Seção 3 — Proposta Pedagógica */}
              {/* ───────────────────────────────────────────────────────────── */}

              <section
                aria-labelledby="secao-proposta"
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <SectionTitle
                  id="secao-proposta"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  }
                >
                  Proposta Pedagógica
                </SectionTitle>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="campoExperiencia">
                    Campo de Experiência{" "}
                    <span
                      className="text-red-500"
                      aria-label="obrigatório"
                    >
                      *
                    </span>
                  </Label>

                  <SelectField
                    id="campoExperiencia"
                    name="campoExperiencia"
                    value={form.campoExperiencia}
                    onChange={handleChange}
                    placeholder="Selecione o campo de experiência"
                    options={CAMPOS_EXPERIENCIA}
                    invalid={
                      submitted && !!errors.campoExperiencia
                    }
                  />

                  <FieldError
                    message={
                      submitted
                        ? errors.campoExperiencia
                        : undefined
                    }
                  />
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    Direitos de Aprendizagem{" "}
                    <span
                      className="text-red-500"
                      aria-label="obrigatório"
                    >
                      *
                    </span>

                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                      — selecione pelo menos um
                    </span>
                  </legend>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DIREITOS_APRENDIZAGEM.map((direito) => (
                      <label
                        key={direito}
                        htmlFor={`direito-${direito}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 transition-colors hover:border-blue-200 hover:bg-blue-50 has-[:checked]:border-blue-300 has-[:checked]:bg-blue-50"
                      >
                        <Checkbox
                          id={`direito-${direito}`}
                          checked={form.direitosAprendizagem.includes(
                            direito,
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxList(
                              "direitosAprendizagem",
                              direito,
                              checked === true,
                            )
                          }
                        />

                        <span className="text-sm text-slate-700 select-none">
                          {direito}
                        </span>
                      </label>
                    ))}
                  </div>

                  <FieldError
                    message={
                      submitted
                        ? errors.direitosAprendizagem
                        : undefined
                    }
                  />
                </fieldset>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="objetivoAprendizagem">
                    Objetivo de Aprendizagem{" "}
                    <span
                      className="text-red-500"
                      aria-label="obrigatório"
                    >
                      *
                    </span>
                  </Label>

                  <Textarea
                    id="objetivoAprendizagem"
                    name="objetivoAprendizagem"
                    value={form.objetivoAprendizagem}
                    onChange={handleChange}
                    placeholder="Ex: Desenvolver oralidade, coordenação motora, percepção de cores..."
                    rows={3}
                    className={`resize-none rounded-xl shadow-sm${
                      submitted && errors.objetivoAprendizagem
                        ? " border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                        : ""
                    }`}
                    aria-invalid={
                      submitted && !!errors.objetivoAprendizagem
                    }
                  />

                  <FieldError
                    message={
                      submitted
                        ? errors.objetivoAprendizagem
                        : undefined
                    }
                  />
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* Seção 4 — Informações Adicionais */}
              {/* ───────────────────────────────────────────────────────────── */}

              <section
                aria-labelledby="secao-adicionais"
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <SectionTitle
                  id="secao-adicionais"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  }
                >
                  Informações Adicionais
                </SectionTitle>

                <div className="flex flex-col gap-2">
                  <Label>Materiais Disponíveis</Label>

                  <div
                    className="flex flex-wrap gap-1.5"
                    role="group"
                    aria-label="Materiais disponíveis"
                  >
                    {MATERIAIS_OPCOES.map((material) => (
                      <button
                        key={material}
                        type="button"
                        onClick={() =>
                          handleMaterialToggle(
                            material,
                            !materiaisSelecionados.includes(material),
                          )
                        }
                        className={`rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                          materiaisSelecionados.includes(material)
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>

                  <Input
                    id="materiaisOutro"
                    value={materiaisOutro}
                    onChange={handleMateriaisOutro}
                    placeholder="Outros materiais (opcional)..."
                    className="h-9 rounded-xl shadow-sm"
                    autoComplete="off"
                    aria-label="Outros materiais"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="observacoes">Observações</Label>

                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleChange}
                    placeholder="Necessidades especiais, contexto da turma, recursos do ambiente..."
                    rows={3}
                    className="resize-none rounded-xl shadow-sm"
                  />
                </div>
              </section>

              {/* Botão de envio */}
              <div className="flex flex-col items-center gap-2 pb-2 pt-1">
                {apiError && (
                  <p
                    role="alert"
                    className="text-center text-sm text-red-500"
                  >
                    {apiError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-auto w-full gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>

                      Gerando...
                    </>
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
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>

                      Gerar Planejamento
                    </>
                  )}
                </Button>

                <p className="max-w-sm text-center text-xs text-slate-400">
                  O resultado gerado é uma sugestão. Você poderá revisar e
                  editar antes de usar.
                </p>
              </div>
            </>
          )}

          {/* Resultado — visível independente de showForm */}
          {result && <PlanningResultComponent result={result} />}
        </form>
      </main>
    </div>
  );
}