import type { PlanningFormData, PlanningResult } from "@/lib/types";
import type { PlanningProvider } from "@/lib/providers/PlanningProvider";

type PedagogicalProfile = {
  vivenciaAprendizagem: string;
  metodologia: string[];
  materiaisPadrao: string[];
  avaliacaoObservacao: string;
  adaptacoesPossiveis: string[];
};

/**
 * Provedor de geração simulada para o modo demonstração do MVP.
 *
 * Implementa PlanningProvider seguindo o contrato definido em
 * requirements.md § 6, sem realizar chamada a API externa.
 *
 * UX06:
 * O conteúdo pedagógico simulado varia conforme a faixa etária,
 * buscando maior coerência com as características da Educação Infantil.
 *
 * Requisitos: RF06, RF08, seção 9 do requirements.md.
 */
export class MockProvider implements PlanningProvider {
  async generate(data: PlanningFormData): Promise<PlanningResult> {
    // Delay simulado para tornar perceptível o estado de carregamento (RF07)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const profile = getPedagogicalProfile(data);

    return {
      // Identificação
      identificacao: `Plano de Aula – ${data.turma} | ${data.tema}`,

      // Dados espelhados da entrada
      turma: data.turma,
      faixaEtaria: data.faixaEtaria,
      dataPeriodo: data.dataPeriodo,
      tema: data.tema,
      campoExperiencia: data.campoExperiencia,
      direitosAprendizagem: data.direitosAprendizagem,
      objetivoAprendizagem: data.objetivoAprendizagem,

      // Conteúdo pedagógico simulado e adaptado à faixa etária
      vivenciaAprendizagem: profile.vivenciaAprendizagem,
      metodologia: profile.metodologia,

      materiaisNecessarios: data.materiaisDisponiveis
        ? parseMaterials(data.materiaisDisponiveis)
        : profile.materiaisPadrao,

      avaliacaoObservacao: profile.avaliacaoObservacao,
      adaptacoesPossiveis: profile.adaptacoesPossiveis,

      observacaoFinal:
        "Esta sugestão de plano de aula foi gerada como ponto de partida para o planejamento do professor. " +
        "Recomenda-se que o conteúdo seja revisado, adaptado e complementado de acordo com o contexto " +
        "específico da turma, os recursos disponíveis na instituição e as necessidades observadas nas crianças. " +
        "O professor permanece responsável pela decisão pedagógica final.",
    };
  }
}

/**
 * Converte os materiais informados pelo professor para o formato
 * utilizado pelo PlanningResult.
 */
function parseMaterials(materials: string): string[] {
  return materials
    .split(/[,;\n]/)
    .map((material) => material.trim())
    .filter(Boolean);
}

/**
 * Define o perfil pedagógico utilizado pelo MockProvider.
 *
 * A faixa etária é utilizada como referência principal para evitar
 * propostas incompatíveis com o desenvolvimento das crianças.
 */
