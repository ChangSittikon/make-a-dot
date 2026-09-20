'use client';
import { useEffect, useState } from 'react';
import AuthButton from './AuthButton';

export default function ClientAuthButton() {
  const [session, setSession] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSession(data);
        }
      })
      .catch(err => console.error("Failed to fetch session", err));
  }, []);

  return <AuthButton session={session} />;
}
