'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, ExternalLink, Video, Download } from 'lucide-react'
import { Assessment, Subject, ContentData } from '@/types'
import { adaptAssessmentData } from '@/utils/dataAdapter'
import contentData from '@/data/content.json'

export default function SupportMaterialsPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    const data = contentData as ContentData
    const assessmentId = parseInt(params.id as string)
    const subjectId = parseInt(params.subjectId as string)
    
    const rawAssessment = data.assessments[assessmentId]
    if (rawAssessment) {
      const adaptedAssessment = adaptAssessmentData(rawAssessment)
      if (adaptedAssessment.subjects[subjectId]) {
        setAssessment(adaptedAssessment)
        setSubject(adaptedAssessment.subjects[subjectId])
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

  const getIconForMaterialType = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />
      case 'document':
        return <Download className="h-6 w-6" />
      case 'text':
        return <FileText className="h-6 w-6" />
      case 'link':
      default:
        return <ExternalLink className="h-6 w-6" />
    }
  }

  const getColorForMaterialType = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-600 hover:bg-red-700'
      case 'document':
        return 'bg-green-600 hover:bg-green-700'
      case 'text':
        return 'bg-purple-600 hover:bg-purple-700'
      case 'link':
      default:
        return 'bg-blue-600 hover:bg-blue-700'
    }
  }

  if (subject.supportMaterials.length === 0) {
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
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhum material de apoio disponível
          </h3>
          <p className="text-gray-500">
            Esta disciplina ainda não possui materiais de apoio cadastrados.
          </p>
        </div>
      </div>
    )
  }

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
          Materiais de Apoio - {subject.name}
        </h1>
        <div className="mt-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            {subject.supportMaterials.length} material(is) disponível(is)
          </span>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="space-y-6">
        {subject.supportMaterials.map((material, index) => {
          if (material.type === 'text') {
            // Renderizar material de texto como painel HTML
            return (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Text Material Header */}
                <div className="bg-purple-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6" />
                    <div>
                      <h3 className="font-bold text-lg">{material.title}</h3>
                      <p className="text-sm opacity-90">Conteúdo de Texto</p>
                    </div>
                  </div>
                </div>

                {/* Text Content Panel */}
                <div className="p-6">
                  <div 
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                               prose-headings:text-purple-800 prose-headings:font-semibold prose-headings:mb-2
                               prose-p:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed
                               prose-strong:text-purple-800 prose-strong:font-semibold
                               prose-ul:my-2 prose-li:mb-1 prose-li:text-gray-700
                               prose-ol:my-2 prose-blockquote:border-purple-200 prose-blockquote:bg-purple-50"
                    dangerouslySetInnerHTML={{ 
                      __html: material.content || material.url || 'Conteúdo não disponível'
                    }}
                  />
                </div>
              </div>
            )
          }

          // Renderizar outros tipos de material como cards
          return (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-md">
              {/* Material Header */}
              <div className={`p-4 text-white ${getColorForMaterialType(material.type)}`}>
                <div className="flex items-center gap-3">
                  {getIconForMaterialType(material.type)}
                  <div>
                    <h3 className="font-bold text-lg">{material.title}</h3>
                    <p className="text-sm opacity-90 capitalize">{material.type}</p>
                  </div>
                </div>
              </div>

              {/* Material Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {material.type === 'video' && 'Vídeo educativo para complementar seus estudos'}
                  {material.type === 'document' && 'Documento para download e consulta offline'}
                  {material.type === 'link' && 'Link externo com conteúdo complementar'}
                </p>

                {material.url && (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 text-white py-3 px-4 rounded-lg transition-colors ${getColorForMaterialType(material.type)}`}
                  >
                    {getIconForMaterialType(material.type)}
                    {material.type === 'video' && 'Assistir Vídeo'}
                    {material.type === 'document' && 'Baixar Documento'}
                    {material.type === 'link' && 'Acessar Link'}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/assessment/${params.id}/subject/${params.subjectId}/cards`}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="font-semibold">Cards de Estudo</div>
          <div className="text-sm text-blue-100 mt-1">
            Revisar conceitos importantes
          </div>
        </Link>

        <Link
          href={`/assessment/${params.id}/subject/${params.subjectId}/quiz`}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="font-semibold">Questões Simuladas</div>
          <div className="text-sm text-green-100 mt-1">
            Testar conhecimentos
          </div>
        </Link>
      </div>
    </div>
  )
}
