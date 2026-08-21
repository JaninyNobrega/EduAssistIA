import type { PlanningResult } from "@/lib/types";

// ─── Dimensões A4 ─────────────────────────────────────────────────────────────

const MARGIN_X = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const TOP_CONTENT_Y = 34;
const FOOTER_Y = 283;
const CONTENT_LIMIT_Y = 273;

// ─── Paleta ───────────────────────────────────────────────────────────────────

const COLOR_BLUE: [number, number, number] = [37, 99, 235];
const COLOR_BLUE_SOFT: [number, number, number] = [219, 234, 254];

const COLOR_DARK: [number, number, number] = [15, 23, 42];
const COLOR_BODY: [number, number, number] = [51, 65, 85];
const COLOR_MUTED: [number, number, number] = [100, 116, 139];
const COLOR_LINE: [number, number, number] = [226, 232, 240];

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
 * A geração ocorre inteiramente no cliente e usa o estado atual
 * do planejamento, incluindo edições realizadas pelo professor.
 *
 * UX-PDF01:
 * - identificação compacta;
 * - títulos mais leves;
 * - menor espaçamento vertical;
 * - melhor aproveitamento de página;
 * - manutenção da identidade visual do EduAssist IA.
 *
 * Requisito: RF10
 */
export async function generatePdf(
  result: PlanningResult,
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  let y = 0;

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function addPage() {
    doc.addPage();
    y = 18;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > CONTENT_LIMIT_Y) {
      addPage();
    }
  }

  function addWrappedText(
    text: string,
    x: number,
    maxWidth: number,
    lineHeight = 4.7,
  ) {
    const lines = doc.splitTextToSize(text, maxWidth) as string[];

    lines.forEach((line) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
  }

  /**
   * Título de seção leve:
   * texto azul + pequena linha horizontal.
   */
  function addSectionTitle(title: string) {
    checkPageBreak(9);

    y += 1;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_BLUE);

    doc.text(title.toUpperCase(), MARGIN_X, y);

    const titleWidth = doc.getTextWidth(title.toUpperCase());

    doc.setDrawColor(...COLOR_BLUE_SOFT);
    doc.setLineWidth(0.35);

    doc.line(
      MARGIN_X + titleWidth + 4,
      y - 0.8,
      PAGE_W - MARGIN_X,
      y - 0.8,
    );

    y += 4.8;

    doc.setTextColor(...COLOR_BODY);
  }

  function addListItem(text: string) {
    checkPageBreak(5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(...COLOR_BODY);

    const bulletX = MARGIN_X + 1;
    const textX = MARGIN_X + 5;

    doc.setTextColor(...COLOR_BLUE);
    doc.text("•", bulletX, y);

    doc.setTextColor(...COLOR_BODY);

    addWrappedText(
      text,
      textX,
      CONTENT_W - 5,
      4.6,
    );
  }

  function addNumberedItem(num: number, text: string) {
    checkPageBreak(5);

    const numberX = MARGIN_X + 1;
    const textX = MARGIN_X + 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setTextColor(...COLOR_BLUE);
    doc.text(`${num}.`, numberX, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOR_BODY);

    addWrappedText(
      text,
      textX,
      CONTENT_W - 7,
      4.6,
    );
  }

  function addParagraph(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(...COLOR_BODY);

    addWrappedText(
      text,
      MARGIN_X,
      CONTENT_W,
      4.7,
    );
  }

  // ─── Cabeçalho ─────────────────────────────────────────────────────────────

  doc.setFillColor(...COLOR_BLUE);
  doc.rect(0, 0, PAGE_W, 25, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("EduAssist IA", MARGIN_X, 11.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Planejamento Pedagógico", MARGIN_X, 18.5);

  y = TOP_CONTENT_Y;

  // ─── Identificação ─────────────────────────────────────────────────────────

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_DARK);

  const titleLines = doc.splitTextToSize(
    result.identificacao,
    CONTENT_W,
  ) as string[];

  titleLines.forEach((line) => {
    doc.text(line, MARGIN_X, y);
    y += 5.5;
  });

  y += 1.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(...COLOR_MUTED);

  const columnGap = 6;
  const columnWidth = (CONTENT_W - columnGap) / 2;
  const rightColumnX = MARGIN_X + columnWidth + columnGap;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOR_DARK);
  doc.text("Turma", MARGIN_X, y);
  doc.text("Faixa etária", rightColumnX, y);

  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_BODY);

  doc.text(
    result.turma,
    MARGIN_X,
    y,
    { maxWidth: columnWidth },
  );

  doc.text(
    result.faixaEtaria,
    rightColumnX,
    y,
    { maxWidth: columnWidth },
  );

  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOR_DARK);

  if (result.dataPeriodo) {
    doc.text("Data", MARGIN_X, y);
  }

  doc.text("Tema", rightColumnX, y);

  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_BODY);

  if (result.dataPeriodo) {
    doc.text(
      formatDateBR(result.dataPeriodo),
      MARGIN_X,
      y,
      { maxWidth: columnWidth },
    );
  }

  doc.text(
    result.tema,
    rightColumnX,
    y,
    { maxWidth: columnWidth },
  );

  y += 6;

  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(0.35);
  doc.line(
    MARGIN_X,
    y,
    PAGE_W - MARGIN_X,
    y,
  );

  y += 5;

  // ─── Campo de Experiência ──────────────────────────────────────────────────

  addSectionTitle("Campo de Experiência");
  addParagraph(result.campoExperiencia);
  y += 2.5;

  // ─── Direitos de Aprendizagem ──────────────────────────────────────────────

  addSectionTitle("Direitos de Aprendizagem");

  result.direitosAprendizagem.forEach((item) => {
    addListItem(item);
  });

  y += 2.5;

  // ─── Objetivo de Aprendizagem ──────────────────────────────────────────────

  addSectionTitle("Objetivo de Aprendizagem");
  addParagraph(result.objetivoAprendizagem);
  y += 2.5;

  // ─── Vivência de Aprendizagem ──────────────────────────────────────────────

  addSectionTitle("Vivência de Aprendizagem");
  addParagraph(result.vivenciaAprendizagem);
  y += 2.5;

  // ─── Metodologia ───────────────────────────────────────────────────────────

  addSectionTitle("Metodologia");

  result.metodologia.forEach((etapa, index) => {
    addNumberedItem(index + 1, etapa);
  });

  y += 2.5;

  // ─── Materiais Necessários ─────────────────────────────────────────────────

  addSectionTitle("Materiais Necessários");

  result.materiaisNecessarios.forEach((material) => {
    addListItem(material);
  });

  y += 2.5;

  // ─── Avaliação por Observação ──────────────────────────────────────────────

  addSectionTitle("Avaliação por Observação");
  addParagraph(result.avaliacaoObservacao);
  y += 2.5;

  // ─── Adaptações Possíveis ──────────────────────────────────────────────────

  addSectionTitle("Adaptações Possíveis");

  result.adaptacoesPossiveis.forEach((adaptacao) => {
    addListItem(adaptacao);
  });

  y += 2.5;

  // ─── Observação Final ──────────────────────────────────────────────────────

  addSectionTitle("Observação Final");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.6);
  doc.setTextColor(...COLOR_MUTED);

  addWrappedText(
    result.observacaoFinal,
    MARGIN_X,
    CONTENT_W,
    4.7,
  );

  // ─── Rodapé ────────────────────────────────────────────────────────────────

  const totalPages = (
    doc as unknown as {
      internal: {
        getNumberOfPages(): number;
      };
    }
  ).internal.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(0.3);

    doc.line(
      MARGIN_X,
      FOOTER_Y - 7,
      PAGE_W - MARGIN_X,
      FOOTER_Y - 7,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);

    doc.text(
      "Documento gerado pelo EduAssist IA.",
      MARGIN_X,
      FOOTER_Y - 2,
    );

    doc.text(
      "Sugestão de apoio ao planejamento. O conteúdo poderá ser revisado e adaptado pelo professor.",
      MARGIN_X,
      FOOTER_Y + 2,
      {
        maxWidth: CONTENT_W - 18,
      },
    );

    doc.text(
      `${page} / ${totalPages}`,
      PAGE_W - MARGIN_X,
      FOOTER_Y + 2,
      {
        align: "right",
      },
    );
  }

  // ─── Download ───────────────────────────────────────────────────────────────

  const filename =
    `EduAssistIA_${result.turma.replace(/\s+/g, "_")}_` +
    `${result.tema.replace(/\s+/g, "_")}.pdf`;

  doc.save(filename);
}