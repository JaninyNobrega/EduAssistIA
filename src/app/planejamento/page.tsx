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
import {
  BNCC_FIELDS,
  getBnccGuidance,
  getBnccGroup,
  orderWithSuggestions,
} from "@/lib/bncc-data";

// ─── Dados estáticos ──────────────────────────────────────────────────────────

const TURMAS = ["Berçário", "Maternal I", "Maternal II", "Infantil I", "Infantil II"] as const;

const TURMA_FAIXA_ETARIA: Record<string, string> = {
  Berçário: "0 a 1 ano",
  "Maternal I": "1 a 2 anos",
  "Maternal II": "2 a 3 anos",
  "Infantil I": "3 a 4 anos",
  "Infantil II": "4 a 5 anos",
};

const TURNOS = ["Manhã", "Tarde", "Integral"] as const;

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

const DURACOES = ["20 minutos", "30 minutos", "40 minutos", "50 minutos"] as const;


const DIREITOS_APRENDIZAGEM = [
  "Conviver",
  "Brincar",
  "Participar",
  "Explorar",
  "Expressar",
  "Conhecer-se",
] as const;

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

const STEP_LABELS = ["Turma", "Atividade", "Proposta", "Adicionais", "Revisão"] as const;

const STEP_TITLES: Record<number, string> = {
  1: "Sobre a turma",
  2: "Sobre a atividade",
  3: "Proposta pedagógica",
  4: "Informações adicionais",
  5: "Revise seu planejamento",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FormErrors = {
  turma?: string;
  faixaEtaria?: string;
  tema?: string;
  campoExperiencia?: string;
  direitosAprendizagem?: string;
  objetivoAprendizagem?: string;
};

type FormState = Omit<PlanningFormData, "direitosAprendizagem" | "tipoAtividade"> & {
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

  if (!form.turma) errors.turma = "Selecione a turma.";
  if (!form.faixaEtaria) errors.faixaEtaria = "Selecione a faixa etária.";
  if (!form.tema.trim()) errors.tema = "Informe o tema da atividade.";
  if (!form.campoExperiencia) errors.campoExperiencia = "Selecione o campo de experiência.";
  if (form.direitosAprendizagem.length === 0) {
    errors.direitosAprendizagem = "Selecione pelo menos um direito de aprendizagem.";
  }
  if (!form.objetivoAprendizagem.trim()) {
    errors.objetivoAprendizagem = "Descreva o objetivo de aprendizagem.";
  }

  return errors;
}

function validateStep(step: number, form: FormState): FormErrors {
  const allErrors = validate(form);

  if (step === 1) {
    return {
      ...(allErrors.turma ? { turma: allErrors.turma } : {}),
      ...(allErrors.faixaEtaria ? { faixaEtaria: allErrors.faixaEtaria } : {}),
    };
  }

  if (step === 2) {
    return allErrors.tema ? { tema: allErrors.tema } : {};
  }

  if (step === 3) {
    return {
      ...(allErrors.campoExperiencia
        ? { campoExperiencia: allErrors.campoExperiencia }
        : {}),
      ...(allErrors.direitosAprendizagem
        ? { direitosAprendizagem: allErrors.direitosAprendizagem }
        : {}),
      ...(allErrors.objetivoAprendizagem
        ? { objetivoAprendizagem: allErrors.objetivoAprendizagem }
        : {}),
    };
  }

  return {};
}

function stepForError(key: keyof FormErrors): number {
  if (key === "turma" || key === "faixaEtaria") return 1;
  if (key === "tema") return 2;
  return 3;
}

function formatDateBR(value?: string): string {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
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
      className={`h-9 w-full rounded-xl border bg-white px-3 py-1 text-sm text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-all focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 ${
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

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100/80 dark:from-blue-950/70 dark:to-indigo-950/70 dark:text-blue-400 dark:ring-blue-900/70">
      {children}
    </div>
  );
}

function StepHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100/80 pb-4 dark:border-slate-800">
      <StepIcon>{icon}</StepIcon>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function WizardProgress({ currentStep }: { currentStep: number }) {
  const percentage = ((currentStep - 1) / 4) * 100;

  return (
    <div
      className="mb-6 rounded-2xl border border-blue-100/70 bg-white/85 px-4 py-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85"
      aria-label={`Etapa ${currentStep} de 5: ${STEP_TITLES[currentStep]}`}
    >
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            Etapa {currentStep} de 5
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {STEP_TITLES[currentStep]}
          </p>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 hidden grid-cols-5 gap-2 sm:grid">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const isCurrent = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  isComplete
                    ? "bg-blue-600 text-white"
                    : isCurrent
                      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                {isComplete ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step
                )}
              </div>

              <span
                className={`text-[11px] ${
                  isCurrent
                    ? "font-medium text-blue-700 dark:text-blue-300"
                    : isComplete
                      ? "text-slate-600 dark:text-slate-300"
                      : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WizardActions({
  currentStep,
  isLoading,
  onBack,
  onNext,
}: {
  currentStep: number;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
        </button>
      ) : (
        <span />
      )}

      <Button
        type="button"
        onClick={onNext}
        className="h-auto gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
      >
        Continuar
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
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Button>
    </div>
  );
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 py-4 last:border-b-0 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </button>
      </div>
      {children}
    </section>
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

  const [currentStep, setCurrentStep] = useState(1);
  const [showForm, setShowForm] = useState(true);

  const [isOutroTema, setIsOutroTema] = useState(false);
  const [temaCustom, setTemaCustom] = useState("");
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<string[]>([]);
  const [materiaisOutro, setMateriaisOutro] = useState("");

  // UX13: orientação contextual derivada da faixa etária e do campo selecionado.
  const bnccGroup = getBnccGroup(form.faixaEtaria);
  const bnccGuidance = getBnccGuidance(
    form.faixaEtaria,
    form.campoExperiencia,
  );

  const orderedActivities = orderWithSuggestions(
    TIPOS_ATIVIDADE,
    bnccGuidance?.suggestedActivities ?? [],
  );

  const orderedMaterials = orderWithSuggestions(
    MATERIAIS_OPCOES,
    bnccGuidance?.suggestedMaterials ?? [],
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "turma") {
        next.faixaEtaria = TURMA_FAIXA_ETARIA[value] ?? "";

        // A troca da turma altera o grupo etário de referência.
        // Mantemos dados gerais, mas limpamos escolhas pedagógicas dependentes.
        next.campoExperiencia = "";
        next.direitosAprendizagem = [];
        next.objetivoAprendizagem = "";
        next.tipoAtividade = [];
        next.materiaisDisponiveis = "";
      }

      if (name === "campoExperiencia") {
        // O professor continua livre para escolher, mas evitamos carregar
        // um objetivo associado a outro campo.
        next.objetivoAprendizagem = "";
      }

      return next;
    });

    if (name === "turma") {
      setMateriaisSelecionados([]);
      setMateriaisOutro("");
    }
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

  function handleMaterialToggle(material: string, checked: boolean) {
    setMateriaisSelecionados((prev) => {
      const next = checked
        ? [...prev, material]
        : prev.filter((m) => m !== material);

      const todos = materiaisOutro.trim()
        ? [...next, materiaisOutro.trim()]
        : next;

      setForm((current) => ({
        ...current,
        materiaisDisponiveis: todos.join(", "),
      }));

      return next;
    });
  }

  function handleMateriaisOutro(e: React.ChangeEvent<HTMLInputElement>) {
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

  function handleTemaSelect(tema: string) {
    if (tema === "__outro__") {
      setIsOutroTema(true);
      setForm((prev) => ({ ...prev, tema: temaCustom }));
      return;
    }

    setIsOutroTema(false);
    setTemaCustom("");
    setForm((prev) => ({ ...prev, tema }));
  }

  function handleTemaCustom(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTemaCustom(value);
    setForm((prev) => ({ ...prev, tema: value }));
  }

  function applySuggestedRights() {
    if (!bnccGuidance) return;

    setForm((prev) => ({
      ...prev,
      direitosAprendizagem: [...bnccGuidance.suggestedRights],
    }));
  }

  function selectSuggestedObjective(text: string) {
    setForm((prev) => ({
      ...prev,
      objetivoAprendizagem: text,
    }));
  }

  function applySuggestedActivities() {
    if (!bnccGuidance) return;

    setForm((prev) => ({
      ...prev,
      tipoAtividade: [...bnccGuidance.suggestedActivities],
    }));
  }

  function applySuggestedMaterials() {
    if (!bnccGuidance) return;

    const suggestions = [...bnccGuidance.suggestedMaterials];

    setMateriaisSelecionados(suggestions);
    setMateriaisOutro("");
    setForm((prev) => ({
      ...prev,
      materiaisDisponiveis: suggestions.join(", "),
    }));
  }

  function focusFirstError(stepErrors: FormErrors) {
    const firstField = Object.keys(stepErrors)[0];

    if (firstField) {
      window.setTimeout(() => {
        document.getElementById(firstField)?.focus();
      }, 0);
    }
  }

  function handleNext() {
    const stepErrors = validateStep(currentStep, form);

    setSubmitted(true);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      focusFirstError(stepErrors);
      return;
    }

    setSubmitted(false);
    setErrors({});
    setCurrentStep((step) => Math.min(step + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setSubmitted(false);
    setErrors({});
    setApiError(null);
    setCurrentStep((step) => Math.max(step - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditStep(step: number) {
    setSubmitted(false);
    setErrors({});
    setApiError(null);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditInformations() {
    setShowForm(true);
    setCurrentStep(1);
    setSubmitted(false);
    setErrors({});
    setApiError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (currentStep !== 5) {
      handleNext();
      return;
    }

    setSubmitted(true);

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0] as keyof FormErrors;
      const targetStep = stepForError(firstKey);

      setCurrentStep(targetStep);
      focusFirstError(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const response = await fetch("/api/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setApiError("Não foi possível gerar o planejamento. Tente novamente.");
        return;
      }

      const data: PlanningResult = await response.json();

      setResult(data);
      setShowForm(false);
      setSubmitted(false);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setApiError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/30 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
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

          <span className="text-slate-200 dark:text-slate-700" aria-hidden="true">
            |
          </span>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-600/20">
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
            <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
              EduAssist IA
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        {showForm ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[1.75rem]">
                Novo Planejamento
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Vamos organizar sua proposta em etapas simples. Seus dados permanecem salvos enquanto você avança ou volta.
              </p>
            </div>

            <WizardProgress currentStep={currentStep} />

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {currentStep === 1 && (
                <section className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
                  <StepHeader
                    title="Sobre a turma"
                    description="Comece pelas informações básicas da turma e da data da atividade."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="turma">
                        Turma <span className="text-red-500" aria-label="obrigatório">*</span>
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
                      <FieldError message={submitted ? errors.turma : undefined} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="faixaEtaria">Faixa etária</Label>
                      <div
                        id="faixaEtaria"
                        aria-label="Faixa etária inferida automaticamente"
                        className="flex h-9 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                      >
                        {form.faixaEtaria || (
                          <span className="italic text-slate-400 dark:text-slate-500">
                            Definida conforme a turma
                          </span>
                        )}
                      </div>
                      {form.faixaEtaria && (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Definida automaticamente conforme a turma.
                          </p>
                          {bnccGroup && (
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              Referência BNCC: {bnccGroup.label}
                            </p>
                          )}
                        </div>
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
                      <Label htmlFor="dataPeriodo">Data</Label>
                      <div className="group flex h-9 w-full items-center gap-2 rounded-xl border border-input bg-white px-3 shadow-sm transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-slate-900">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-600" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <input
                          type="date"
                          id="dataPeriodo"
                          name="dataPeriodo"
                          value={form.dataPeriodo}
                          onChange={handleChange}
                          className="block min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground outline-none dark:[color-scheme:dark]"
                        />
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Opcional. Selecione a data prevista para a atividade.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
                  <StepHeader
                    title="Sobre a atividade"
                    description="Escolha o tema e a duração. As sugestões pedagógicas serão refinadas na próxima etapa."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    }
                  />

                  <div className="flex flex-col gap-1.5">
                    <Label>
                      Tema <span className="text-red-500" aria-label="obrigatório">*</span>
                    </Label>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Escolha uma sugestão ou informe um tema personalizado.
                    </p>

                    <div className="flex flex-wrap gap-2" role="group" aria-label="Sugestões de tema">
                      {TEMAS_SUGERIDOS.map((tema) => (
                        <button
                          key={tema}
                          type="button"
                          onClick={() => handleTemaSelect(tema)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                            !isOutroTema && form.tema === tema
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40"
                          }`}
                        >
                          {tema}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleTemaSelect("__outro__")}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                          isOutroTema
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40"
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
                        className={`mt-1 h-9 rounded-xl shadow-sm dark:bg-slate-900 dark:text-slate-200${submitted && errors.tema ? " border-red-400" : ""}`}
                        autoComplete="off"
                        aria-label="Descreva o tema"
                      />
                    )}

                    <FieldError message={submitted ? errors.tema : undefined} />
                  </div>

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
              )}

              {currentStep === 3 && (
                <section className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
                  <StepHeader
                    title="Proposta pedagógica"
                    description="Selecione o campo de experiência e receba sugestões coerentes com o grupo etário de referência."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    }
                  />

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campoExperiencia">
                      Campo de experiência <span className="text-red-500" aria-label="obrigatório">*</span>
                    </Label>
                    <SelectField
                      id="campoExperiencia"
                      name="campoExperiencia"
                      value={form.campoExperiencia}
                      onChange={handleChange}
                      placeholder="Selecione o campo de experiência"
                      options={BNCC_FIELDS}
                      invalid={submitted && !!errors.campoExperiencia}
                    />
                    <FieldError message={submitted ? errors.campoExperiencia : undefined} />

                    {bnccGuidance && (
                      <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 dark:border-blue-900/60 dark:bg-blue-950/30">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Orientação BNCC ativa
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          As sugestões abaixo consideram {bnccGuidance.groupLabel} e o campo selecionado. Você pode aceitar, combinar ou modificar qualquer sugestão.
                        </p>
                      </div>
                    )}
                  </div>

                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Direitos de aprendizagem{" "}
                      <span className="text-red-500" aria-label="obrigatório">*</span>
                      <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                        — selecione pelo menos um
                      </span>
                    </legend>

                    {bnccGuidance && (
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-2 dark:bg-slate-800/60">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Sugestões do EduAssist: {bnccGuidance.suggestedRights.join(" · ")}
                        </p>
                        <button
                          type="button"
                          onClick={applySuggestedRights}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Usar sugestões
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {DIREITOS_APRENDIZAGEM.map((direito) => (
                        <label
                          key={direito}
                          htmlFor={`direito-${direito}`}
                          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2.5 transition-all hover:border-blue-200 hover:bg-blue-50/70 has-[:checked]:border-blue-300 has-[:checked]:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:has-[:checked]:border-blue-700 dark:has-[:checked]:bg-blue-950/50"
                        >
                          <Checkbox
                            id={`direito-${direito}`}
                            checked={form.direitosAprendizagem.includes(direito)}
                            onCheckedChange={(checked) =>
                              handleCheckboxList("direitosAprendizagem", direito, checked === true)
                            }
                          />
                          <span className="select-none text-sm text-slate-700 dark:text-slate-300">
                            {direito}
                          </span>
                        </label>
                      ))}
                    </div>

                    <FieldError message={submitted ? errors.direitosAprendizagem : undefined} />
                  </fieldset>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="objetivoAprendizagem">
                      Objetivo de aprendizagem <span className="text-red-500" aria-label="obrigatório">*</span>
                    </Label>
                    {bnccGuidance && bnccGuidance.objectives.length > 0 && (
                      <div className="mb-2 space-y-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Sugestões de objetivos de aprendizagem e desenvolvimento da BNCC:
                        </p>
                        {bnccGuidance.objectives.map((objective) => (
                          <button
                            key={objective.code}
                            type="button"
                            onClick={() => selectSuggestedObjective(objective.text)}
                            className={`w-full rounded-xl border p-3 text-left transition-all ${
                              form.objetivoAprendizagem === objective.text
                                ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200 dark:border-blue-700 dark:bg-blue-950/40 dark:ring-blue-900"
                                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                            }`}
                          >
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                              {objective.code}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                              {objective.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <Textarea
                      id="objetivoAprendizagem"
                      name="objetivoAprendizagem"
                      value={form.objetivoAprendizagem}
                      onChange={handleChange}
                      placeholder="Ex: Desenvolver oralidade, coordenação motora, percepção de cores..."
                      rows={3}
                      className={`resize-none rounded-xl shadow-sm dark:bg-slate-900 dark:text-slate-200${
                        submitted && errors.objetivoAprendizagem
                          ? " border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                          : ""
                      }`}
                      aria-invalid={submitted && !!errors.objetivoAprendizagem}
                    />
                    <FieldError message={submitted ? errors.objetivoAprendizagem : undefined} />
                  </div>

                  <fieldset>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Tipo de atividade
                        <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                          — pode selecionar mais de um
                        </span>
                      </legend>

                      {bnccGuidance && (
                        <button
                          type="button"
                          onClick={applySuggestedActivities}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Usar sugestões
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {orderedActivities.map((tipo) => {
                        const isSuggested =
                          bnccGuidance?.suggestedActivities.includes(tipo) ?? false;

                        return (
                          <label
                            key={tipo}
                            htmlFor={`tipo-${tipo}`}
                            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2.5 transition-all hover:border-blue-200 hover:bg-blue-50/70 has-[:checked]:border-blue-300 has-[:checked]:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:has-[:checked]:border-blue-700 dark:has-[:checked]:bg-blue-950/50"
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
                            <span className="min-w-0 flex-1 select-none text-sm text-slate-700 dark:text-slate-300">
                              {tipo}
                            </span>
                            {isSuggested && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                Sugerido
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </section>
              )}

              {currentStep === 4 && (
                <section className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
                  <StepHeader
                    title="Informações adicionais"
                    description="Complete apenas o que fizer sentido para a sua realidade."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    }
                  />

                  <div className="flex flex-col gap-2">
                    <Label>Materiais disponíveis</Label>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Selecione os materiais que estarão disponíveis para a atividade.
                      </p>
                      {bnccGuidance && (
                        <button
                          type="button"
                          onClick={applySuggestedMaterials}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Usar sugestões
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2" role="group" aria-label="Materiais disponíveis">
                      {orderedMaterials.map((material) => (
                        <button
                          key={material}
                          type="button"
                          onClick={() =>
                            handleMaterialToggle(
                              material,
                              !materiaisSelecionados.includes(material),
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                            materiaisSelecionados.includes(material)
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40"
                          }`}
                        >
                          <span>{material}</span>
                          {bnccGuidance?.suggestedMaterials.includes(material) && (
                            <span className="ml-1 text-[10px] opacity-75">• sugerido</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 rounded-xl border border-dashed border-slate-200/90 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Outro material
                        </span>
                      </div>

                      <Input
                        id="materiaisOutro"
                        value={materiaisOutro}
                        onChange={handleMateriaisOutro}
                        placeholder="Ex: tecido, argila, caixa de papelão..."
                        className="h-9 rounded-lg border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        autoComplete="off"
                        aria-label="Outros materiais"
                      />
                    </div>
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
                      className="resize-none rounded-xl shadow-sm dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                </section>
              )}

              {currentStep === 5 && (
                <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.045)] dark:border-slate-800 dark:bg-slate-900/95">
                  <div className="p-5 pb-2 sm:p-6 sm:pb-2">
                    <StepHeader
                      title="Revise seu planejamento"
                      description="Confira as escolhas antes de gerar. Você pode voltar e editar qualquer etapa."
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      }
                    />
                  </div>

                  <div className="px-5 pb-2 sm:px-6">
                    <ReviewSection title="Turma" step={1} onEdit={handleEditStep}>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {form.turma}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {[
                          form.faixaEtaria,
                          form.turno,
                          form.dataPeriodo ? formatDateBR(form.dataPeriodo) : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </ReviewSection>

                    <ReviewSection title="Atividade" step={2} onEdit={handleEditStep}>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {form.tema}
                      </p>

                      {form.tipoAtividade.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {form.tipoAtividade.map((tipo) => (
                            <span
                              key={tipo}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tipo}
                            </span>
                          ))}
                        </div>
                      )}

                      {form.duracao && (
                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                          Duração: {form.duracao}
                        </p>
                      )}
                    </ReviewSection>

                    <ReviewSection title="Proposta pedagógica" step={3} onEdit={handleEditStep}>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {form.campoExperiencia}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {form.direitosAprendizagem.map((direito) => (
                          <span
                            key={direito}
                            className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          >
                            {direito}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/60">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                          Objetivo
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {form.objetivoAprendizagem}
                        </p>
                      </div>
                    </ReviewSection>

                    <ReviewSection title="Informações adicionais" step={4} onEdit={handleEditStep}>
                      {form.materiaisDisponiveis ? (
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            Materiais:{" "}
                          </span>
                          {form.materiaisDisponiveis}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          Nenhum material específico informado.
                        </p>
                      )}

                      {form.observacoes && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            Observações:{" "}
                          </span>
                          {form.observacoes}
                        </p>
                      )}
                    </ReviewSection>
                  </div>

                  <div className="flex flex-col items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/30 sm:px-6">
                    {apiError && (
                      <p role="alert" className="text-center text-sm text-red-500">
                        {apiError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-auto w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(37,99,235,0.24)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Gerando...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          Gerar planejamento
                        </>
                      )}
                    </Button>

                    <p className="max-w-sm text-center text-xs text-slate-400 dark:text-slate-500">
                      O resultado será uma sugestão que poderá ser revisada e editada antes do uso.
                    </p>
                  </div>
                </section>
              )}

              {currentStep < 5 && (
                <WizardActions
                  currentStep={currentStep}
                  isLoading={isLoading}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}

              {currentStep === 5 && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Voltar
                  </button>
                </div>
              )}
            </form>
          </>
        ) : (
          result && (
            <>
              <div className="mb-6 rounded-2xl border border-blue-100/70 bg-white/90 px-5 py-3.5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900/90">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                      Planejamento gerado
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {result.turma} · {result.faixaEtaria} · {result.tema}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleEditInformations}
                    className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:self-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar informações
                  </button>
                </div>
              </div>

              <PlanningResultComponent result={result} />
            </>
          )
        )}
      </main>
    </div>
  );
}