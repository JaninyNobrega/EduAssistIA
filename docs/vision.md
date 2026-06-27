# EduAssist IA – Vision

## 1. Visão geral

O EduAssist IA é um sistema web baseado em inteligência artificial para apoiar professores da Educação Infantil na organização do planejamento pedagógico.

O sistema tem como foco gerar sugestões estruturadas de planos de aula alinhadas à BNCC, a partir de informações fornecidas pelo professor, como turma, faixa etária, tema, campo de experiência, direitos de aprendizagem, objetivo de aprendizagem, duração, materiais disponíveis e observações.

## 2. Problema

Professores da Educação Infantil precisam organizar planejamentos pedagógicos de forma recorrente, considerando elementos como BNCC, faixa etária, objetivos, metodologias, vivências, materiais e avaliação por observação.

Esse processo pode demandar tempo significativo e exigir organização de múltiplas informações. O EduAssist IA busca apoiar essa organização inicial, oferecendo uma sugestão estruturada que o professor poderá revisar, adaptar e utilizar como rascunho.

## 3. Objetivo do MVP

O objetivo do MVP é validar a viabilidade técnica e funcional de um assistente de planejamento pedagógico capaz de:

* receber parâmetros pedagógicos informados pelo professor;
* organizar esses dados em uma estrutura coerente;
* gerar uma sugestão de plano de aula para Educação Infantil;
* permitir revisão, edição e reaproveitamento do conteúdo gerado;
* preservar a autonomia docente.

## 4. Usuário principal

O usuário principal é o professor da Educação Infantil.

O sistema deve considerar que esse usuário pode não possuir conhecimento técnico avançado, por isso a interface deve ser simples, clara e objetiva.

## 5. Princípios do produto

O EduAssist IA deve:

* apoiar o professor, não substituí-lo;
* respeitar a BNCC;
* usar linguagem clara e acessível;
* priorizar ludicidade, interação e experiências concretas;
* evitar julgamento sobre práticas pedagógicas;
* permitir que o professor edite e adapte o planejamento;
* funcionar inicialmente com dados simulados/mocados, sem depender de integração paga com IA;
* manter a arquitetura pronta para integração futura com um modelo de linguagem real.

## 6. Escopo do MVP

O MVP terá apenas o fluxo essencial:

1. Tela inicial;
2. Formulário de planejamento;
3. Geração de sugestão de plano de aula;
4. Visualização do resultado;
5. Edição do conteúdo gerado;
6. Cópia ou exportação simples.

## 7. Fora do escopo do MVP

Nesta primeira versão, o sistema não terá:

* login;
* cadastro de usuários;
* histórico de planejamentos;
* dashboard;
* banco de dados robusto;
* avaliação individual de crianças;
* relatórios pedagógicos;
* integração com sistemas externos;
* aplicativo mobile nativo.

## 8. Estratégia de IA

Durante a primeira etapa do desenvolvimento, o sistema deverá funcionar com respostas simuladas/mocadas para permitir apresentação e validação funcional sem custo de integração com API de IA.

A arquitetura deve permitir a substituição futura do provedor simulado por um provedor real de IA, sem alterar o fluxo principal da interface.

## 9. Evolução futura

Em versões futuras, o EduAssist IA poderá ser expandido para:

* integração com modelos reais de IA;
* planejamento semanal e bimestral;
* histórico de planejamentos;
* biblioteca de atividades;
* exportação avançada;
* personalização por instituição;
* adaptação para outros níveis de ensino, incluindo Ensino Fundamental, Ensino Médio, Ensino Técnico e cursos do SENAC.
