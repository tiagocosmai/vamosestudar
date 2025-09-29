'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Assessment, Subject, ContentData } from '@/types'
import { adaptAssessmentData } from '@/utils/dataAdapter'
import contentData from '@/data/content.json'

export default function StudyCardsPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  useEffect(() => {
    const data = contentData as any
    const assessmentId = parseInt(params.id as string)
    const subjectId = parseInt(params.subjectId as string)
    
    const rawAssessment = data.assessments[assessmentId]
    if (rawAssessment) {
      const adaptedAssessment = adaptAssessmentData(rawAssessment)
      if (adaptedAssessment.subjects[subjectId]) {
        setAssessment(adaptedAssessment)
        setSubject(adaptedAssessment.subjects[subjectId] as Subject)
      }
    }
  }, [params.id, params.subjectId])

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

  const nextCard = () => {
    setCurrentCardIndex((prev) => 
      prev < subject.studyCards.length - 1 ? prev + 1 : 0
    )
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => 
      prev > 0 ? prev - 1 : subject.studyCards.length - 1
    )
  }

  const goToCard = (index: number) => {
    setCurrentCardIndex(index)
  }

  if (subject.studyCards.length === 0) {
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
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhum card de estudo disponível
          </h3>
          <p className="text-gray-500">
            Esta disciplina ainda não possui cards de estudo cadastrados.
          </p>
        </div>
      </div>
    )
  }

  const currentCard = subject.studyCards[currentCardIndex]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
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
          Cards de Estudo - {subject.name}
        </h1>
        <div className="mt-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {currentCardIndex + 1} de {subject.studyCards.length}
          </span>
        </div>
      </div>

      {/* Study Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 min-h-[400px] flex flex-col justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentCard.title}
          </h2>
          
          {/* Imagem do card, se houver */}
          {currentCard.imageSrc && (
            <div className="mb-6">
              <img
                src={currentCard.imageSrc}
                alt={currentCard.title}
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
              />
            </div>
          )}
          
          <div className="text-lg text-gray-700 leading-relaxed">
            {currentCard.description}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevCard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <div className="flex gap-2">
          {subject.studyCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCardIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/assessment/${params.id}/subject/${params.subjectId}/quiz`}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="font-semibold">Fazer Questões Simuladas</div>
          <div className="text-sm text-green-100 mt-1">
            Teste seus conhecimentos
          </div>
        </Link>

        {subject.supportMaterials.length > 0 && (
          <Link
            href={`/assessment/${params.id}/subject/${params.subjectId}/materials`}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="font-semibold">Materiais de Apoio</div>
            <div className="text-sm text-purple-100 mt-1">
              Recursos complementares
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
