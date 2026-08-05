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

const TURMAS = ["Berçário", "Maternal I", "Maternal II", "Infantil I", "Infantil II"] as const;
const FAIXAS_ETARIAS = ["0 a 1 ano", "1 a 2 anos", "2 a 3 anos", "3 a 4 anos", "4 a 5 anos"] as const;
const TURNOS = ["Manhã", "Tarde", "Integral"] as const;
const TIPOS_ATIVIDADE = [
  "Contação de história", "Música", "Pintura", "Colagem",
  "Movimento corporal", "Exploração sensorial", "Brincadeira orientada",
  "Atividade com materiais concretos", "Roda de conversa",
] as const;
const DURACOES = ["20 minutos", "30 minutos", "40 minutos", "50 minutos"] as const;
const CAMPOS_EXPERIENCIA = [
  "O eu, o outro e o nós", "Corpo, gestos e movimentos", "Traços, sons, cores e formas",
  "Escuta, fala, pensamento e imaginação",
  "Espaços, tempos, quantidades, relações e transformações",
] as const;
const DIREITOS_APRENDIZAGEM = ["Conviver", "Brincar", "Participar", "Explorar", "Expressar", "Conhecer-se"] as const;

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FormErrors = {
  turma?: string; faixaEtaria?: string; tema?: string;
  campoExperiencia?: string; direitosAprendizagem?: string; objetivoAprendizagem?: string;
};

type FormState = Omit<PlanningFormData, "direitosAprendizagem" | "tipoAtividade"> & {
  direitosAprendizagem: string[]; tipoAtividade: string[];
};

const initialState: FormState = {
  turma: "", faixaEtaria: "", turno: "", dataPeriodo: "", tema: "",
  tipoAtividade: [], duracao: "", campoExperiencia: "",
  direitosAprendizagem: [], objetivoAprendizagem: "",
  materiaisDisponiveis: "", observacoes: "",
};

// ─── Validação ────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.turma) errors.turma = "Selecione a turma.";
  if (!form.faixaEtaria) errors.faixaEtaria = "Selecione a faixa etária.";
  if (!form.tema.trim()) errors.tema = "Informe o tema da atividade.";
  if (!form.campoExperiencia) errors.campoExperiencia = "Selecione o campo de experiência.";
  if (form.direitosAprendizagem.length === 0) errors.direitosAprendizagem = "Selecione pelo menos um direito de aprendizagem.";
  if (!form.objetivoAprendizagem.trim()) errors.objetivoAprendizagem = "Descreva o objetivo de aprendizagem.";
  return errors;
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="text-xs text-red-500 mt-0.5">{message}</p>;
}

