# Unicesumar Compliance Implementation Plan

> **For agentic workers:** Execute inline with superpowers:executing-plans; tasks use checkbox tracking.

**Goal:** Integrar material de Compliance em nove temas na aplicação existente.
**Architecture:** Conteúdo estático no JSON atual; páginas opcionais em materiais de texto e explicações opcionais em questões. PDFs servidos de public/data/unicesumar.
**Tech Stack:** Next.js, React, TypeScript, Tailwind, JSON.
**Spec:** docs/superpowers/specs/2026-11-06-unicesumar-compliance-design.md

## Global Constraints

Preservar avaliações anteriores e índices. Não incluir dados pessoais. Usar somente os PDFs como base do conteúdo, sem inventar datas, graduação ou normas atuais. Trabalhar no checkout fornecido e preparar commits e pull request conforme autorização posterior do usuário; não mesclar nem publicar.

## Review Focus

- Temas em ordem numérica apesar da ordenação alfabética existente.
- Formato legado de questões e verdadeiro/falso com gabarito correto após adaptação.
- Explicações preservadas no simulado completo e por tema.
- PDFs locais com consulta e download e referências correspondentes.
- Materiais antigos sem páginas opcionais continuam funcionando.

## Task 1: Conteúdo e fontes

- [x] Criar nove temas com quinze flashcards, vinte questões comentadas e três páginas de resumo por tema em data/content.json.
- [x] Copiar PDFs para public/data/unicesumar e criar identificação visual local.
- [x] Validar dados, gabaritos, cobertura temática, referências e preservação do conteúdo anterior.

## Task 2: Leitura e correção

- [x] Estender types/index.ts e utils/dataAdapter.ts com páginas opcionais e explicações.
- [x] Implementar components/StudySummary.tsx e integrar na rota de materiais.
- [x] Separar abrir PDF de baixar PDF; exibir explicações nas duas rotas de quiz.
- [x] Verificar navegação de páginas, limites, correção e compatibilidade.

## Task 3: Verificação final

- [x] Rodar validação de conteúdo, TypeScript e build.
- [x] Revisar diff e testar respostas HTTP e interação no navegador quando disponível.
- [x] Documentar resultados e limitações; preparar a entrega por pull request sem publicar.

## Resultados

- `pnpm test`: quatro testes passaram, incluindo validação das 180 questões após adaptação.
- `pnpm exec tsc --noEmit`: passou.
- `pnpm build`: passou; avisos existentes de dados Browserslist/Baseline desatualizados, sem falha de compilação.
- Comparação estrutural com HEAD: as duas avaliações anteriores foram preservadas.
- SHA-256: os dois PDFs copiados são idênticos aos anexos.
- Chrome headless local: nove temas em ordem; navegação das 27 páginas e seus limites; flashcards; simulado de tema com 20/20 acertos; simulado geral com 18/18; comentários nas correções; PDFs completos com HTTP 200 e application/pdf; viewport de 390 px sem overflow e sem exceções JavaScript.
- Revisão independente: sem problemas acionáveis. Não houve revisão exaustiva de atribuição de cada frase nem teste assistivo com leitor de tela.
- A instalação disponibilizou as dependências, mas pnpm informou bloqueio do script opcional de unrs-resolver; isso não impediu testes, TypeScript ou build. Não foram alteradas as permissões de scripts.
- Implementação no checkout fornecido. Após aprovação do usuário, preparar branch, commits e pull request; manter sem merge ou publicação.
