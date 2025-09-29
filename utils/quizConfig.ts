// Configurações dos quizzes com valores padrão
export const QUIZ_CONFIG = {
  // Número máximo padrão de questões por disciplina no quiz individual
  MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE: parseInt(
    process.env.NEXT_PUBLIC_MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE || '5'
  ),
  
  // Número padrão de questões por disciplina na prova completa
  MAX_QUESTIONS_BY_SUBJECT_ON_ALL: parseInt(
    process.env.NEXT_PUBLIC_MAX_QUESTIONS_BY_SUBJECT_ON_ALL || '2'
  ),
}

// Função para obter o número de questões baseado na configuração e disponibilidade
export function getQuestionCount(
  totalAvailable: number,
  maxConfigured: number,
  userSelected?: number
): number {
  // Se o usuário selecionou um número específico, usar esse (limitado pelo disponível)
  if (userSelected !== undefined) {
    return Math.min(userSelected, totalAvailable)
  }
  
  // Caso contrário, usar o menor entre o configurado e o disponível
  return Math.min(maxConfigured, totalAvailable)
}

// Função para gerar opções de seleção de questões
export function getQuestionOptions(totalAvailable: number): Array<{value: number, label: string}> {
  const options = []
  
  // Garantir que sempre temos pelo menos uma opção
  const maxOptions = Math.max(1, totalAvailable)
  
  for (let i = 1; i <= maxOptions; i++) {
    options.push({
      value: i,
      label: i === 1 ? '1 questão' : `${i} questões`
    })
  }
  
  return options
}
