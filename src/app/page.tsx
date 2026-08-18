import Link from "next/link";

/**
 * Página inicial do EduAssist IA.
 *
 * UX10: identidade visual leve, contemporânea e acolhedora,
 * preservando o fluxo simples de entrada no planejamento.
 *
 * Requisito: RF01
 */
export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white px-6 py-16">
      {/* Elementos decorativos discretos — sem interferir na leitura */}
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-7 text-center">
        {/* Marca */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_16px_40px_rgba(37,99,235,0.22)] ring-1 ring-white/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10"
            aria-hidden="true"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>

        {/* Hierarquia principal */}
        <div className="flex flex-col items-center gap-2.5">
          <span className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-sm">
            Educação Infantil • Planejamento pedagógico
          </span>

          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            EduAssist IA
          </h1>

          <p className="text-base font-medium text-blue-600">
            Assistente de Planejamento Pedagógico
          </p>
        </div>

        <p className="max-w-md text-[15px] leading-7 text-slate-600 sm:text-base">
          Organize sua proposta de aula de forma simples e receba uma sugestão
          estruturada para a Educação Infantil, pronta para revisar, adaptar e
          usar na sua rotina.
        </p>

        <Link
          href="/planejamento"
          className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(37,99,235,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 transition-transform group-hover:rotate-6"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Iniciar planejamento
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          <span>Você poderá revisar e editar a sugestão antes de usar.</span>
        </div>
      </div>

      <footer className="relative z-10 mt-14 max-w-md text-center text-xs leading-5 text-slate-400">
        O EduAssist IA apoia a organização do planejamento. A decisão
        pedagógica final permanece sempre com o professor.
      </footer>
    </main>
  );
}