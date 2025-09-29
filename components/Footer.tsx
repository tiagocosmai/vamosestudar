'use client'

import Link from 'next/link'
import { ExternalLink, Gamepad2, Spade } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              📚 Vamos Estudar!!
            </h3>
            <p className="text-gray-600 text-sm">
              Plataforma de estudos com cards educativos, questões simuladas e materiais de apoio.
            </p>
          </div>

          {/* Games Section */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Jogos Educativos
            </h4>
            <div className="space-y-3">
              <a
                href="https://portinari-forca.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <Spade className="h-4 w-4" />
                <span>Jogo da Forca</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a
                href="https://spellingbee-da-mali.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-yellow-600 hover:text-yellow-800 transition-colors group"
              >
                <span className="text-lg">🐝</span>
                <span>Spelling Bee</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Links Rápidos
            </h4>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                Início
              </Link>
              <a 
                href="https://github.com/tiagocosmai/vamosestudar" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 Vamos Estudar!! - Desenvolvido com ❤️ para facilitar o aprendizado
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Jogos parceiros:</span>
              <div className="flex gap-4">
                <a
                  href="https://portinari-forca.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Forca
                </a>
                <a
                  href="https://spellingbee-da-mali.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-600 transition-colors"
                >
                  Spelling Bee
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
