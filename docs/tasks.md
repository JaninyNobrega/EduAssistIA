# Plano de Implementação – EduAssist IA MVP

**Projeto:** EduAssist IA
**Versão:** MVP 1.0
**Referência:** requirements.md · design.md

---

## Convenções

- Cada tarefa é autossuficiente e referencia o(s) requisito(s) que implementa.
- A ordem é sequencial: cada grupo depende do anterior.
- "Pronto" = código funcionando + sem erros de lint/build.

---

## Grupo 0 – Preparação do ambiente

### T00 – Preparar o ambiente de desenvolvimento
Antes de qualquer modelagem ou código de produto, garantir que o ambiente local está funcional.

Passos:
1. Confirmar que Node.js está instalado (`node -v` / `npm -v`).
2. Confirmar que as dependências do projeto estão instaladas (`npm install`).
3. Verificar que o TypeScript está configurado (`tsconfig.json` presente e sem erros).
4. Verificar que o Tailwind CSS está configurado (`tailwind.config.*` e diretiva `@tailwind` no CSS global).
5. Executar o projeto pela primeira vez (`npm run dev`) e acessar `http://localhost:3000`.
6. Confirmar que a página inicial carrega sem erros no terminal e no browser.

**Critério de conclusão:** `npm run dev` sobe sem erros e a página padrão do Next.js (ou a página atual do projeto) é exibida no browser.
**Requisito:** base para todos os demais grupos.

---

## Grupo 1 – Configuração do projeto

### T01 – Verificar estrutura inicial do Next.js
Confirmar que o projeto Next.js está criado com App Router, Tailwind CSS e shadcn/ui configurados.
Verificar que `app/`, `components/`, `lib/` e `styles/` existem e que `npm run dev` sobe sem erros.
**Requisito:** base para todos os demais.

### T02 – Definir tipos TypeScript do domínio
Criar `lib/types.ts` com as interfaces:
- `PlanningFormData` — campos do formulário (obrigatórios e opcionais, seção 3 do requirements).
- `PlanningResult` — contrato da resposta definido na seção 6 do requirements.
**Requisito:** RF02, RF05, RF11 (contrato compartilhado entre MockProvider e OpenAIProvider).

---

## Grupo 2 – Camada de serviço

### T03 – Criar interface do provedor de geração
Criar `lib/providers/PlanningProvider.ts` com a interface/tipo `PlanningProvider`:
```ts
interface PlanningProvider {
  generate(data: PlanningFormData): Promise<PlanningResult>
}
```
Essa interface será o contrato que tanto o MockProvider quanto o futuro OpenAIProvider deverão implementar.
**Requisito:** RF11, RNF03.

### T04 – Implementar o MockProvider
Criar `lib/providers/MockProvider.ts` implementando `PlanningProvider`.
O método `generate` deverá ignorar o delay real e retornar um objeto `PlanningResult` fixo, mas pedagogicamente coerente, seguindo exatamente o contrato da seção 6 do requirements.
O mock deve incluir dados realistas de Educação Infantil (turma, tema, campo de experiência da BNCC etc.).
**Requisito:** RF06, RF08, seção 9 do requirements.

### T05 – Implementar o PlanningService
Criar `lib/PlanningService.ts`.
O serviço deverá:
- receber `PlanningFormData`;
- usar o provedor injetado (por ora, `MockProvider`);
- retornar `PlanningResult`.

A injeção do provedor deverá ser feita por parâmetro ou variável de ambiente, de forma que trocar para `OpenAIProvider` no futuro não exija mudança na interface.
**Requisito:** RF05, RF11, RNF03, RNF04.

### T06 – Criar API Route de geração
Criar `app/api/planning/route.ts` (POST).
A rota deverá:
- receber o body com `PlanningFormData`;
- chamar `PlanningService`;
- retornar o `PlanningResult` como JSON.

Nenhuma chamada externa deve ocorrer nesta etapa.
**Requisito:** RF05, RF06.

---

## Grupo 3 – Formulário

### T07 – Criar página principal com botão de início
Criar `app/page.tsx` com:
- apresentação mínima do sistema (nome, descrição breve);
- botão "Novo Planejamento" que navega para o formulário.
**Requisito:** RF01.

### T08 – Criar página do formulário
Criar `app/planejamento/page.tsx` com o formulário dividido em seções visuais:
- **Dados da turma:** turma (obrigatório), faixa etária (obrigatório), turno (opcional), data/período (opcional).
- **Proposta pedagógica:** tema (obrigatório), campo de experiência (obrigatório), direitos de aprendizagem (obrigatório — pelo menos um), objetivo de aprendizagem (obrigatório).
- **Detalhes:** tipo de atividade (opcional), duração (opcional), materiais disponíveis (opcional), observações (opcional).

Usar componentes do shadcn/ui (Input, Textarea, Select, Checkbox ou similar para direitos de aprendizagem).
O estado do formulário deverá ser gerenciado localmente com `useState`.
**Requisito:** RF02, RNF01, RNF02.

