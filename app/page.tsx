'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, BookOpen, GraduationCap, Filter } from 'lucide-react'
import { Assessment, ContentData } from '@/types'
import { adaptAssessmentData } from '@/utils/dataAdapter'
import contentData from '@/data/content.json'

export default function HomePage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [schoolFilter, setSchoolFilter] = useState<string>('')
  const [courseFilter, setCourseFilter] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  // Effect para marcar como cliente após hidratação
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const data = contentData as any
    const enabledAssessments = data.assessments
      .filter(assessment => assessment.enabled)
      .map(rawAssessment => adaptAssessmentData(rawAssessment))
      .sort((a, b) => new Date(a.examDate!).getTime() - new Date(b.examDate!).getTime())
    
    setAssessments(enabledAssessments)
    setFilteredAssessments(enabledAssessments)
  }, [])

  useEffect(() => {
    let filtered = assessments

    if (schoolFilter) {
      filtered = filtered.filter(assessment => 
        assessment.school.toLowerCase().includes(schoolFilter.toLowerCase())
      )
    }

    if (courseFilter) {
      filtered = filtered.filter(assessment => 
        assessment.course.toLowerCase().includes(courseFilter.toLowerCase())
      )
    }

    setFilteredAssessments(filtered)
  }, [schoolFilter, courseFilter, assessments])

  const schools = Array.from(new Set(assessments.map(a => a.school)))
  const courses = Array.from(new Set(assessments.map(a => a.course)))

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

  // Mostrar loading durante hidratação
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Vamos Estudar!!</h1>
          <p className="text-lg text-gray-600">Carregando avaliações...</p>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          📚 Vamos Estudar!!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plataforma de estudos com cards educativos, questões simuladas e materiais de apoio
        </p>
      </div>

      {/* Filters */}
      {assessments.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escola
              </label>
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as escolas</option>
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os cursos</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Section */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Calendário de Provas por Disciplina</h2>
        </div>
        
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {(() => {
            // Coletar todas as disciplinas de todas as avaliações filtradas
            const allSubjects: any[] = []
            filteredAssessments.forEach((assessment, assessmentIndex) => {
              if (Array.isArray(assessment.subjects)) {
                assessment.subjects.forEach((subject: any) => {
                  if (subject && (subject.name || subject.title) && subject.date) {
                    allSubjects.push({
                      name: subject.name || subject.title,
                      date: subject.date,
                      icon: subject.icon,
                      assessmentTitle: assessment.title,
                      assessmentIndex,
                      school: assessment.school
                    })
                  }
                })
              }
            })
            
            // Ordenar por data
            const sortedSubjects = allSubjects.sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            
            return sortedSubjects.map((subject, index) => (
              <Link
                key={index}
                href={`/assessment/${subject.assessmentIndex}`}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{subject.icon || '📖'}</span>
                  <div>
                    <span className="font-medium text-gray-800 group-hover:text-blue-600">
                      {subject.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      {subject.school} • {subject.assessmentTitle}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {formatDate(subject.date)}
                </span>
              </Link>
            ))
          })()}
        </div>
      </div> */}

      {/* Assessments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment, index) => (
          <Link
            key={index}
            href={`/assessment/${index}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Header with school logo */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={assessment.schoolLogo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOveLRTe9dYBTFGs85_vfvidPm43ZIjUJruQ&s'}
                    alt={assessment.school}
                    width={40}
                    height={40}
                    className="rounded-full bg-white p-1"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{assessment.school}</h3>
                    <p className="text-blue-100 text-sm">{assessment.course}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {assessment.title}
                </h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Data: {formatDate(assessment.examDate || '2024-12-01')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{Array.isArray(assessment.subjects) ? assessment.subjects.length : 0} disciplina(s)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{assessment.course}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Clique para estudar
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhuma avaliação encontrada
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou aguarde novas avaliações serem adicionadas.
          </p>
        </div>
      )}
    </div>
  )
}
