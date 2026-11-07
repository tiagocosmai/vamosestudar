const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const output = ts.transpileModule(fs.readFileSync('utils/dataAdapter.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText
const sandbox = { exports: {} }
vm.runInNewContext(output, sandbox)
const { adaptAssessmentData } = sandbox.exports
const adapt = (questions, supportMaterials = []) => adaptAssessmentData({
  school: 'Unicesumar', title: 'Compliance', course: 'Compliance', examDate: null,
  enabled: true, order: 2,
  subjects: [{ title: '01. Conceito', cards: ['Conformidade'], questions, supportMaterials }]
}).subjects[0]

test('preserva explicação e fonte sem alterar alternativas e gabarito legado', () => {
  const subject = adapt([{
    description: 'Qual conduta é adequada?', type: 'multiple',
    responses: [{ description: 'Ignorar', isCorrect: 'false' }, { description: 'Verificar', isCorrect: 'true' }],
    explanation: 'A verificação permite avaliar o risco.', source: 'Livro, p. 120.'
  }])
  assert.equal(subject.questions[0].correctAnswer, 1)
  assert.equal(subject.questions[0].options[1], 'Verificar')
  assert.equal(subject.questions[0].explanation, 'A verificação permite avaliar o risco.')
  assert.equal(subject.questions[0].source, 'Livro, p. 120.')
})

test('preserva gabaritos verdadeiro e falso com comentários', () => {
  for (const answer of [true, false]) {
    const question = adapt([{
      description: 'Afirmação', type: 'true/false', explanation: 'Explicação do conceito.',
      responses: [{ description: 'Verdadeiro', isCorrect: answer }, { description: 'Falso', isCorrect: !answer }]
    }]).questions[0]
    assert.equal(question.correctAnswer, answer)
    assert.equal(question.type, 'boolean')
    assert.equal(question.explanation, 'Explicação do conceito.')
  }
})

test('preserva materiais antigos e resumos paginados sem inventar data de prova', () => {
  const materials = [{ title: 'Texto antigo', type: 'text', content: '<p>Texto</p>' },
    { title: 'Resumo', type: 'text', pages: [{ title: 'Conceito', content: '<p>Conformidade</p>' }] }]
  const subject = adapt([], materials)
  assert.equal(subject.supportMaterials[0].content, '<p>Texto</p>')
  assert.equal(subject.supportMaterials[1].pages[0].title, 'Conceito')
  assert.equal(adaptAssessmentData({ school: 'Unicesumar', subjects: [], examDate: null }).examDate, undefined)
})

test('integra nove temas, 135 flashcards, 180 gabaritos comentados e 27 páginas com PDFs locais', () => {
  const data = JSON.parse(fs.readFileSync('data/content.json', 'utf8'))
  const raw = data.assessments.find(item => item.school === 'Unicesumar')
  assert.ok(raw, 'Material da Unicesumar deve estar cadastrado')
  const assessment = adaptAssessmentData(raw)
  assert.equal(assessment.examDate, undefined)
  assert.equal(assessment.subjects.length, 9)
  const questions = new Set()
  let pageCount = 0
  for (const [index, subject] of assessment.subjects.entries()) {
    assert.ok(subject.name.startsWith(`${String(index + 1).padStart(2, '0')}.`))
    assert.equal(subject.studyCards.length, 15)
    assert.equal(subject.questions.length, 20)
    assert.equal(new Set(subject.studyCards.map(card => card.title)).size, 15)
    for (const question of subject.questions) {
      assert.ok(!questions.has(question.question), 'Enunciado duplicado: ' + question.question)
      questions.add(question.question)
      assert.ok(question.explanation?.length > 30, 'Comentário ausente: ' + question.question)
      assert.ok(question.source?.includes('livro Compliance'), 'Referência ausente')
      if (question.type === 'multiple') {
        assert.equal(question.options.length, 4)
        assert.equal(new Set(question.options).size, 4)
        assert.ok(Number.isInteger(question.correctAnswer))
        assert.ok(question.correctAnswer >= 0 && question.correctAnswer < 4)
      } else {
        assert.equal(typeof question.correctAnswer, 'boolean')
      }
    }
    const summary = subject.supportMaterials.find(item => item.pages)
    assert.equal(summary.pages.length, 3)
    pageCount += summary.pages.length
    for (const page of summary.pages) {
      assert.ok(page.title && page.content.length > 400)
    }
    const documents = subject.supportMaterials.filter(item => item.type === 'document')
    assert.equal(documents.length, 2)
    for (const document of documents) {
      assert.ok(document.url.startsWith('/data/unicesumar/'))
      assert.equal(fs.readFileSync('public' + document.url).subarray(0, 5).toString(), '%PDF-')
    }
    // Confere o gabarito após adaptação contra as respostas marcadas na fonte.
    raw.subjects[index].questions.forEach((question, questionIndex) => {
      const correct = question.responses.filter(option => option.isCorrect === true)
      assert.equal(correct.length, 1, question.description)
      const adapted = subject.questions[questionIndex]
      const actual = adapted.type === 'multiple'
        ? adapted.options[adapted.correctAnswer]
        : adapted.correctAnswer ? 'Verdadeiro' : 'Falso'
      assert.equal(actual, correct[0].description)
    })
  }
  assert.equal(questions.size, 180)
  assert.equal(pageCount, 27)
})
