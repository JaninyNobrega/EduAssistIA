# Design do Sistema

**Projeto:** EduAssist IA
**Versão:** MVP 1.0

---

# 1. Visão Geral

O EduAssist IA é um sistema web que apoia professores da Educação Infantil na organização de planos de aula alinhados à BNCC.

Nesta versão, o sistema funcionará em modo demonstração, usando dados mocados para simular a geração do planejamento.

---

# 2. Fluxo Principal

```text
Tela Inicial
↓
Novo Planejamento
↓
Preenchimento do Formulário
↓
Validação dos Campos
↓
Serviço de Geração
↓
MockProvider
↓
Planejamento Gerado
↓
Edição
↓
Cópia
```

---

# 3. Formulário

## Campos obrigatórios

* turma;
* faixa etária;
* tema;
* campo de experiência;
* direitos de aprendizagem;
* objetivo de aprendizagem.

## Campos opcionais

* turno;
* data ou período;
* duração;
* tipo de atividade;
* materiais disponíveis;
* observações do professor.

---

# 4. Arquitetura do MVP

```text
Interface Web
↓
PlanningService
↓
MockProvider
↓
Objeto de Planejamento
↓
Editor de Planejamento
```

A interface não deverá chamar diretamente a OpenAI nem qualquer API externa.

---

# 5. Serviço de Geração

O `PlanningService` será responsável por:

* receber os dados do formulário;
* validar ou encaminhar dados já validados;
* chamar o provedor de geração;
* retornar o planejamento estruturado para a interface.

---

# 6. MockProvider

O `MockProvider` será responsável por:

* simular a resposta da IA;
* retornar um planejamento estruturado;
* seguir o mesmo contrato previsto para a futura integração real;
* permitir apresentação do MVP sem custo.

---

# 7. Integração futura com OpenAI

Após aprovação da banca, o `MockProvider` poderá ser substituído por um `OpenAIProvider`.

Fluxo futuro:

```text
Interface Web
↓
PlanningService
↓
OpenAIProvider
↓
Objeto de Planejamento
↓
Editor de Planejamento
```

A troca deverá ocorrer sem alteração na interface.

---

# 8. Estrutura do Planejamento

O planejamento será exibido com:

* identificação;
* turma;
* faixa etária;
* tema;
* campo de experiência;
* direitos de aprendizagem;
* objetivo de aprendizagem;
* vivência de aprendizagem;
* metodologia;
* materiais necessários;
* avaliação por observação;
* adaptações possíveis;
* observação final.

---

# 9. Estado de Carregamento

Durante a geração, o sistema deverá:

* exibir mensagem de carregamento;
* desabilitar o botão de gerar;
* evitar múltiplos envios simultâneos.

---

# 10. Tecnologias

* Next.js;
* React;
* Tailwind CSS;
* shadcn/ui;
* API Routes do Next.js.

---

# 11. Fora do MVP

Não serão implementados nesta etapa:

* login;
* banco de dados;
* histórico;
* dashboard;
* integração real com OpenAI.

---

# 12. Evolução Futura

O sistema poderá evoluir para:

* integração com OpenAI;
* histórico de planejamentos;
* biblioteca de atividades;
* personalização por instituição;
* adaptação para Ensino Fundamental;
* adaptação para Ensino Médio;
* adaptação para Ensino Técnico;
* adaptação para o SENAC.
