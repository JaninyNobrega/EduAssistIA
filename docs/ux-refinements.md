# Refinamentos de UX – EduAssist IA

**Projeto:** EduAssist IA

**Versão:** 1.0

**Objetivo**

Este documento define a evolução da experiência do usuário (UX) do EduAssist IA após a conclusão do MVP funcional.

Seu objetivo é orientar futuras implementações voltadas à redução do esforço cognitivo do professor, melhoria da usabilidade e maior aderência à realidade da Educação Infantil.

Este documento complementa o **Design System**, descrevendo comportamentos da interface e melhorias de interação, sem alterar os requisitos funcionais do sistema.

---

# Princípios Gerais de UX
g
Toda evolução da interface deverá respeitar os seguintes princípios.

## UXP01 — O professor deve pensar na aula, não no sistema

A interface deve exigir o mínimo possível de esforço para ser utilizada.

O sistema deve reduzir decisões desnecessárias e conduzir o professor naturalmente durante o preenchimento.

---

## UXP02 — Digitar deve ser a exceção

Sempre que possível utilizar:

- listas;
- checkboxes;
- radio buttons;
- autocomplete;
- sugestões inteligentes;
- inferência automática.

Campos de texto livre devem existir apenas quando realmente necessários.

---

## UXP03 — Uma tela deve transmitir calma

Evitar:

- excesso de cards;
- excesso de cores;
- excesso de sombras;
- excesso de informações simultâneas;
- excesso de botões.

A leitura deve se aproximar de um documento pedagógico.

---

## UXP04 — A IA apoia o professor

O sistema nunca deve transmitir a ideia de substituir o professor.

Toda comunicação deve reforçar que o planejamento é uma sugestão inicial.

---

## UXP05 — Cada clique deve ter propósito

Nenhuma ação deverá existir sem necessidade.

Sempre que possível eliminar etapas repetitivas.

---

# UX01 – Fluxo em duas etapas

**Prioridade:** Alta

Após gerar o planejamento, o formulário deverá sair do foco.

Fluxo desejado:

Tela Inicial

↓

Formulário

↓

Gerar Planejamento

↓

Planejamento Gerado

O formulário permanecerá oculto.

Caso o professor deseje alterar os dados iniciais, utilizar:

**Editar Informações**

que reabre o formulário.

---

# UX02 – Planejamento em formato de documento

**Prioridade:** Alta

O resultado gerado não deverá parecer um dashboard.

A apresentação deverá lembrar um documento pedagógico.

Estrutura sugerida:

Planejamento Pedagógico

────────────────────

Identificação

────────────────────

Objetivo

────────────────────

Vivência

────────────────────

Metodologia

────────────────────

Materiais

────────────────────

Avaliação

────────────────────

Adaptações

────────────────────

Observações

Substituir múltiplos cards por seções mais leves visualmente.

---

# UX03 – Eliminação de informações redundantes

**Prioridade:** Alta

O sistema deverá inferir automaticamente informações já conhecidas.

Exemplo:

Maternal I

↓

Faixa Etária

↓

1 a 2 anos

Não exigir preenchimento duplicado.

---

# UX04 – Componentes inteligentes

**Prioridade:** Alta

Substituir campos livres sempre que possível.

Exemplos:

Tema

↓

Sugestões

Materiais

↓

Checkboxes

Data

↓

Calendário

Campo de Experiência

↓

Select

---

# UX05 – Sugestões pedagógicas

**Prioridade:** Alta

Disponibilizar sugestões compatíveis com a Educação Infantil.

Temas:

- Família
- Animais
- Corpo Humano
- Natureza
- Alimentação
- Cores
- Formas
- Água
- Primavera
- Folclore
- Meio Ambiente

Tipos de atividade:

- Pintura
- Colagem
- Musicalização
- Contação de História
- Exploração Sensorial
- Movimento Corporal
- Brincadeira Dirigida
- Experiências Sensoriais

---

# UX06 – MockProvider pedagogicamente coerente

