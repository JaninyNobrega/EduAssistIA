# Especificação de Requisitos

**Projeto:** EduAssist IA
**Versão:** MVP 1.0

---

# 1. Objetivo

Desenvolver um sistema web que auxilie professores da Educação Infantil na organização do planejamento pedagógico por meio de uma sugestão estruturada de plano de aula alinhada à BNCC, preservando a autonomia docente.

---

# 2. Escopo do MVP

O MVP permitirá ao professor:

* iniciar um novo planejamento;
* preencher dados pedagógicos;
* gerar uma sugestão estruturada de plano de aula;
* editar o conteúdo gerado;
* copiar o planejamento.

Não fazem parte do MVP:

* login;
* cadastro de usuários;
* banco de dados;
* histórico de planejamentos;
* dashboards;
* relatórios;
* exportação em PDF;
* aplicativo mobile;
* integração real com OpenAI.

---

# 3. Campos do Formulário

## 3.1 Campos obrigatórios

* turma;
* faixa etária;
* tema;
* campo de experiência;
* pelo menos um direito de aprendizagem;
* objetivo de aprendizagem.

## 3.2 Campos opcionais

* turno;
* data ou período;
* duração;
* tipo de atividade;
* materiais disponíveis;
* observações do professor.

---

# 4. Requisitos Funcionais

## RF01 – Novo planejamento

O sistema deverá permitir iniciar um novo planejamento.

## RF02 – Preenchimento dos dados

O sistema deverá apresentar campos obrigatórios e opcionais conforme definido na seção 3.

## RF03 – Validação

O sistema deverá validar os campos obrigatórios antes da geração do planejamento.

## RF04 – Mensagem de erro

Se algum campo obrigatório não for preenchido, o sistema deverá informar quais campos precisam ser completados.

## RF05 – Gerar planejamento

O sistema deverá gerar uma sugestão estruturada de plano de aula com base nos dados informados.

## RF06 – Modo demonstração

O sistema deverá funcionar inicialmente com respostas mocadas, sem chamada para APIs externas.

## RF07 – Estado de carregamento

Durante a geração do planejamento, o sistema deverá exibir estado de carregamento e impedir múltiplos envios simultâneos.

## RF08 – Exibir planejamento

O sistema deverá apresentar o planejamento gerado em seções organizadas.

## RF09 – Editar planejamento

O professor deverá poder editar qualquer parte do planejamento gerado.

### RF10 – Compartilhar o planejamento

O sistema deverá permitir que o professor utilize o planejamento gerado por meio das opções de copiar o conteúdo ou exportá-lo em formato PDF.

**Critérios de aceitação:**

* O sistema deverá disponibilizar um botão para copiar todo o planejamento para a área de transferência.
* O sistema deverá disponibilizar um botão para exportar o planejamento em formato PDF.
* O conteúdo copiado e o arquivo PDF deverão conter todas as informações exibidas no planejamento.
* A exportação em PDF deverá ocorrer localmente, sem dependência de serviços externos.

## RF11 – Integração futura com OpenAI

O sistema deverá permitir substituir o provedor mocado por um provedor real da OpenAI sem alterar a interface.

---

# 5. Estrutura da Resposta

O planejamento gerado deverá conter:

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

# 6. Contrato da Resposta

O serviço de geração deverá retornar um objeto com a seguinte estrutura:

```json
{
  "identificacao": "string",
  "turma": "string",
  "faixaEtaria": "string",
  "tema": "string",
  "campoExperiencia": "string",
  "direitosAprendizagem": ["string"],
  "objetivoAprendizagem": "string",
  "vivenciaAprendizagem": "string",
  "metodologia": ["string"],
  "materiaisNecessarios": ["string"],
  "avaliacaoObservacao": "string",
  "adaptacoesPossiveis": ["string"],
  "observacaoFinal": "string"
}
```

O `MockProvider` e o futuro `OpenAIProvider` deverão retornar a mesma estrutura.

---

# 7. Requisitos Não Funcionais

## RNF01 – Usabilidade

A interface deverá ser simples, clara e adequada para usuários sem conhecimento técnico.

## RNF02 – Responsividade

A interface deverá funcionar em desktop e dispositivos móveis.

## RNF03 – Baixo acoplamento

A lógica de geração deverá ficar separada da interface.

## RNF04 – Manutenibilidade

A arquitetura deverá permitir evolução futura sem reescrever o fluxo principal.

---

# 8. Regras de Negócio

## RB01 – Apoio docente

O sistema apoia o professor, mas não substitui decisões pedagógicas.

## RB02 – Edição obrigatória

Todo planejamento gerado deverá ser editável.

## RB03 – BNCC

O planejamento deverá considerar os elementos da BNCC informados pelo usuário.

## RB04 – Não avaliação da criança

O sistema não deverá avaliar crianças nem gerar diagnósticos.

---

# 9. Modo Demonstração

Durante o MVP, o sistema utilizará `MockProvider`.

O `MockProvider` deverá:

* retornar planejamentos simulados;
* seguir o contrato definido na seção 6;
* funcionar sem chave de API;
* permitir apresentação funcional à banca.

---

# 10. Integração futura

Após aprovação da banca, poderá ser criado um `OpenAIProvider`.

A troca deverá ocorrer apenas na camada de serviço de geração.

A interface, os campos do formulário e a estrutura da resposta deverão permanecer iguais.

---

# 11. Critérios de Sucesso

O MVP será considerado concluído quando:

* o formulário funcionar;
* os campos obrigatórios forem validados;
* o sistema gerar planejamento mocado;
* o planejamento seguir a estrutura definida;
* o usuário puder editar o resultado;
* o usuário puder copiar o conteúdo;
* o sistema estiver preparado para futura integração com OpenAI.
