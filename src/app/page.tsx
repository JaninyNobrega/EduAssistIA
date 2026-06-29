import Link from "next/link";

/**
 * Página inicial do EduAssist IA.
 *
 * Apresenta o sistema ao professor e oferece o ponto de entrada
 * para iniciar um novo planejamento pedagógico.
 *
 * Requisito: RF01
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 bg-slate-50">
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">

        {/* Ícone representativo */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
            aria-hidden="true"
          >
            {/* Livro aberto */}
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>

        {/* Cabeçalho */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            EduAssist IA
          </h1>
          <p className="text-base font-medium text-blue-600">
            Assistente de Planejamento Pedagógico
          </p>
        </div>

        {/* Descrição */}
        <p className="text-slate-600 text-base leading-relaxed max-w-md">
          Preencha os dados da sua proposta e receba uma sugestão estruturada
          de plano de aula para a Educação Infantil, alinhada à BNCC e pronta
          para revisão e edição.
        </p>

        {/* Botão principal */}
        <Link
          href="/planejamento"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          📖 Iniciar Planejamento
        </Link>

      </div>

      {/* Rodapé */}
      <footer className="mt-16 text-center text-sm text-slate-400 max-w-md">
        O EduAssist IA é um apoio à organização do planejamento.
        A decisão pedagógica final é sempre do professor.
      </footer>
    </main>
  );
}