**Prioridade:** Alta

Os textos simulados deverão variar conforme a faixa etária.

Exemplo:

## Berçário

- sons
- texturas
- exploração sensorial
- acolhimento
- vínculo

## Maternal I

- pintura
- música
- movimento
- manipulação
- brincadeiras simples

## Maternal II

- histórias
- colagem
- dramatização simples
- jogos

## Pré-escola

- rodas de conversa
- investigação
- desafios
- projetos

Evitar linguagem incompatível com cada faixa etária.

---

# UX07 – Reorganização das ações

**Prioridade:** Média

Os botões:

- Copiar Planejamento
- Exportar PDF

deverão ficar próximos ao título do planejamento.

Não devem competir visualmente com o conteúdo.

---

# UX08 – Página mais compacta

**Prioridade:** Média

Reduzir o comprimento da página.

Eliminar espaços excessivos.

O professor deverá visualizar boa parte do planejamento sem grande rolagem.

---

# UX09 – Melhorias na entrada de dados

**Prioridade:** Média

Adicionar componentes específicos.

Exemplos:

Data

↓

Date Picker

Materiais

↓

Autocomplete

Tema

↓

Autocomplete

---

# UX10 – Consistência visual

**Prioridade:** Média

Padronizar:

- títulos;
- ícones;
- bordas;
- espaçamentos;
- sombras;
- pesos tipográficos.

Toda a interface deverá transmitir simplicidade e acolhimento.

---

# UX11 – Personalização da Interface

**Prioridade:** Baixa

Adicionar alternância entre:

- Tema Claro
- Tema Escuro

Requisitos:

- disponível na tela inicial;
- persistir preferência do usuário;
- utilizar next-themes;
- respeitar o Design System.

---

# UX12 – Assistente Progressivo de Planejamento

**Prioridade:** Média

Transformar o formulário em um assistente (wizard), conduzindo o professor por etapas.

Fluxo:

### Etapa 1 — Sobre a Turma

- Turma
- Faixa Etária (automática)
- Turno
- Data

↓

### Etapa 2 — Sobre a Atividade

- Tema
- Tipo de Atividade
- Duração

↓

### Etapa 3 — Proposta Pedagógica

- Campo de Experiência
- Direitos de Aprendizagem
- Objetivo de Aprendizagem

↓

### Etapa 4 — Informações Adicionais

- Materiais
- Observações

↓

### Etapa 5 — Revisão

Resumo de todas as escolhas realizadas.

↓

### Etapa 6 — Planejamento Gerado

Exibição do planejamento.

Requisitos:

- indicador de progresso;
- validação por etapa;
- possibilidade de voltar;
- nenhuma perda de dados.

---

# UX13 – Integração Inteligente com a BNCC

**Prioridade:** Alta

O sistema deverá conduzir o professor utilizando relações previamente definidas pela BNCC.

Fluxo esperado:

Turma

↓

Faixa Etária (automática)

↓

Campos de Experiência compatíveis

↓

Direitos de Aprendizagem relacionados

↓

Sugestões de Objetivos de Aprendizagem

↓

Sugestões de Tipos de Atividade

↓

Sugestões de Materiais

↓

Planejamento Gerado

O professor poderá aceitar ou modificar qualquer sugestão.

Benefícios:

- menor tempo de preenchimento;
- maior aderência à BNCC;
- menor possibilidade de combinações incoerentes;
- apoio efetivo ao planejamento pedagógico.

---

# Critérios de Aceite

Os refinamentos serão considerados concluídos quando:

- o professor digitar significativamente menos informações;
- o sistema inferir automaticamente dados sempre que possível;
- o planejamento gerado possuir aparência de documento pedagógico;
- a navegação exigir menos cliques;
- o resultado ocupar menos espaço vertical;
- o MockProvider gerar conteúdos compatíveis com cada faixa etária;
- o fluxo respeitar a lógica natural de construção do planejamento;
- a interface transmitir simplicidade, acolhimento e segurança ao professor.