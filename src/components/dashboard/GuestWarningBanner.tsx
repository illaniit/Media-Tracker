// src/components/dashboard/GuestWarningBanner.tsx
// Banner de advertencia para modo invitado

import { AlertCircle, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestWarningBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/30 border-b border-amber-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-300 font-medium">
              <span className="font-bold">Modo Invitado:</span> Tus datos no se guardarán permanentemente.
            </p>
            <p className="text-xs text-amber-400/80 hidden sm:block">
              Se perderán al cerrar el navegador. Crea una cuenta para guardar tu colección.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Crear Cuenta</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
