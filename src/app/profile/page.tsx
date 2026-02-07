"use client";
import { useEffect, useState } from 'react';
import { UserCircle, Shield } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }, []);

  return (
    <div className="p-12 max-w-md mx-auto text-center">
      <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
        <UserCircle size={64}/>
      </div>
      <h1 className="text-2xl font-bold mb-1">{user?.email}</h1>
      <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-full text-xs font-black uppercase text-gray-500 tracking-widest">
        <Shield size={12}/> Role: {user?.role || 'Guest'}
      </div>
    </div>
  );
}