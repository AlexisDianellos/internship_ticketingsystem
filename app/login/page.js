// app/components/LoginGate.jsx
'use client';

import { useState, useEffect } from 'react';

const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE;

export default function LoginGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const sessionCode = sessionStorage.getItem('access_granted');
    if (sessionCode === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (input === ACCESS_CODE) {
      sessionStorage.setItem('access_granted', 'true');
      setAuthenticated(true);
    } else {
      alert('Incorrect code.');
    }
  };

  if (authenticated) return children;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Enter Access Code</h1>
      <input
        type="password"
        placeholder="Access code"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 border rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-[#802828] text-white px-4 py-2 rounded hover:bg-[#6B1F1F] cursor-pointer"
      >
        Enter
      </button>
    </div>
  );
}
