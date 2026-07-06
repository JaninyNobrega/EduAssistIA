/**
 * Card reutilizável para cada seção do planejamento gerado.
 *
 * Segue o padrão visual definido no design-system.md:
 * - cantos arredondados (rounded-2xl)
 * - sombra suave (shadow-sm)
 * - espaçamento generoso
 * - ícone azul + título em destaque
 */
export function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
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

      {/* Conteúdo da seção */}
      <div>{children}</div>
    </div>
  );
}
