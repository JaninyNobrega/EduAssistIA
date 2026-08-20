export type BnccGroupCode = "EI01" | "EI02" | "EI03";

export type BnccObjective = {
  code: string;
  text: string;
};

export type BnccGuidance = {
  groupCode: BnccGroupCode;
  groupLabel: string;
  objectives: BnccObjective[];
  suggestedRights: string[];
  suggestedActivities: string[];
  suggestedMaterials: string[];
};

export const BNCC_FIELDS = [
  "O eu, o outro e o nós",
  "Corpo, gestos e movimentos",
  "Traços, sons, cores e formas",
  "Escuta, fala, pensamento e imaginação",
  "Espaços, tempos, quantidades, relações e transformações",
] as const;

const GROUP_BY_INTERNAL_AGE: Record<
  string,
  { code: BnccGroupCode; label: string }
> = {
  "0 a 1 ano": {
    code: "EI01",
    label: "Bebês (0 a 1 ano e 6 meses)",
  },
  "1 a 2 anos": {
    code: "EI02",
    label: "Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)",
  },
  "2 a 3 anos": {
    code: "EI02",
    label: "Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)",
  },
  "3 a 4 anos": {
    code: "EI02",
    label: "Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)",
  },
  "4 a 5 anos": {
    code: "EI03",
    label: "Crianças pequenas (4 anos a 5 anos e 11 meses)",
  },
};

const OBJECTIVES: Record<
  BnccGroupCode,
  Record<string, BnccObjective[]>
> = {
  EI01: {
    "O eu, o outro e o nós": [
      {
        code: "EI01EO01",
        text: "Perceber que suas ações têm efeitos nas outras crianças e nos adultos.",
      },
      {
        code: "EI01EO02",
        text: "Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações das quais participa.",
      },
    ],
    "Corpo, gestos e movimentos": [
      {
        code: "EI01CG01",
        text: "Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.",
      },
      {
        code: "EI01CG02",
        text: "Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.",
      },
    ],
    "Traços, sons, cores e formas": [
      {
        code: "EI01TS01",
        text: "Explorar sons produzidos com o próprio corpo e com objetos do ambiente.",
      },
      {
        code: "EI01TS02",
        text: "Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas.",
      },
    ],
    "Escuta, fala, pensamento e imaginação": [
      {
        code: "EI01EF01",
        text: "Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.",
      },
      {
        code: "EI01EF02",
        text: "Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.",
      },
    ],
    "Espaços, tempos, quantidades, relações e transformações": [
      {
        code: "EI01ET01",
        text: "Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura).",
      },
      {
        code: "EI01ET02",
        text: "Explorar relações de causa e efeito (transbordar, tingir, misturar, mover e remover etc.) na interação com o mundo físico.",
      },
    ],
  },

  EI02: {
    "O eu, o outro e o nós": [
      {
        code: "EI02EO01",
        text: "Demonstrar atitudes de cuidado e solidariedade na interação com crianças e adultos.",
      },
      {
        code: "EI02EO02",
        text: "Demonstrar imagem positiva de si e confiança em sua capacidade para enfrentar dificuldades e desafios.",
      },
    ],
    "Corpo, gestos e movimentos": [
      {
        code: "EI02CG01",
        text: "Apropriar-se de gestos e movimentos de sua cultura no cuidado de si e nos jogos e brincadeiras.",
      },
      {
        code: "EI02CG02",
        text: "Deslocar seu corpo no espaço, orientando-se por noções como em frente, atrás, no alto, embaixo, dentro, fora etc., ao se envolver em brincadeiras e atividades de diferentes naturezas.",
      },
    ],
    "Traços, sons, cores e formas": [
      {
        code: "EI02TS01",
        text: "Criar sons com materiais, objetos e instrumentos musicais, para acompanhar diversos ritmos de música.",
      },
      {
        code: "EI02TS02",
        text: "Utilizar materiais variados com possibilidades de manipulação (argila, massa de modelar), explorando cores, texturas, superfícies, planos, formas e volumes ao criar objetos tridimensionais.",
      },
    ],
    "Escuta, fala, pensamento e imaginação": [
      {
        code: "EI02EF01",
        text: "Dialogar com crianças e adultos, expressando seus desejos, necessidades, sentimentos e opiniões.",
      },
      {
        code: "EI02EF02",
        text: "Identificar e criar diferentes sons e reconhecer rimas e aliterações em cantigas de roda e textos poéticos.",
      },
    ],
    "Espaços, tempos, quantidades, relações e transformações": [
      {
        code: "EI02ET01",
        text: "Explorar e descrever semelhanças e diferenças entre as características e propriedades dos objetos (textura, massa, tamanho).",
      },
      {
        code: "EI02ET02",
        text: "Observar, relatar e descrever incidentes do cotidiano e fenômenos naturais (luz solar, vento, chuva etc.).",
      },
    ],
  },

  EI03: {
    "O eu, o outro e o nós": [
      {
        code: "EI03EO01",
        text: "Demonstrar empatia pelos outros, percebendo que as pessoas têm diferentes sentimentos, necessidades e maneiras de pensar e agir.",
      },
      {
        code: "EI03EO02",
        text: "Agir de maneira independente, com confiança em suas capacidades, reconhecendo suas conquistas e limitações.",
      },
    ],
    "Corpo, gestos e movimentos": [
      {
        code: "EI03CG01",
        text: "Criar com o corpo formas diversificadas de expressão de sentimentos, sensações e emoções, tanto nas situações do cotidiano quanto em brincadeiras, dança, teatro, música.",
      },
      {
        code: "EI03CG02",
        text: "Demonstrar controle e adequação do uso de seu corpo em brincadeiras e jogos, escuta e reconto de histórias, atividades artísticas, entre outras possibilidades.",
      },
    ],
    "Traços, sons, cores e formas": [
      {
        code: "EI03TS01",
        text: "Utilizar sons produzidos por materiais, objetos e instrumentos musicais durante brincadeiras de faz de conta, encenações, criações musicais, festas.",
      },
      {
        code: "EI03TS02",
        text: "Expressar-se livremente por meio de desenho, pintura, colagem, dobradura e escultura, criando produções bidimensionais e tridimensionais.",
      },
    ],
    "Escuta, fala, pensamento e imaginação": [
      {
        code: "EI03EF01",
        text: "Expressar ideias, desejos e sentimentos sobre suas vivências, por meio da linguagem oral e escrita (escrita espontânea), de fotos, desenhos e outras formas de expressão.",
      },
      {
        code: "EI03EF02",
        text: "Inventar brincadeiras cantadas, poemas e canções, criando rimas, aliterações e ritmos.",
      },
    ],
    "Espaços, tempos, quantidades, relações e transformações": [
      {
        code: "EI03ET01",
        text: "Estabelecer relações de comparação entre objetos, observando suas propriedades.",
      },
      {
        code: "EI03ET02",
        text: "Observar e descrever mudanças em diferentes materiais, resultantes de ações sobre eles, em experimentos envolvendo fenômenos naturais e artificiais.",
      },
    ],
  },
};

