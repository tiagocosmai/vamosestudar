# 📚 Vamos Estudar!!

Uma plataforma moderna de estudos desenvolvida em Next.js, oferecendo cards educativos, questões simuladas e materiais de apoio para estudantes.

## ✨ Funcionalidades

- **📋 Seleção de Períodos**: Escolha entre diferentes avaliações e períodos de estudo
- **🏫 Filtros Inteligentes**: Filtre por escola e curso quando há múltiplas opções
- **📅 Calendário de Provas**: Visualize todas as datas de provas organizadas cronologicamente
- **📚 Cards de Estudo**: Navegue por cards educativos com conceitos importantes
- **🧠 Questões Simuladas**: Pratique com questões randomizadas (máximo 10 por disciplina)
- **🏆 Prova Completa**: Faça simulados com 2 questões de cada disciplina
- **📊 Sistema de Notas**: Receba notas de 0 a 10 baseadas no desempenho
- **📱 Design Responsivo**: Otimizado para smartphones (iPhone 13/14) e tablets
- **📄 Materiais de Apoio**: Acesse recursos complementares quando disponíveis

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **JSON** - Armazenamento de dados estático

## 📦 Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/tiagocosmai/vamosestudar.git
   cd vamosestudar
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto em desenvolvimento**:
   ```bash
   # Modo normal (com watchpack desabilitado)
   npm run dev
   
   # Modo alternativo para ambientes mais restritivos
   npm run dev:no-watch
   ```

4. **Acesse no navegador**:
   ```
   http://localhost:3000
   ```

## 🏗️ Deploy na Vercel

1. **Conecte seu repositório GitHub à Vercel**
2. **Configure as variáveis de ambiente** (se necessário)
3. **Deploy automático** será feito a cada push na branch main

Ou use a Vercel CLI:
```bash
npm install -g vercel
vercel
```

## 📁 Estrutura do Projeto

```
├── app/                          # App Router do Next.js
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página inicial
│   └── assessment/              # Páginas de avaliações
│       └── [id]/                # Avaliação específica
│           ├── page.tsx         # Seleção de disciplinas
│           ├── quiz/all/        # Prova completa
│           └── subject/         # Páginas por disciplina
│               └── [subjectId]/
│                   ├── cards/   # Cards de estudo
│                   ├── quiz/    # Questões simuladas
│                   └── materials/ # Materiais de apoio
├── data/
│   └── content.json             # Dados das avaliações
├── types/
│   └── index.ts                 # Tipos TypeScript
└── public/                      # Arquivos estáticos
```

## 📝 Configuração do Conteúdo

Edite o arquivo `data/content.json` para adicionar suas avaliações:

```json
{
  "assessments": [
    {
      "title": "Nome da Avaliação",
      "course": "Nome do Curso",
      "school": "Nome da Escola",
      "schoolLogo": "URL do logo da escola",
      "examDate": "2024-12-15",
      "anotherInfo": "<p>Informações adicionais em HTML</p>",
      "enabled": true,
      "order": 0,
      "subjects": [
        {
          "name": "Nome da Disciplina",
          "content": "Descrição do conteúdo",
          "studyCards": [
            {
              "title": "Título do Card",
              "content": "Conteúdo educativo do card"
            }
          ],
          "questions": [
            {
              "question": "Pergunta da questão?",
              "type": "multiple",
              "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
              "correctAnswer": 0
            },
            {
              "question": "Questão verdadeiro/falso?",
              "type": "boolean",
              "correctAnswer": true
            }
          ],
          "supportMaterials": [
            {
              "title": "Nome do Material",
              "type": "link",
              "url": "https://exemplo.com"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎯 Tipos de Questões

### Múltipla Escolha
```json
{
  "question": "Qual é a capital do Brasil?",
  "type": "multiple",
  "options": ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte"],
  "correctAnswer": 2
}
```

### Verdadeiro/Falso
```json
{
  "question": "O Brasil tem 26 estados",
  "type": "boolean",
  "correctAnswer": false
}
```

## 🎨 Personalização

### Cores
Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
      },
    },
  },
}
```

### Logos das Escolas
Adicione as URLs dos logos no arquivo JSON ou coloque imagens na pasta `public/`.

## 📱 Responsividade

O projeto foi otimizado para:
- **Desktop**: Experiência completa
- **Tablet**: Layout adaptado
- **Smartphone**: Foco em iPhone 13/14, mas compatível com outros dispositivos

## 🔧 Scripts Disponíveis

```bash
npm run dev           # Desenvolvimento (watchpack desabilitado)
npm run dev:no-watch  # Desenvolvimento para ambientes restritivos
npm run build         # Build de produção
npm run start         # Servidor de produção
npm run lint          # Verificação de código
```

## 🏢 Ambientes Corporativos

Para ambientes corporativos com restrições de segurança:

### Configurações Aplicadas:
- **Watchpack desabilitado**: Evita problemas com monitoramento de arquivos
- **Telemetria desabilitada**: Remove coleta de dados do Next.js
- **Polling desabilitado**: Reduz uso de recursos do sistema
- **Fontes do sistema**: Usa fontes locais em vez de Google Fonts para evitar bloqueios de rede

### Scripts Alternativos:
```bash
# Para ambientes muito restritivos
npm run dev:no-watch

# Ou execute manualmente com variáveis de ambiente
WATCHPACK_POLLING=false NEXT_TELEMETRY_DISABLED=1 npm run dev
```

### Variáveis de Ambiente:
Crie um arquivo `.env.local` com:
```env
# Configurações do Sistema
WATCHPACK_POLLING=false
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS="--max-old-space-size=4096"

# Configurações dos Quizzes
MAX_QUESTIONS_BY_SUBJECT_ON_SINGLE=5
MAX_QUESTIONS_BY_SUBJECT_ON_ALL=2
```

## 📊 Sistema de Pontuação

- **Questões por Disciplina**: Configurável de 1 até o total disponível (padrão: 5)
- **Prova Completa**: Configurável por disciplina (padrão: 2 questões)
- **Nota**: Média aritmética de 0 a 10 baseada nos acertos
- **Feedback Visual**: Cores diferentes para diferentes faixas de nota
- **Seleção Personalizada**: Usuário pode escolher quantas questões quer responder

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Abra uma issue no GitHub
2. Consulte a documentação do Next.js
3. Verifique os logs do console do navegador

---

**Desenvolvido com ❤️ para facilitar o aprendizado!**
