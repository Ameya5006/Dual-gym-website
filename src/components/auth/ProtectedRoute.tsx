// src/components/auth/ProtectedRoute.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate   = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed,   setAuthed]   = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/member/login', { replace: true });
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });
    return unsub;
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-boxing-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-boxing-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 font-body text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;
  return <>{children}</>;
}
