import { Assessment, Subject, StudyCard, Question } from '@/types'

// Função para mapear ícones baseado no nome da disciplina
function getSubjectIcon(subjectName: string): string {
  const name = subjectName.toLowerCase()
  
  if (name.includes('inglês') || name.includes('ingles')) return '🔤'
  if (name.includes('espanhol')) return '🔠'
  if (name.includes('matemática') || name.includes('matematica')) return '🔢'
  if (name.includes('ciências') || name.includes('ciencias')) return '🔬'
  if (name.includes('geografia')) return '🌍'
  if (name.includes('história') || name.includes('historia')) return '📚'
  if (name.includes('português') || name.includes('portugues')) return '📝'
  if (name.includes('artes')) return '🎨'
  if (name.includes('redação') || name.includes('redacao')) return '✍️'
  if (name.includes('física') || name.includes('fisica')) return '⚛️'
  if (name.includes('química') || name.includes('quimica')) return '🧪'
  if (name.includes('biologia')) return '🧬'
  if (name.includes('educação física') || name.includes('educacao fisica')) return '⚽'
  if (name.includes('música') || name.includes('musica')) return '🎵'
  if (name.includes('filosofia')) return '🤔'
  if (name.includes('sociologia')) return '👥'
  
  return '📖' // Ícone padrão para disciplinas não mapeadas
}

// Função para converter a estrutura atual do JSON para o formato esperado
export function adaptAssessmentData(rawAssessment: any): Assessment {
  const adaptedSubjects: Subject[] = []

  // Se subjects é um array de arrays, processar cada subarray
  if (Array.isArray(rawAssessment.subjects)) {
    rawAssessment.subjects.forEach((subjectGroup: any) => {
      if (Array.isArray(subjectGroup)) {
        // Se é um array de disciplinas
        subjectGroup.forEach((rawSubject: any) => {
          const adaptedSubject = adaptSubject(rawSubject)
          if (adaptedSubject) {
            adaptedSubjects.push(adaptedSubject)
          }
        })
      } else if (typeof subjectGroup === 'object' && subjectGroup.title) {
        // Se é uma disciplina individual
        const adaptedSubject = adaptSubject(subjectGroup)
        if (adaptedSubject) {
          adaptedSubjects.push(adaptedSubject)
        }
      }
    })
  }

  // Determinar logo da escola baseado no nome
  let schoolLogo = rawAssessment.schoolLogo
  if (!schoolLogo) {
    if (rawAssessment.school.toLowerCase().includes('portinari') || rawAssessment.school.toLowerCase().includes('portortinari')) {
      schoolLogo = '/data/logo-portinari.png'
    } else if (rawAssessment.school.toLowerCase().includes('yazigi') || rawAssessment.school.toLowerCase().includes('yasigi')) {
      schoolLogo = '/data/logo-yazigi.png'
    } else {
      schoolLogo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOveLRTe9dYBTFGs85_vfvidPm43ZIjUJruQ&s'
    }
  }

  return {
    title: rawAssessment.title,
    course: rawAssessment.course,
    school: rawAssessment.school,
    schoolLogo,
    examDate: rawAssessment.examDate || rawAssessment.date || '2024-12-01',
    anotherInfo: rawAssessment.anotherInfo || rawAssessment.AnotherInfo || '',
    enabled: rawAssessment.enabled,
    order: rawAssessment.order,
    subjects: adaptedSubjects
  }
}

function adaptSubject(rawSubject: any): Subject | null {
  if (!rawSubject || !rawSubject.title) {
    return null
  }

  // Adaptar cards de estudo
  const studyCards: StudyCard[] = []
  if (Array.isArray(rawSubject.cards)) {
    rawSubject.cards.forEach((card: any, index: number) => {
      if (typeof card === 'string') {
        // Formato antigo: array de strings
        studyCards.push({
          title: `Card ${index + 1}`,
          description: card
        })
      } else if (typeof card === 'object' && card.title && card.description) {
        // Formato novo: objetos com title, description e imageSrc opcional
        studyCards.push({
          title: card.title,
          description: card.description,
          imageSrc: card.imageSrc
        })
      }
    })
  }

  // Adaptar questões
  const questions: Question[] = []
  if (Array.isArray(rawSubject.questions)) {
    rawSubject.questions.forEach((rawQuestion: any) => {
      const adaptedQuestion = adaptQuestion(rawQuestion)
      if (adaptedQuestion) {
        questions.push(adaptedQuestion)
      }
    })
  }

  // Adaptar materiais de apoio
  const supportMaterials = []
  if (rawSubject.helpMaterial) {
    supportMaterials.push(...rawSubject.helpMaterial)
  }
  if (rawSubject.supportMaterials) {
    supportMaterials.push(...rawSubject.supportMaterials)
  }

  return {
    name: rawSubject.title,
    content: rawSubject.content || `Conteúdo de ${rawSubject.title}`,
    icon: getSubjectIcon(rawSubject.title),
    date: rawSubject.date,
    studyCards,
    questions,
    supportMaterials
  }
}

function adaptQuestion(rawQuestion: any): Question | null {
  if (!rawQuestion || (!rawQuestion.question && !rawQuestion.description)) {
    return null
  }

  // Usar 'question' se existir, senão usar 'description' para compatibilidade
  const questionText = rawQuestion.question || rawQuestion.description

  // Usar 'options' se existir, senão usar 'responses' para compatibilidade
  const optionsData = rawQuestion.options || rawQuestion.responses || []

  const type = rawQuestion.type === 'true/false' ? 'boolean' : 'multiple'
  
  if (type === 'boolean') {
    // Para questões verdadeiro/falso
    const correctResponse = optionsData.find((r: any) => r.isCorrect === "true" || r.isCorrect === true)
    const correctAnswer = correctResponse?.description === 'Verdadeiro'
    
    return {
      question: questionText,
      type: 'boolean',
      correctAnswer
    }
  } else {
    // Para questões de múltipla escolha
    const options = optionsData.map((r: any) => r.description) || []
    const correctIndex = optionsData.findIndex((r: any) => r.isCorrect === "true" || r.isCorrect === true) || 0
    
    return {
      question: questionText,
      type: 'multiple',
      options,
      correctAnswer: correctIndex
    }
  }
}
