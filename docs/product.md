# EduAssist IA – Product

## 1. Descrição do produto

O EduAssist IA é um assistente inteligente de planejamento pedagógico para Educação Infantil. O produto ajuda o professor a organizar informações pedagógicas e gerar uma sugestão estruturada de plano de aula alinhada à BNCC.

O sistema não substitui a decisão pedagógica do professor. Ele entrega um rascunho organizado, editável e adaptável.

## 2. Proposta de valor

O EduAssist IA oferece valor ao:

* reduzir o esforço inicial de organização do plano de aula;
* estruturar informações pedagógicas em um formato claro;
* apoiar o alinhamento do planejamento à BNCC;
* permitir reaproveitamento do plano como rascunho editável;
* preservar a autonomia docente.

## 3. Público-alvo

Professores da Educação Infantil que precisam elaborar planejamentos pedagógicos e desejam apoio na organização inicial das informações.

## 4. Fluxo principal do produto

1. O usuário acessa o sistema;
2. Inicia um novo planejamento;
3. Preenche dados da turma e da proposta;
4. Seleciona elementos da BNCC;
5. Informa materiais e observações;
6. Solicita a geração do planejamento;
7. O sistema retorna uma sugestão estruturada;
8. O usuário revisa e edita;
9. O usuário copia ou exporta o planejamento.

## 5. Dados solicitados ao usuário

O formulário deverá solicitar:

* turma;
* faixa etária;
* turno;
* data ou período;
* tema;
* tipo de atividade;
* duração;
* direitos de aprendizagem;
* campo de experiência;
* objetivo de aprendizagem;
* materiais disponíveis;
* observações.

## 6. Saída esperada

O sistema deverá gerar um plano de aula com:

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

## 7. Modo demonstração

Na primeira versão, o produto deverá funcionar em modo demonstração, usando dados mocados para simular a geração do plano de aula.

Esse modo deve permitir apresentação funcional à banca sem necessidade de integração paga com API de IA.

## 8. Integração futura com IA

A estrutura do produto deve permitir a integração futura com um modelo real de IA. Para isso, a geração do planejamento deve ser isolada em um serviço interno, permitindo trocar o provedor mockado por um provedor real posteriormente.

## 9. Critérios de sucesso

O MVP será considerado bem-sucedido se:

* permitir o preenchimento do formulário;
* validar campos obrigatórios;
* gerar um plano estruturado;
* funcionar com respostas mocadas;
* permitir edição do plano;
* permitir copiar ou exportar o conteúdo;
* apresentar interface simples;
* manter o professor como responsável pela revisão final.
