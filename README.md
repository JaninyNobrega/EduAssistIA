# EduAssist IA

Assistente inteligente para apoio à organização do planejamento pedagógico na Educação Infantil.

O **EduAssist IA** é um protótipo desenvolvido com o objetivo de apoiar professores na elaboração e organização de planejamentos pedagógicos, considerando elementos estruturantes da **Base Nacional Comum Curricular (BNCC)** para a Educação Infantil.

O sistema conduz o professor por um fluxo progressivo de planejamento, reduzindo o preenchimento manual e oferecendo sugestões contextualizadas de acordo com a turma, faixa etária e campo de experiência selecionados.

> **Status do projeto:** MVP funcional em fase de validação.

---

## Sobre o projeto

O EduAssist IA foi desenvolvido no contexto de uma pesquisa aplicada voltada à investigação do uso de tecnologias inteligentes como apoio ao planejamento pedagógico na Educação Infantil.

A proposta não busca substituir a atuação docente ou tomar decisões pedagógicas de forma autônoma. O sistema atua como **ferramenta de apoio**, permitindo que o professor revise, modifique e adapte todas as sugestões apresentadas conforme a realidade da turma.

Atualmente, o MVP utiliza dados estruturados e um provedor simulado (`MockProvider`) para geração dos planejamentos.

A arquitetura foi preparada para permitir futuramente a integração com provedores baseados em **Modelos de Linguagem de Grande Escala (LLMs)**, sem necessidade de alterar o fluxo principal da aplicação.

---

## Principais funcionalidades

### Assistente progressivo de planejamento

O formulário foi organizado como um wizard, conduzindo o professor pelas etapas:

1. Sobre a turma
2. Sobre a atividade
3. Proposta pedagógica
4. Informações adicionais
5. Revisão
6. Planejamento gerado

Os dados permanecem preservados durante a navegação entre as etapas.

### Integração estruturada com a BNCC

A aplicação utiliza relações previamente estruturadas para auxiliar o preenchimento do planejamento.

O fluxo considera:

```text
Turma
  ↓
Faixa etária
  ↓
Grupo etário de referência da BNCC
  ↓
Campo de experiência
  ↓
Direitos de aprendizagem sugeridos
  ↓
Objetivos de aprendizagem e desenvolvimento
  ↓
Tipos de atividade sugeridos
  ↓
Materiais sugeridos
```

As sugestões não são obrigatórias. O professor pode aceitar, remover ou modificar as informações apresentadas.

### Faixa etária automática

A faixa etária é inferida automaticamente a partir da turma selecionada, reduzindo a necessidade de preenchimento manual.

### Sugestões pedagógicas contextualizadas

O sistema apresenta sugestões de:

- direitos de aprendizagem;
- objetivos de aprendizagem e desenvolvimento;
- tipos de atividade;
- materiais.

As sugestões são contextualizadas de acordo com as informações selecionadas pelo professor.

### MockProvider adaptado à faixa etária

O conteúdo simulado varia conforme a faixa etária, evitando propostas incompatíveis com o desenvolvimento das crianças.

### Edição do planejamento

Após a geração, o professor pode editar o conteúdo do planejamento antes de utilizá-lo ou exportá-lo.

As alterações são mantidas em memória durante a sessão.

### Cópia do planejamento

O planejamento completo pode ser copiado para a área de transferência.

### Exportação em PDF

O sistema gera um documento pedagógico em PDF contendo:

- identificação;
- turma;
- faixa etária;
- data ou período;
- tema;
- campo de experiência;
- direitos de aprendizagem;
- objetivo de aprendizagem;
- vivência;
- metodologia;
- materiais;
- avaliação;
- adaptações;
- observação final.

### Tema claro e escuro

A interface oferece alternância entre tema claro e escuro, com persistência da preferência do usuário.

### Interface responsiva

O EduAssist IA foi desenvolvido para utilização em diferentes tamanhos de tela, incluindo computadores e dispositivos móveis.

---

## Arquitetura

A geração do planejamento utiliza uma arquitetura baseada em provedores:

```text
Interface
   ↓
POST /api/planning
   ↓
PlanningService
   ↓
PlanningProvider
   ↓
MockProvider
```

O contrato `PlanningProvider` desacopla a aplicação do mecanismo utilizado para geração.

Atualmente:

```text
PlanningProvider
       ↓
  MockProvider
```

Uma evolução futura poderá utilizar:

