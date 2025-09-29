'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Brain, FileText, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { Assessment, Subject, ContentData } from '@/types'
import { adaptAssessmentData } from '@/utils/dataAdapter'
import contentData from '@/data/content.json'

export default function AssessmentPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false)
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set())

  // Effect para marcar como cliente após hidratação
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const data = contentData as ContentData
    const assessmentId = parseInt(params.id as string)
    const rawAssessment = data.assessments[assessmentId]
    
    if (rawAssessment) {
      const adaptedAssessment = adaptAssessmentData(rawAssessment)
      setAssessment(adaptedAssessment)
    }
  }, [params.id])

  // Mostrar loading durante hidratação
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Avaliação não encontrada</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    // Criar data de forma consistente para evitar problemas de timezone
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    })
  }

  const formatDateForCalendar = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    const dayMonth = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
    
    const weekDay = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      timeZone: 'America/Sao_Paulo'
    })
    
    return { dayMonth, weekDay }
  }

  // Sort subjects alphabetically
  const sortedSubjects = [...assessment.subjects].sort((a, b) => a.name.localeCompare(b.name))

  // Função para alternar expansão do conteúdo da disciplina
  const toggleSubjectContent = (originalIndex: number) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(originalIndex)) {
        newSet.delete(originalIndex)
      } else {
        newSet.add(originalIndex)
      }
      return newSet
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para início
      </Link>

      {/* Assessment Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <Image
            src={assessment.schoolLogo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOveLRTe9dYBTFGs85_vfvidPm43ZIjUJruQ&s'}
            alt={assessment.school}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {assessment.title}
            </h1>
            <div className="space-y-1 text-gray-600">
              <p className="text-lg font-medium">{assessment.school}</p>
              <p>{assessment.course}</p>
              <p>Data da prova: {formatDate(assessment.examDate || '2024-12-01')}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {assessment.anotherInfo && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Informações Importantes
              </h3>
            </div>
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                         prose-headings:text-blue-800 prose-headings:font-semibold prose-headings:mb-2
                         prose-p:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed
                         prose-strong:text-blue-800 prose-strong:font-semibold
                         prose-ul:my-2 prose-li:mb-1 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: assessment.anotherInfo
                  .replace(/<h3>([^<]+)<h3>/g, '<h4 class="font-semibold text-blue-800 mb-2">$1</h4>')
                  .replace(/<li>\s*<ul>/g, '<ul><li>')
                  .replace(/<\/ul>\s*<\/li>/g, '</li></ul>')
                  .replace(/\n/g, ' ')
              }}
            />
          </div>
        )}
      </div>

      {/* Calendário de Provas por Disciplina - Expansível */}
      <div className="bg-white rounded-lg shadow-md mb-8 border-l-4 border-red-500">
        {/* Header com botão de expandir/recolher */}
        <button
          onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Calendário de Provas por Disciplina
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({assessment.subjects.filter(subject => subject.date).length} {assessment.subjects.filter(subject => subject.date).length === 1 ? 'prova' : 'provas'})
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {isCalendarExpanded ? 'Recolher' : 'Expandir'}
              </span>
              {isCalendarExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        </button>
        
        {/* Conteúdo expansível */}
        {isCalendarExpanded && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Disciplina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessment.subjects
                      .filter(subject => subject.date) // Filtrar apenas disciplinas com data
                      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()) // Ordenar por data
                      .map((subject, index) => {
                        const { dayMonth, weekDay } = formatDateForCalendar(subject.date!)
                        return (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{dayMonth}</span>
                                <span className="text-sm text-gray-600 capitalize">{weekDay}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{subject.icon || '📖'}</span>
                                <span className="font-medium text-gray-800">
                                  {subject.name}
                                  {subject.name.toLowerCase() === 'redação' && (
                                    <span className="text-gray-600 font-normal"> (Entrega do Cartaz)</span>
                                  )}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                
                {assessment.subjects.filter(subject => subject.date).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma data de prova cadastrada para as disciplinas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href={`/assessment/${params.id}/quiz/all`}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-bold">Prova Completa</h3>
              <p className="text-purple-100">2 questões de cada disciplina</p>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-bold">{sortedSubjects.length} Disciplinas</h3>
              <p className="text-green-100">Escolha uma disciplina abaixo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedSubjects.map((subject, sortedIndex) => {
          // Encontrar o índice original da disciplina no array não ordenado
          const originalIndex = assessment.subjects.findIndex(s => s.name === subject.name)
          
          return (
          <div key={sortedIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Subject Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{subject.icon || '📖'}</span>
                <div>
                  <h3 className="text-xl font-bold">{subject.name}</h3>
                </div>
              </div>
            </div>

            {/* Subject Stats */}
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600">{subject.studyCards.length}</div>
                  <div className="text-gray-600">Cards</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{subject.questions.length}</div>
                  <div className="text-gray-600">Questões</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">{subject.supportMaterials.length}</div>
                  <div className="text-gray-600">Materiais</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-2">
              {/* Botão de Conteúdo da Disciplina - Expansível */}
              {subject.content && subject.content.trim() !== '' && subject.content !== `Conteúdo de ${subject.name}` && (
                <>
                  <button
                    onClick={() => toggleSubjectContent(originalIndex)}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Conteúdo da Disciplina
                    {expandedSubjects.has(originalIndex) ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>

                  {/* Conteúdo Expansível */}
                  {expandedSubjects.has(originalIndex) && (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="prose prose-sm max-w-none">
                        <div 
                          className="text-gray-700 leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: subject.content
                              .replace(/\n/g, '<br>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/^• (.*?)(?=<br>|$)/gm, '• $1')
                              .replace(/^  - (.*?)(?=<br>|$)/gm, '&nbsp;&nbsp;- $1')
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {subject.studyCards.length > 0 && (
                <Link
                  href={`/assessment/${params.id}/subject/${originalIndex}/cards`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Cards de Estudo
                </Link>
              )}

              {subject.questions.length > 0 && (
                <Link
                  href={`/assessment/${params.id}/subject/${originalIndex}/quiz`}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Questões Simuladas
                </Link>
              )}

              {subject.supportMaterials.length > 0 && (
                <Link
                  href={`/assessment/${params.id}/subject/${originalIndex}/materials`}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Materiais de Apoio
                </Link>
              )}
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
