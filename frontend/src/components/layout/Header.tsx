import { Settings, Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCompanyName, useBranding } from '../../providers';

export function Header() {
  const isOnline = useUIStore((s) => s.isOnline);
  const openModal = useUIStore((s) => s.openModal);
  const companyName = useCompanyName();
  const { branding } = useBranding();

  // Get first letter of company name for logo
  const logoLetter = companyName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {branding?.logo_url ? (
              <img
                src={branding.logo_url}
                alt={companyName}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{logoLetter}</span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Assessment Portal</h1>
              <p className="text-xs text-slate-500">{companyName}</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div
              className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
              `}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline
                </>
              )}
            </div>

            {/* Settings button */}
            <button
              onClick={() => openModal('settings')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