### T09 – Implementar validação dos campos obrigatórios
No submit do formulário, validar que os 6 campos obrigatórios estão preenchidos (incluindo pelo menos um direito de aprendizagem).
Exibir mensagem de erro inline em cada campo faltante, sem submeter para a API.
**Requisito:** RF03, RF04.

---

## Grupo 4 – Geração e exibição do planejamento

### T10 – Integrar formulário com a API Route
Ao submeter o formulário (após validação aprovada):
- chamar `POST /api/planning` com os dados;
- exibir estado de carregamento (spinner ou mensagem) e desabilitar o botão de gerar;
- ao receber a resposta, navegar ou rolar para a área de exibição do planejamento.
**Requisito:** RF05, RF07.

### T11 – Criar componente de exibição do planejamento
Criar `components/PlanningResult.tsx`.
Exibir cada campo do `PlanningResult` em seções separadas com título visível:
- Identificação
- Turma / Faixa Etária / Tema
- Campo de Experiência
- Direitos de Aprendizagem (lista)
- Objetivo de Aprendizagem
- Vivência de Aprendizagem
- Metodologia (lista)
- Materiais Necessários (lista)
- Avaliação por Observação
- Adaptações Possíveis (lista)
- Observação Final

**Requisito:** RF08, seção 5 do requirements.

---

## Grupo 5 – Edição do planejamento

### T12 – Tornar cada seção do planejamento editável
No componente `PlanningResult`, adicionar modo de edição por seção:
- Ao clicar em uma seção (ou botão "Editar"), o conteúdo troca para um `<textarea>` ou `<input>` editável.
- Ao confirmar, o valor é salvo no estado local e exibido de volta em modo leitura.
- Nenhuma persistência em banco é necessária — apenas estado em memória.
**Requisito:** RF09, RB02.

---

## Grupo 6 – Copiar e exportar

### T13 – Implementar botão de copiar
Adicionar botão "Copiar planejamento" na área de resultado.
Ao clicar, formatar todo o conteúdo do `PlanningResult` como texto simples e copiá-lo para a área de transferência via `navigator.clipboard.writeText`.
Exibir confirmação visual (toast ou texto temporário "Copiado!").
**Requisito:** RF10.

### T14 – Implementar exportação em PDF
Adicionar botão "Exportar PDF".
Usar uma biblioteca client-side (ex.: `jsPDF` ou `html2canvas` + `jsPDF`) para gerar o PDF localmente, sem dependência de serviço externo.
O PDF deverá conter todas as seções exibidas no planejamento.
**Requisito:** RF10.

---

## Grupo 7 – Qualidade e encerramento do MVP

### T15 – Revisar responsividade
Testar o formulário e a tela de resultado em larguras de tela mobile (≤ 768px) e desktop (≥ 1024px).
Ajustar classes Tailwind onde necessário.
**Requisito:** RNF02.

### T16 – Revisar acessibilidade básica
Verificar que todos os campos do formulário têm `<label>` associado.
Garantir que mensagens de erro são lidas por leitores de tela (atributo `role="alert"` ou `aria-live`).
Verificar contraste mínimo dos textos.
**Requisito:** RNF01.

### T17 – Validação final do fluxo completo
Executar o fluxo de ponta a ponta manualmente:
1. Abrir tela inicial → clicar "Novo Planejamento".
2. Preencher apenas campos obrigatórios → verificar erros nos opcionais ausentes (não deve ter).
3. Submeter sem preencher um campo obrigatório → verificar mensagem de erro.
4. Preencher tudo → gerar → verificar loading → ver planejamento.
5. Editar uma seção → confirmar edição.
6. Copiar → verificar clipboard.
7. Exportar PDF → verificar arquivo gerado.

Registrar resultado de cada passo. Corrigir eventuais falhas antes de considerar o MVP concluído.
**Requisito:** seção 11 do requirements (Critérios de Sucesso).

---

## Resumo das tarefas

| ID  | Descrição                                      | Grupo           |
|-----|------------------------------------------------|-----------------|
| T00 | Preparar o ambiente de desenvolvimento         | Preparação      |
| T01 | Verificar estrutura do Next.js                 | Configuração    |
| T02 | Tipos TypeScript do domínio                    | Configuração    |
| T03 | Interface PlanningProvider                     | Serviço         |
| T04 | MockProvider                                   | Serviço         |
| T05 | PlanningService                                | Serviço         |
| T06 | API Route POST /api/planning                   | Serviço         |
| T07 | Página inicial com botão de início             | Formulário      |
| T08 | Página do formulário com todos os campos       | Formulário      |
| T09 | Validação dos campos obrigatórios              | Formulário      |
| T10 | Integração formulário → API Route              | Geração         |
| T11 | Componente de exibição do planejamento         | Geração         |
| T12 | Edição inline de cada seção                    | Edição          |
| T13 | Botão copiar para clipboard                    | Compartilhamento|
| T14 | Exportação em PDF                              | Compartilhamento|
| T15 | Responsividade                                 | Qualidade       |
| T16 | Acessibilidade básica                          | Qualidade       |
| T17 | Validação final do fluxo completo              | Qualidade       |
