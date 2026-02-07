"use client";
import { useState, useEffect } from 'react';
import { User, Save, MapPin, Phone, Calendar, VenetianMask } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    firstName: '', 
    lastName: '', 
    age: '', 
    sex: 'Male',
    phone: '', 
    address: '', 
    healthCard: '', 
    allergies: 'None', 
    disabilities: 'None'
  });

  useEffect(() => {
    // Ensuring localStorage is only accessed on the client side
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert("Medical Profile Synchronized to TriageFlow!");
  };

  if (!user) return <div className="p-20 text-center font-bold text-gray-400">Please login to manage your health profile.</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl"><User size={32}/></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Personal Health Profile</h1>
            <p className="opacity-80 text-sm italic">Information shared automatically with the AI Nurse</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">First Name</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={profile.firstName} 
              onChange={e => setProfile({...profile, firstName: e.target.value})} 
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Last Name</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={profile.lastName} 
              onChange={e => setProfile({...profile, lastName: e.target.value})} 
              placeholder="Doe"
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Age</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-4 text-gray-400"/>
              <input 
                type="number" 
                className="w-full p-3 pl-10 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                value={profile.age} 
                onChange={e => setProfile({...profile, age: e.target.value})} 
                placeholder="25"
              />
            </div>
          </div>

          {/* Biological Sex */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Biological Sex</label>
            <div className="relative">
              <VenetianMask size={16} className="absolute left-3 top-4 text-gray-400 z-10"/>
              <select 
                className="w-full p-3 pl-10 bg-gray-50 border rounded-xl font-semibold outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer" 
                value={profile.sex} 
                onChange={e => setProfile({...profile, sex: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-4 text-gray-400"/>
              <input 
                className="w-full p-3 pl-10 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                value={profile.phone} 
                onChange={e => setProfile({...profile, phone: e.target.value})} 
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          {/* Healthcard Number */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Healthcard Number</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
              value={profile.healthCard} 
              onChange={e => setProfile({...profile, healthCard: e.target.value})} 
              placeholder="0000-000-000-XX"
            />
          </div>

          {/* Home Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Home Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-4 text-gray-400"/>
              <input 
                className="w-full p-3 pl-10 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                value={profile.address} 
                onChange={e => setProfile({...profile, address: e.target.value})} 
                placeholder="123 Clinical Way, Toronto, ON"
              />
            </div>
          </div>
          
          {/* Allergies Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 text-red-500 font-bold">Known Allergies</label>
            <select 
              className="w-full p-3 bg-gray-50 border rounded-xl font-semibold outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" 
              value={profile.allergies} 
              onChange={e => setProfile({...profile, allergies: e.target.value})}
            >
              <option>None</option>
              <option>Peanuts</option>
              <option>Penicillin</option>
              <option>Latex</option>
              <option>Dairy</option>
            </select>
          </div>

          {/* Disabilities Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 text-blue-500 font-bold">Disabilities</label>
            <select 
              className="w-full p-3 bg-gray-50 border rounded-xl font-semibold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
              value={profile.disabilities} 
              onChange={e => setProfile({...profile, disabilities: e.target.value})}
            >
              <option>None</option>
              <option>Visual Impairment</option>
              <option>Hearing Impairment</option>
              <option>Mobility Issues</option>
              <option>Cognitive</option>
            </select>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={saveProfile} 
            className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Save size={20}/> Sync to TriageFlow
          </button>
        </div>
      </div>
    </div>
  );
}