function SelectField({ id, name, value, onChange, placeholder, options, invalid = false }: {
  id: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string; options: readonly string[]; invalid?: boolean;
}) {
  return (
    <select id={id} name={name} value={value} onChange={onChange} aria-invalid={invalid}
      className={`h-9 w-full rounded-xl border bg-white px-3 py-1 text-sm text-foreground shadow-sm transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        invalid ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                : "border-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
      }`}>
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

function SectionTitle({ id, icon, children }: { id: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 shrink-0">{icon}</div>
      <h2 id={id} className="text-sm font-semibold text-slate-800 tracking-wide uppercase">{children}</h2>
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxList(field: "direitosAprendizagem" | "tipoAtividade", value: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((v) => v !== value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
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
      if (!response.ok) { setApiError("Não foi possível gerar o planejamento. Tente novamente."); return; }
      const data: PlanningResult = await response.json();
      setResult(data);
      setShowForm(false); // UX-R01: oculta o formulário
    } catch {
      setApiError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors" aria-label="Voltar para a página inicial">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Voltar
          </Link>
          <span className="text-slate-200" aria-hidden="true">|</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">EduAssist IA</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Título — só visível quando o formulário está aberto */}
        {showForm && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Novo Planejamento</h1>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Preencha os dados da proposta. Campos com{" "}
              <span className="text-red-500 font-semibold" aria-label="obrigatório">*</span>{" "}são obrigatórios.
            </p>
          </div>
        )}

        {/* UX-R01: resumo compacto + botão "Editar informações" quando resultado visível */}
        {!showForm && result && (
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm mb-6">
            <div>
              <p className="text-sm font-medium text-slate-700">{result.turma} · {result.faixaEtaria} · {result.tema}</p>
              <p className="text-xs text-slate-400 mt-0.5">Dados do planejamento</p>
            </div>
            <button type="button" onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              Editar informações
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* UX-R01: formulário oculto quando resultado existe e showForm=false */}
          {showForm && (
            <>
              {/* Seção 1 — Sobre a Turma */}
              <section aria-labelledby="secao-turma" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                <SectionTitle id="secao-turma" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}>Sobre a Turma</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="turma">Turma <span className="text-red-500" aria-label="obrigatório">*</span></Label>
                    <SelectField id="turma" name="turma" value={form.turma} onChange={handleChange} placeholder="Selecione a turma" options={TURMAS} invalid={submitted && !!errors.turma} />
                    <FieldError message={submitted ? errors.turma : undefined} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="faixaEtaria">Faixa Etária <span className="text-red-500" aria-label="obrigatório">*</span></Label>
                    <SelectField id="faixaEtaria" name="faixaEtaria" value={form.faixaEtaria} onChange={handleChange} placeholder="Selecione a faixa etária" options={FAIXAS_ETARIAS} invalid={submitted && !!errors.faixaEtaria} />
                    <FieldError message={submitted ? errors.faixaEtaria : undefined} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="turno">Turno</Label>
                    <SelectField id="turno" name="turno" value={form.turno || ""} onChange={handleChange} placeholder="Selecione o turno" options={TURNOS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dataPeriodo">Data / Período</Label>
                    <Input id="dataPeriodo" name="dataPeriodo" value={form.dataPeriodo} onChange={handleChange} placeholder="Ex: Semana 1 – Junho" className="h-9 rounded-xl shadow-sm" autoComplete="off" />
                  </div>
                </div>
              </section>

              {/* Seção 2 — Sobre a Atividade */}
              <section aria-labelledby="secao-atividade" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                <SectionTitle id="secao-atividade" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}>Sobre a Atividade</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tema">Tema <span className="text-red-500" aria-label="obrigatório">*</span></Label>
                  <Input id="tema" name="tema" value={form.tema} onChange={handleChange} placeholder="Ex: Cores, animais, família, natureza, formas, música..." className={`h-9 rounded-xl shadow-sm${submitted && errors.tema ? " border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20" : ""}`} autoComplete="off" aria-invalid={submitted && !!errors.tema} />
                  <FieldError message={submitted ? errors.tema : undefined} />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-slate-700 mb-3">Tipo de Atividade<span className="ml-1.5 text-xs font-normal text-slate-400">— pode selecionar mais de um</span></legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIPOS_ATIVIDADE.map((tipo) => (
                      <label key={tipo} htmlFor={`tipo-${tipo}`} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                        <Checkbox id={`tipo-${tipo}`} checked={form.tipoAtividade.includes(tipo)} onCheckedChange={(checked) => handleCheckboxList("tipoAtividade", tipo, checked === true)} />
                        <span className="text-sm text-slate-700 select-none">{tipo}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-col gap-1.5 sm:max-w-xs">
                  <Label htmlFor="duracao">Duração</Label>
                  <SelectField id="duracao" name="duracao" value={form.duracao || ""} onChange={handleChange} placeholder="Selecione a duração" options={DURACOES} />
                </div>
              </section>

              {/* Seção 3 — Proposta Pedagógica */}
              <section aria-labelledby="secao-proposta" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                <SectionTitle id="secao-proposta" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}>Proposta Pedagógica</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="campoExperiencia">Campo de Experiência <span className="text-red-500" aria-label="obrigatório">*</span></Label>
                  <SelectField id="campoExperiencia" name="campoExperiencia" value={form.campoExperiencia} onChange={handleChange} placeholder="Selecione o campo de experiência" options={CAMPOS_EXPERIENCIA} invalid={submitted && !!errors.campoExperiencia} />
                  <FieldError message={submitted ? errors.campoExperiencia : undefined} />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-slate-700 mb-3">Direitos de Aprendizagem <span className="text-red-500" aria-label="obrigatório">*</span><span className="ml-1.5 text-xs font-normal text-slate-400">— selecione pelo menos um</span></legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DIREITOS_APRENDIZAGEM.map((direito) => (
                      <label key={direito} htmlFor={`direito-${direito}`} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                        <Checkbox id={`direito-${direito}`} checked={form.direitosAprendizagem.includes(direito)} onCheckedChange={(checked) => handleCheckboxList("direitosAprendizagem", direito, checked === true)} />
                        <span className="text-sm text-slate-700 select-none">{direito}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError message={submitted ? errors.direitosAprendizagem : undefined} />
                </fieldset>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="objetivoAprendizagem">Objetivo de Aprendizagem <span className="text-red-500" aria-label="obrigatório">*</span></Label>
                  <Textarea id="objetivoAprendizagem" name="objetivoAprendizagem" value={form.objetivoAprendizagem} onChange={handleChange} placeholder="Ex: Desenvolver oralidade, coordenação motora, percepção de cores..." rows={3} className={`rounded-xl shadow-sm resize-none${submitted && errors.objetivoAprendizagem ? " border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20" : ""}`} aria-invalid={submitted && !!errors.objetivoAprendizagem} />
                  <FieldError message={submitted ? errors.objetivoAprendizagem : undefined} />
                </div>
              </section>

              {/* Seção 4 — Informações Adicionais */}
              <section aria-labelledby="secao-adicionais" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                <SectionTitle id="secao-adicionais" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}>Informações Adicionais</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="materiaisDisponiveis">Materiais Disponíveis</Label>
                  <Input id="materiaisDisponiveis" name="materiaisDisponiveis" value={form.materiaisDisponiveis} onChange={handleChange} placeholder="Ex: Papel sulfite, lápis de cor, tesoura, cola..." className="h-9 rounded-xl shadow-sm" autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea id="observacoes" name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Necessidades especiais, contexto da turma, recursos do ambiente..." rows={3} className="rounded-xl shadow-sm resize-none" />
                </div>
              </section>

              {/* Botão de envio */}
              <div className="flex flex-col items-center gap-3 pt-2 pb-4">
                {apiError && <p role="alert" className="text-sm text-red-500 text-center">{apiError}</p>}
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-2.5 h-auto text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Gerando...</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>Gerar Planejamento</>
                  )}
                </Button>
                <p className="text-xs text-slate-400 text-center max-w-sm">O resultado gerado é uma sugestão. Você poderá revisar e editar antes de usar.</p>
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
