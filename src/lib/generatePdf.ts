import type { PlanningResult } from "@/lib/types";

// Margens e largura útil (A4: 210mm, margens de 20mm cada lado)
const MARGIN_X = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const PAGE_H = 297;
const MARGIN_BOTTOM = 25; // reserva para o rodapé

// Paleta de cores em RGB
const COLOR_BLUE: [number, number, number] = [37, 99, 235];   // blue-600
const COLOR_DARK: [number, number, number] = [15, 23, 42];    // slate-900
const COLOR_BODY: [number, number, number] = [51, 65, 85];    // slate-700
const COLOR_MUTED: [number, number, number] = [100, 116, 139]; // slate-500
const COLOR_LINE: [number, number, number] = [226, 232, 240]; // slate-200


/**
 * Formata YYYY-MM-DD como DD/MM/AAAA.
 * Outros valores são preservados para permitir períodos textuais.
 */
function formatDateBR(value?: string): string {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return value;

  const [, year, month, day] = match;

  return `${day}/${month}/${year}`;
}

/**
 * Gera e faz o download do planejamento pedagógico em PDF usando jsPDF.
 *
 * A geração é feita inteiramente no cliente, sem chamada a serviços externos.
 * Usa sempre o resultado atual (incluindo edições feitas na T12).
 *
 * Requisito: RF10
 */
export async function generatePdf(result: PlanningResult): Promise<void> {
  // Import dinâmico — evita que jsPDF seja incluído no bundle do servidor
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = 0; // posição vertical corrente

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Verifica se há espaço; se não, adiciona nova página. */
  function checkPageBreak(needed: number) {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      y = 20;
    }
  }

  /**
   * Imprime texto com quebra de linha automática.
   * Retorna o novo valor de y após o bloco.
   */
  function addWrappedText(
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number {
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  }

  /** Imprime um título de seção com linha separadora. */
  function addSectionTitle(title: string) {
    checkPageBreak(12);
    doc.setFillColor(...COLOR_BLUE);
    doc.rect(MARGIN_X, y - 4, CONTENT_W, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), MARGIN_X + 3, y);
    y += 7;
    doc.setTextColor(...COLOR_BODY);
  }

  /** Imprime um item de lista com bullet. */
  function addListItem(text: string, indent = 0) {
    checkPageBreak(6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_BODY);
    const bullet = "•";
    const bx = MARGIN_X + 3 + indent;
    const tx = bx + 5;
    doc.text(bullet, bx, y);
    addWrappedText(text, tx, y, CONTENT_W - 8 - indent, 5.5);
  }

  /** Imprime um item numerado. */
  function addNumberedItem(num: number, text: string) {
    checkPageBreak(6);
    const label = `${num}.`;
    const tx = MARGIN_X + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_BLUE);
    doc.text(label, MARGIN_X + 3, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOR_BODY);
    addWrappedText(text, tx, y, CONTENT_W - 10, 5.5);
  }

  // ─── Cabeçalho ────────────────────────────────────────────────────────────

  // Faixa azul de topo
  doc.setFillColor(...COLOR_BLUE);
  doc.rect(0, 0, PAGE_W, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("EduAssist IA", MARGIN_X, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Planejamento Pedagógico", MARGIN_X, 21);

  y = 36;

  // ─── Identificação ────────────────────────────────────────────────────────

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_DARK);
  doc.text(result.identificacao, MARGIN_X, y);
  y += 7;

  // Metadados de identificação
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(...COLOR_MUTED);

doc.text(
  `Turma: ${result.turma}   |   Faixa etária: ${result.faixaEtaria}`,
  MARGIN_X,
  y
);
y += 5;

if (result.dataPeriodo) {
  doc.text(
    `Data ou período: ${formatDateBR(result.dataPeriodo)}`,
    MARGIN_X,
    y
  );
  y += 5;
}

doc.text(`Tema: ${result.tema}`, MARGIN_X, y);
y += 5;

  // Linha separadora
  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 6;

  // ─── Campo de Experiência ─────────────────────────────────────────────────

  addSectionTitle("Campo de Experiência");
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_BODY);
  addWrappedText(result.campoExperiencia, MARGIN_X + 3, y, CONTENT_W - 6, 5.5);
  y += 4;

  // ─── Direitos de Aprendizagem ─────────────────────────────────────────────

  addSectionTitle("Direitos de Aprendizagem");
  y += 2;
  result.direitosAprendizagem.forEach((d) => addListItem(d));
  y += 4;

  // ─── Objetivo de Aprendizagem ─────────────────────────────────────────────

  addSectionTitle("Objetivo de Aprendizagem");
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_BODY);
  addWrappedText(result.objetivoAprendizagem, MARGIN_X + 3, y, CONTENT_W - 6, 5.5);
  y += 4;

  // ─── Vivência de Aprendizagem ─────────────────────────────────────────────

  addSectionTitle("Vivência de Aprendizagem");
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_BODY);
  addWrappedText(result.vivenciaAprendizagem, MARGIN_X + 3, y, CONTENT_W - 6, 5.5);
  y += 4;

  // ─── Metodologia ─────────────────────────────────────────────────────────

  addSectionTitle("Metodologia");
  y += 2;
  result.metodologia.forEach((etapa, i) => addNumberedItem(i + 1, etapa));
  y += 4;

  // ─── Materiais Necessários ───────────────────────────────────────────────

  addSectionTitle("Materiais Necessários");
  y += 2;
  result.materiaisNecessarios.forEach((m) => addListItem(m));
  y += 4;

  // ─── Avaliação por Observação ─────────────────────────────────────────────

  addSectionTitle("Avaliação por Observação");
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_BODY);
  addWrappedText(result.avaliacaoObservacao, MARGIN_X + 3, y, CONTENT_W - 6, 5.5);
  y += 4;

  // ─── Adaptações Possíveis ─────────────────────────────────────────────────

  addSectionTitle("Adaptações Possíveis");
  y += 2;
  result.adaptacoesPossiveis.forEach((a) => addListItem(a));
  y += 4;

  // ─── Observação Final ─────────────────────────────────────────────────────

  addSectionTitle("Observação Final");
  y += 2;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  addWrappedText(result.observacaoFinal, MARGIN_X + 3, y, CONTENT_W - 6, 5.5);

  // ─── Rodapé em todas as páginas ───────────────────────────────────────────

  const totalPages: number = (doc as unknown as { internal: { getNumberOfPages(): number } })
    .internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Linha acima do rodapé
    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, PAGE_H - 18, PAGE_W - MARGIN_X, PAGE_H - 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("Documento gerado pelo EduAssist IA.", MARGIN_X, PAGE_H - 13);
    doc.text(
      "Este planejamento constitui uma sugestão de apoio ao professor e poderá ser adaptado conforme a realidade da turma.",
      MARGIN_X,
      PAGE_H - 9,
      { maxWidth: CONTENT_W - 20 }
    );

    // Numeração de página
    doc.text(`${i} / ${totalPages}`, PAGE_W - MARGIN_X, PAGE_H - 9, { align: "right" });
  }

  // ─── Download ────────────────────────────────────────────────────────────

  const filename = `EduAssistIA_${result.turma.replace(/\s+/g, "_")}_${result.tema.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
