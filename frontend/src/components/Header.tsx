import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'AT';

  return (
    <header className="sticky top-0 z-50 bg-[#18181b] border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-black text-xl uppercase tracking-tighter text-white neo-shadow-brand px-1.5 py-0.5 border-2 border-bullish text-bullish">
            mrkts
          </span>
          <span className="hidden sm:block text-[10px] uppercase tracking-widest text-white/30 font-bold">
            AI Financial Intelligence
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* User avatar */}
          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 border-2 border-white object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-bullish border-2 border-white flex items-center justify-center">
                <span className="text-black text-[10px] font-black">{initials}</span>
              </div>
            )}
            <span className="hidden sm:block text-xs text-white/60 font-semibold">
              {user?.displayName}
            </span>
          </div>

          {/* Logout */}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-white text-white neo-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:text-black transition-all duration-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