```text
PlanningProvider
       ↓
 OpenAIProvider
       ↓
      LLM
```

Essa estrutura permite substituir ou adicionar mecanismos de geração sem alterar o fluxo principal da aplicação.

---

## Uso atual de IA

Apesar do nome **EduAssist IA**, a versão atual do MVP **não realiza chamadas a uma LLM ou API externa de inteligência artificial**.

A geração é realizada pelo `MockProvider`, utilizando regras e conteúdos estruturados localmente.

Essa estratégia permite:

- desenvolver e validar o fluxo completo sem dependência de serviços pagos;
- realizar testes com dados sintéticos;
- avaliar a experiência do usuário;
- testar a estrutura do planejamento;
- preparar a arquitetura para integração futura com uma LLM.

A futura integração poderá combinar regras estruturadas da BNCC com geração textual por modelos de linguagem.

---

## Tecnologias

O projeto utiliza:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **next-themes**
- **Lucide React**
- **jsPDF**

---

## Estrutura principal

```text
src/
├── app/
│   ├── api/
│   │   └── planning/
│   ├── planejamento/
│   └── page.tsx
│
├── components/
│   ├── planning/
│   └── ui/
│
└── lib/
    ├── providers/
    │   ├── PlanningProvider.ts
    │   └── MockProvider.ts
    │
    ├── bncc-data.ts
    ├── PlanningService.ts
    ├── generatePdf.ts
    └── types.ts
```

---

## Como executar o projeto

### Pré-requisitos

É necessário possuir:

- Node.js
- npm
- Git

### Clonar o repositório

```bash
git clone https://github.com/JaninyNobrega/EduAssistIA.git
```

Entre na pasta:

```bash
cd EduAssistIA
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível, por padrão, em:

```text
http://localhost:3000
```

---

## Verificação técnica

Para verificar a qualidade estática do código:

```bash
npm run lint
```

Para gerar o build de produção:

```bash
npm run build
```

O MVP atual possui lint e build de produção validados.

---

## Dados e privacidade

A versão atual trabalha com **dados sintéticos e informações inseridas durante a utilização do formulário**.

O `MockProvider` não realiza chamadas a serviços externos para gerar o planejamento.

O projeto não depende de uma API externa de IA em sua versão atual.

---

## BNCC

O EduAssist IA utiliza uma base estruturada para relacionar elementos da Educação Infantil, incluindo:

- grupos etários;
- campos de experiências;
- direitos de aprendizagem;
- objetivos de aprendizagem e desenvolvimento;
- sugestões de atividades;
- sugestões de materiais.

Os objetivos utilizados como referência seguem a organização proposta pela **Base Nacional Comum Curricular (BNCC)**.

As relações de atividades e materiais apresentadas pelo sistema funcionam como **sugestões de apoio ao professor**, não como determinações normativas da BNCC.

---

## Limitações atuais

Por se tratar de um MVP de pesquisa, algumas limitações permanecem:

- geração baseada atualmente em `MockProvider`;
- ausência de integração ativa com LLM;
- uso de dados sintéticos;
- ausência de persistência permanente dos planejamentos;
- edições mantidas apenas durante a sessão;
- base BNCC utilizada de forma estruturada e delimitada ao escopo do protótipo;
- validação com usuários ainda pertencente às etapas de avaliação da pesquisa.

---

## Próximas etapas

As próximas etapas do projeto incluem:

- execução e documentação dos testes funcionais;
- validação do protótipo;
- avaliação da utilidade percebida e facilidade de uso;
- análise dos resultados da pesquisa;
- investigação de integração futura com LLM;
- ampliação da base estruturada utilizada pelo sistema.

---

## Contexto acadêmico

O EduAssist IA é desenvolvido como artefato tecnológico de uma pesquisa aplicada na área de tecnologia e educação.

A pesquisa investiga a viabilidade de uma solução computacional para apoiar a organização do planejamento pedagógico na Educação Infantil, mantendo o professor como responsável pelas decisões pedagógicas finais.

---

## Autoria

**Janiny Nóbrega**

Desenvolvimento de software e pesquisa aplicada.

---

## Aviso

O EduAssist IA é um protótipo de apoio ao planejamento.

As sugestões produzidas pelo sistema devem ser analisadas e adaptadas pelo professor de acordo com o contexto da instituição, as características da turma, os recursos disponíveis e os objetivos pedagógicos definidos.