function getPedagogicalProfile(
  data: PlanningFormData
): PedagogicalProfile {
  switch (data.faixaEtaria) {
    case "0 a 1 ano":
      return getBerçarioProfile(data);

    case "1 a 2 anos":
      return getMaternalIProfile(data);

    case "2 a 3 anos":
      return getMaternalIIProfile(data);

    case "3 a 4 anos":
      return getInfantilIProfile(data);

    case "4 a 5 anos":
      return getInfantilIIProfile(data);

    default:
      return getDefaultProfile(data);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 0 a 1 ano — Berçário
// ─────────────────────────────────────────────────────────────────────────────

function getBerçarioProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `A proposta sobre o tema "${data.tema}" será apresentada de forma acolhedora e sensorial, ` +
      "em um espaço seguro e confortável. As crianças serão convidadas a observar, tocar, ouvir " +
      "e explorar materiais adequados à idade, com acompanhamento próximo do adulto. " +
      "Durante a experiência, o professor poderá nomear objetos, sons, cores e sensações, " +
      "respeitando o tempo, o interesse e as formas de expressão de cada criança.",

    metodologia: [
      "Organizar um espaço seguro e acolhedor com poucos estímulos por vez.",
      "Apresentar os materiais gradualmente, permitindo observação e exploração livre.",
      "Mediar a experiência por meio de fala suave, gestos, músicas e nomeação dos elementos.",
      "Estimular movimentos, olhares, toques e outras formas de interação, sem exigir respostas verbais.",
      "Encerrar a proposta de maneira tranquila, respeitando sinais de interesse, cansaço ou necessidade de acolhimento.",
    ],

    materiaisPadrao: [
      "Objetos coloridos e seguros para manipulação",
      "Tecidos com diferentes texturas",
      "Brinquedos sonoros adequados à faixa etária",
      "Elementos grandes para exploração sensorial",
    ],

    avaliacaoObservacao:
      "A avaliação ocorrerá por meio da observação das reações e interações das crianças durante a experiência. " +
      "O professor poderá observar interesse pelos estímulos apresentados, movimentos corporais, olhares, " +
      "tentativas de alcance e manipulação, vocalizações, expressões faciais e interação com o adulto. " +
      "Não se espera uma resposta padronizada, considerando os diferentes ritmos de desenvolvimento.",

    adaptacoesPossiveis: [
      "Reduzir a quantidade de estímulos quando a criança demonstrar desconforto ou cansaço.",
      "Modificar texturas, sons ou objetos de acordo com as respostas observadas.",
      "Realizar a experiência individualmente ou em pequenos grupos quando necessário.",
      "Garantir apoio físico e posicionamento confortável para crianças com necessidades específicas.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1 a 2 anos — Maternal I
// ─────────────────────────────────────────────────────────────────────────────

function getMaternalIProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `As crianças serão convidadas a explorar o tema "${data.tema}" por meio de uma experiência ` +
      "curta, concreta e lúdica. O professor apresentará materiais que possam ser observados, tocados, " +
      "manipulados e explorados livremente. A proposta poderá envolver música, gestos, movimentos, " +
      "pintura ou exploração sensorial, com mediação próxima do adulto e linguagem simples.",

    metodologia: [
      "Apresentar o tema utilizando objetos, imagens, sons, gestos ou uma música curta.",
      "Disponibilizar materiais seguros para exploração e manipulação pelas crianças.",
      "Incentivar movimentos, imitações, apontamentos, vocalizações e pequenas descobertas.",
      "Nomear elementos e ações durante a atividade utilizando frases simples e repetição.",
      "Finalizar com música, gesto ou breve retomada da experiência vivenciada.",
    ],

    materiaisPadrao: [
      "Tinta guache atóxica",
      "Papel em tamanho grande",
      "Objetos ou figuras relacionados ao tema",
      "Materiais de diferentes texturas",
      "Instrumentos musicais ou objetos sonoros simples",
    ],

    avaliacaoObservacao:
      "A avaliação será realizada pela observação da participação das crianças durante a proposta. " +
      "O professor poderá observar interesse pelos materiais, iniciativa para explorar, movimentos, " +
      "gestos, vocalizações, imitação de ações, interação com o adulto e com outras crianças e " +
      "diferentes formas de expressão durante a experiência.",

    adaptacoesPossiveis: [
      "Oferecer materiais maiores e de fácil manipulação quando necessário.",
      "Permitir que a criança participe pelo tempo em que demonstrar interesse.",
      "Substituir materiais que provoquem desconforto sensorial.",
      "Utilizar gestos, imagens e demonstrações para favorecer a compreensão da proposta.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 a 3 anos — Maternal II
// ─────────────────────────────────────────────────────────────────────────────

function getMaternalIIProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `O tema "${data.tema}" será apresentado por meio de uma experiência lúdica que poderá envolver ` +
      "história curta, imagens, música ou objetos concretos. Em seguida, as crianças participarão de " +
      "uma atividade prática de exploração, pintura, colagem, movimento ou brincadeira orientada. " +
      "Durante a vivência, serão estimuladas a fazer escolhas, nomear elementos, interagir e expressar " +
      "suas percepções de diferentes maneiras.",

    metodologia: [
      "Introduzir o tema com história curta, música, imagem ou objeto concreto.",
      "Conversar brevemente com as crianças utilizando perguntas simples e relacionadas à experiência.",
      "Propor uma atividade prática de manipulação, pintura, colagem, movimento ou brincadeira.",
      "Incentivar escolhas, participação e interação entre as crianças durante a atividade.",
      "Encerrar retomando elementos vivenciados por meio de fala, música, exposição das produções ou brincadeira.",
    ],

    materiaisPadrao: [
      "Papel",
      "Tinta guache",
      "Giz de cera grosso",
      "Cola",
      "Figuras relacionadas ao tema",
      "Materiais concretos para exploração",
    ],

    avaliacaoObservacao:
      "A avaliação ocorrerá durante a atividade, considerando a participação, o interesse e as formas " +
      "de interação apresentadas pelas crianças. O professor poderá observar exploração dos materiais, " +
      "comunicação por palavras ou gestos, iniciativa, realização de escolhas, interação com os colegas " +
      "e envolvimento nas brincadeiras propostas.",

    adaptacoesPossiveis: [
      "Reduzir a quantidade de etapas quando necessário.",
      "Oferecer apoio individual para manipulação dos materiais.",
      "Permitir diferentes formas de participação e expressão.",
      "Utilizar imagens, objetos concretos ou demonstrações para facilitar a compreensão.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 a 4 anos — Infantil I
// ─────────────────────────────────────────────────────────────────────────────

function getInfantilIProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `As crianças serão convidadas a conhecer e explorar o tema "${data.tema}" a partir de uma breve ` +
      "conversa, história, música ou situação lúdica. Em seguida, participarão de uma proposta prática " +
      "que poderá envolver desenho, pintura, colagem, dramatização, jogos, movimento ou exploração de " +
      "materiais. O professor mediará a atividade estimulando a curiosidade, a comunicação, as escolhas " +
      "e a interação entre as crianças.",

    metodologia: [
      "Realizar uma breve introdução ao tema por meio de conversa, história, música ou recurso visual.",
      "Estimular as crianças a expressarem ideias e experiências relacionadas ao tema.",
      "Desenvolver uma atividade prática e lúdica utilizando materiais adequados à proposta.",
      "Promover interação, escolhas e participação durante o desenvolvimento da atividade.",
      "Finalizar com compartilhamento das produções, relato das experiências ou brincadeira relacionada ao tema.",
    ],

    materiaisPadrao: [
      "Papel",
      "Tinta guache",
      "Lápis de cor ou giz de cera",
      "Cola",
      "Figuras ou livros relacionados ao tema",
      "Materiais para brincadeiras ou dramatizações",
    ],

    avaliacaoObservacao:
      "A avaliação será realizada pela observação da participação das crianças, considerando interesse, " +
      "comunicação, interação com os colegas, exploração dos materiais, realização de escolhas, criatividade " +
      "e envolvimento nas experiências propostas. O professor poderá registrar aspectos relevantes observados " +
      "durante a atividade.",

    adaptacoesPossiveis: [
      "Simplificar etapas ou instruções de acordo com as necessidades da turma.",
      "Disponibilizar diferentes materiais e formas de participação.",
      "Utilizar apoio visual, demonstração ou acompanhamento individual quando necessário.",
      "Ampliar a atividade para crianças que demonstrarem interesse em novas explorações.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4 a 5 anos — Infantil II / Pré-escola
// ─────────────────────────────────────────────────────────────────────────────

function getInfantilIIProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `A proposta sobre o tema "${data.tema}" terá início com uma conversa ou situação provocadora, ` +
      "permitindo que as crianças apresentem ideias, experiências e perguntas. Em seguida, serão convidadas " +
      "a participar de uma experiência prática envolvendo investigação, criação, jogos, dramatização, arte " +
      "ou exploração de materiais. Ao final, poderão compartilhar suas produções, descobertas e diferentes " +
      "formas de compreender o tema.",

    metodologia: [
      "Introduzir o tema por meio de conversa, história, imagem, objeto ou situação-problema simples.",
      "Ouvir hipóteses, ideias e experiências apresentadas pelas crianças.",
      "Propor atividade prática de investigação, criação, jogo, arte ou dramatização.",
      "Acompanhar a atividade fazendo perguntas que estimulem observação, comparação e expressão de ideias.",
      "Realizar momento de compartilhamento das experiências, produções ou descobertas realizadas.",
    ],

    materiaisPadrao: [
      "Papel e cartolina",
      "Lápis de cor e canetinhas",
      "Tinta guache",
      "Cola e materiais para colagem",
      "Livros ou imagens relacionados ao tema",
      "Materiais concretos relacionados à proposta",
    ],

    avaliacaoObservacao:
      "A avaliação ocorrerá durante todo o processo, considerando participação, autonomia, comunicação, " +
      "interação, elaboração de ideias, curiosidade, estratégias utilizadas durante a atividade e capacidade " +
      "de compartilhar experiências e descobertas. Os registros do professor poderão apoiar a análise do " +
      "desenvolvimento observado.",

    adaptacoesPossiveis: [
      "Oferecer apoio visual ou instruções em etapas quando necessário.",
      "Permitir diferentes formas de registro, expressão e participação.",
      "Adequar materiais e recursos às necessidades das crianças.",
      "Ampliar a investigação com novas perguntas ou desafios quando houver interesse da turma.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback para valores não previstos
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultProfile(
  data: PlanningFormData
): PedagogicalProfile {
  return {
    vivenciaAprendizagem:
      `As crianças serão convidadas a explorar o tema "${data.tema}" por meio de uma proposta lúdica, ` +
      "concreta e adequada à Educação Infantil. O professor acompanhará a experiência, oferecendo materiais, " +
      "interações e possibilidades de expressão de acordo com as características da turma.",

    metodologia: [
      "Apresentar o tema de maneira lúdica e contextualizada.",
      "Disponibilizar materiais adequados para exploração.",
      "Acompanhar e mediar as interações durante a experiência.",
      "Estimular diferentes formas de expressão e participação.",
      "Encerrar retomando os principais momentos vivenciados.",
    ],

    materiaisPadrao: [
      "Papel",
      "Tinta guache",
      "Giz de cera",
      "Figuras relacionadas ao tema",
      "Materiais concretos disponíveis na instituição",
    ],

    avaliacaoObservacao:
      "A avaliação ocorrerá por meio da observação da participação, interesse, interação, exploração dos " +
      "materiais e formas de expressão apresentadas pelas crianças durante a proposta.",

    adaptacoesPossiveis: [
      "Adequar o tempo da proposta às características da turma.",
      "Oferecer diferentes formas de participação.",
      "Adaptar materiais conforme as necessidades observadas.",
      "Realizar acompanhamento individual quando necessário.",
    ],
  };
}