'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Assessment, Subject, Question, QuizResult, ContentData } from '@/types'
import { adaptAssessmentData } from '@/utils/dataAdapter'
import { QUIZ_CONFIG, getQuestionCount, getQuestionOptions } from '@/utils/quizConfig'
import contentData from '@/data/content.json'

export default function SubjectQuizPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | boolean | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showQuestionSelector, setShowQuestionSelector] = useState(true)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE)

  // Effect para marcar como cliente após hidratação
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const data = contentData as any
    const assessmentId = parseInt(params.id as string)
    const subjectId = parseInt(params.subjectId as string)
    
    const rawAssessment = data.assessments[assessmentId]
    if (rawAssessment) {
      const adaptedAssessment = adaptAssessmentData(rawAssessment)
      if (adaptedAssessment.subjects[subjectId]) {
        const subjectData = adaptedAssessment.subjects[subjectId]
        setAssessment(adaptedAssessment)
        setSubject(subjectData)
      }
    }
  }, [params.id, params.subjectId])

  // Effect para ajustar selectedQuestionCount baseado no número de questões disponíveis
  useEffect(() => {
    if (subject && subject.questions) {
      const maxAvailable = subject.questions.length
      const defaultCount = Math.min(QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE, maxAvailable)
      setSelectedQuestionCount(defaultCount)
    }
  }, [subject])

  // Effect separado para randomização após hidratação
  useEffect(() => {
    if (isClient && subject && subject.questions && subject.questions.length > 0 && !showQuestionSelector) {
      const questions = subject.questions
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      const questionCount = getQuestionCount(
        questions.length,
        QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE,
        selectedQuestionCount
      )
      const selectedQuestions = shuffled.slice(0, questionCount)
      
      setQuizQuestions(selectedQuestions)
      setUserAnswers(new Array(selectedQuestions.length).fill(null))
    }
  }, [isClient, subject, showQuestionSelector, selectedQuestionCount])

  const handleAnswer = (answer: number | boolean) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const submitQuiz = () => {
    let correctAnswers = 0
    const results = quizQuestions.map((question, index) => {
      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctAnswers++
      
      return {
        question,
        userAnswer: userAnswer!,
        isCorrect
      }
    })

    const result: QuizResult = {
      score: correctAnswers,
      totalQuestions: quizQuestions.length,
      percentage: (correctAnswers / quizQuestions.length) * 100,
      answers: results
    }

    setQuizResult(result)
    setShowResults(true)
  }

  const restartQuiz = () => {
    setShowQuestionSelector(true)
    setShowResults(false)
    setQuizResult(null)
    setCurrentQuestionIndex(0)
  }

  const startQuiz = () => {
    setShowQuestionSelector(false)
  }

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment || !subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Conteúdo não encontrado</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  if (subject.questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/assessment/${params.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para disciplinas
        </Link>

        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhuma questão disponível
          </h3>
          <p className="text-gray-500">
            Esta disciplina ainda não possui questões cadastradas.
          </p>
        </div>
      </div>
    )
  }

  if (showResults && quizResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href={`/assessment/${params.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para disciplinas
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Resultado do Quiz - {subject.name}
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-6xl font-bold mb-4">
              {quizResult.percentage >= 70 ? (
                <span className="text-green-600">{quizResult.percentage.toFixed(1)}</span>
              ) : quizResult.percentage >= 50 ? (
                <span className="text-yellow-600">{quizResult.percentage.toFixed(1)}</span>
              ) : (
                <span className="text-red-600">{quizResult.percentage.toFixed(1)}</span>
              )}
            </div>
            
            <div className="text-xl text-gray-600 mb-4">
              {quizResult.score} de {quizResult.totalQuestions} questões corretas
            </div>
            
            <div className="text-lg">
              {quizResult.percentage >= 70 ? (
                <span className="text-green-600 font-semibold">Excelente! 🎉</span>
              ) : quizResult.percentage >= 50 ? (
                <span className="text-yellow-600 font-semibold">Bom trabalho! 👍</span>
              ) : (
                <span className="text-red-600 font-semibold">Continue estudando! 📚</span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4 mb-8">
          {quizResult.answers.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {result.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Questão {index + 1}: {result.question.question}
                  </h3>
                  
                  {result.question.type === 'multiple' && result.question.options && (
                    <div className="space-y-2">
                      {result.question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === result.question.correctAnswer
                              ? 'bg-green-100 text-green-800 font-semibold'
                              : optionIndex === result.userAnswer
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option}
                          {optionIndex === result.question.correctAnswer && ' ✓'}
                          {optionIndex === result.userAnswer && optionIndex !== result.question.correctAnswer && ' ✗'}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {result.question.type === 'boolean' && (
                    <div className="space-y-2">
                      <div className={`p-2 rounded ${
                        result.question.correctAnswer === true
                          ? 'bg-green-100 text-green-800 font-semibold'
                          : result.userAnswer === true
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50'
                      }`}>
                        Verdadeiro
                        {result.question.correctAnswer === true && ' ✓'}
                        {result.userAnswer === true && result.question.correctAnswer !== true && ' ✗'}
                      </div>
                      <div className={`p-2 rounded ${
                        result.question.correctAnswer === false
                          ? 'bg-green-100 text-green-800 font-semibold'
                          : result.userAnswer === false
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50'
                      }`}>
                        Falso
                        {result.question.correctAnswer === false && ' ✓'}
                        {result.userAnswer === false && result.question.correctAnswer !== false && ' ✗'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Fazer Novo Quiz
          </button>
        </div>
      </div>
    )
  }

  // Tela de seleção de questões (PRIMEIRO - antes de verificar quizQuestions)
  if (showQuestionSelector && subject && subject.questions && subject.questions.length > 0) {
    const questionOptions = getQuestionOptions(subject.questions.length)
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href={`/assessment/${params.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para disciplinas
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz - {subject.name}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Configurar Quiz
            </h2>
            <p className="text-gray-600">
              Escolha quantas questões deseja responder (disponíveis: {subject.questions.length})
            </p>
          </div>

          {/* Botões de seleção rápida */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleção rápida:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setSelectedQuestionCount(Math.min(QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE, subject.questions.length))}
                className={`p-3 rounded-lg border-2 transition-colors font-medium ${
                  selectedQuestionCount === Math.min(QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE, subject.questions.length)
                    ? 'border-blue-600 bg-blue-100 text-blue-900'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                }`}
              >
                Padrão<br />
                <span className="text-lg font-bold">
                  {Math.min(QUIZ_CONFIG.MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE, subject.questions.length)}
                </span>
              </button>
              
              <button
                onClick={() => setSelectedQuestionCount(subject.questions.length)}
                className={`p-3 rounded-lg border-2 transition-colors font-medium ${
                  selectedQuestionCount === subject.questions.length
                    ? 'border-green-600 bg-green-100 text-green-900'
                    : 'border-gray-300 hover:border-green-300 hover:bg-green-50 text-gray-700'
                }`}
              >
                Todas<br />
                <span className="text-lg font-bold">{subject.questions.length}</span>
              </button>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Personalizado:</span>
                <select
                  value={selectedQuestionCount}
                  onChange={(e) => setSelectedQuestionCount(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white font-medium"
                >
                  {questionOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-gray-800 bg-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={startQuiz}
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              🚀 Iniciar Quiz com {selectedQuestionCount} {selectedQuestionCount === 1 ? 'questão' : 'questões'}
            </button>
            
            <div className="text-sm text-gray-500">
              💡 Dica: Use o padrão para uma revisão rápida ou todas as questões para um estudo completo
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const allAnswered = userAnswers.every(answer => answer !== null)

  // Verificar se há questões carregadas
  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/assessment/${params.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para disciplinas
        </Link>

        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Verificar se a questão atual existe
  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/assessment/${params.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para disciplinas
        </Link>

        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Erro ao carregar questão
          </h3>
          <p className="text-gray-500">
            Tente recarregar a página ou volte para as disciplinas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href={`/assessment/${params.id}`}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para disciplinas
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quiz - {subject.name}
        </h1>
        
        <div className="mt-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Questão {currentQuestionIndex + 1} de {quizQuestions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === 'multiple' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-blue-600 bg-blue-100 text-blue-900 shadow-md'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-800 hover:text-gray-900'
                }`}
              >
                <span className="font-bold text-lg mr-3 text-blue-600">
                  {String.fromCharCode(65 + index)})
                </span>
                <span className="text-base font-medium">
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'boolean' && (
          <div className="space-y-3">
            <button
              onClick={() => handleAnswer(true)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                userAnswers[currentQuestionIndex] === true
                  ? 'border-green-600 bg-green-100 text-green-900 shadow-md'
                  : 'border-gray-300 hover:border-green-300 hover:bg-green-50 text-gray-800 hover:text-gray-900'
              }`}
            >
              <span className="text-2xl mr-3">✓</span>
              <span className="text-base font-medium">Verdadeiro</span>
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                userAnswers[currentQuestionIndex] === false
                  ? 'border-red-600 bg-red-100 text-red-900 shadow-md'
                  : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-800 hover:text-gray-900'
              }`}
            >
              <span className="text-2xl mr-3">✗</span>
              <span className="text-base font-medium">Falso</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>

        <div className="flex gap-2">
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : userAnswers[index] !== null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quizQuestions.length - 1 ? (
          <button
            onClick={submitQuiz}
            disabled={!allAnswered}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Finalizar Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Próxima
          </button>
        )}
      </div>

      {/* Submit Button (always visible) */}
      {allAnswered && (
        <div className="text-center">
          <button
            onClick={submitQuiz}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Corrigir e Ver Resultado
          </button>
        </div>
      )}
    </div>
  )
}