// Relações abaixo são sugestões do EduAssist IA para reduzir o esforço de
// preenchimento. Elas não restringem os seis direitos previstos na BNCC.
const RIGHTS_BY_FIELD: Record<string, string[]> = {
  "O eu, o outro e o nós": ["Conviver", "Participar", "Conhecer-se"],
  "Corpo, gestos e movimentos": ["Brincar", "Explorar", "Expressar"],
  "Traços, sons, cores e formas": ["Expressar", "Explorar", "Brincar"],
  "Escuta, fala, pensamento e imaginação": [
    "Expressar",
    "Participar",
    "Conviver",
  ],
  "Espaços, tempos, quantidades, relações e transformações": [
    "Explorar",
    "Participar",
    "Brincar",
  ],
};

const ACTIVITIES_BY_FIELD: Record<string, string[]> = {
  "O eu, o outro e o nós": [
    "Brincadeira orientada",
    "Dramatização",
    "Roda de conversa",
  ],
  "Corpo, gestos e movimentos": [
    "Movimento corporal",
    "Musicalização",
    "Brincadeira orientada",
  ],
  "Traços, sons, cores e formas": [
    "Pintura",
    "Colagem",
    "Musicalização",
    "Desenho",
  ],
  "Escuta, fala, pensamento e imaginação": [
    "Contação de história",
    "Musicalização",
    "Dramatização",
    "Roda de conversa",
  ],
  "Espaços, tempos, quantidades, relações e transformações": [
    "Exploração sensorial",
    "Atividade com materiais concretos",
    "Brincadeira orientada",
  ],
};

const MATERIALS_BY_FIELD: Record<string, string[]> = {
  "O eu, o outro e o nós": ["Livros", "Figuras", "Brinquedos", "Papel"],
  "Corpo, gestos e movimentos": [
    "Brinquedos",
    "Instrumentos musicais",
    "Elementos da natureza",
  ],
  "Traços, sons, cores e formas": [
    "Tinta guache",
    "Pincel",
    "Giz de cera",
    "Lápis de cor",
    "Massinha",
    "Instrumentos musicais",
  ],
  "Escuta, fala, pensamento e imaginação": [
    "Livros",
    "Figuras",
    "Papel",
    "Lápis de cor",
    "Instrumentos musicais",
  ],
  "Espaços, tempos, quantidades, relações e transformações": [
    "Brinquedos",
    "Materiais recicláveis",
    "Elementos da natureza",
    "Massinha",
  ],
};

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function getBnccGroup(faixaEtaria: string) {
  return GROUP_BY_INTERNAL_AGE[faixaEtaria] ?? null;
}

export function getBnccGuidance(
  faixaEtaria: string,
  campoExperiencia: string,
): BnccGuidance | null {
  const group = getBnccGroup(faixaEtaria);

  if (!group || !campoExperiencia) return null;

  return {
    groupCode: group.code,
    groupLabel: group.label,
    objectives: OBJECTIVES[group.code][campoExperiencia] ?? [],
    suggestedRights: RIGHTS_BY_FIELD[campoExperiencia] ?? [],
    suggestedActivities: ACTIVITIES_BY_FIELD[campoExperiencia] ?? [],
    suggestedMaterials: MATERIALS_BY_FIELD[campoExperiencia] ?? [],
  };
}

export function orderWithSuggestions(
  allOptions: readonly string[],
  suggestions: string[],
): string[] {
  return unique([
    ...suggestions,
    ...allOptions.filter((option) => !suggestions.includes(option)),
  ]);
}