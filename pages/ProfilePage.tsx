
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { ShieldCheck, Mail, Phone, MapPin, Calendar, CreditCard, Star, Save, Edit2, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';

interface ProfilePageProps {
  userRole: UserRole;
  currentUser?: UserAccount | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userRole, currentUser }) => {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
      name: currentUser?.name || (userRole === 'client' ? 'Rajesh Gupta' : 'Ankit Verma'),
      email: currentUser?.email || (userRole === 'client' ? 'rajesh@example.com' : 'ankit@example.com'),
      location: userRole === 'client' ? 'Mumbai, India' : 'Bangalore, India',
      phone: '+91 98765 43210'
  });

  const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          setIsEditing(false);
          addToast("Profile updated successfully on the blockchain.", "success");
      }, 1500);
  };

  const user = {
    role: currentUser?.role || (userRole === 'client' ? 'Client' : 'Freelancer'),
    initials: currentUser?.initials || (userRole === 'client' ? 'RG' : 'AV'),
    joined: 'February 2024',
    verified: true
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 pb-6 relative">
          <div className="-mt-12 mb-4 flex justify-between items-end">
            <div className="flex items-end">
              <div className="h-24 w-24 bg-white rounded-full p-1 shadow-md">
                <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">
                  {user.initials}
                </div>
              </div>
              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                  {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border-b border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent"
                      />
                  ) : formData.name}
                  {user.verified && (
                    <span title="Identity Verified" className="ml-2 flex items-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </span>
                  )}
                </h1>
                <p className="text-sm text-slate-500 font-medium capitalize">{user.role}</p>
              </div>
            </div>
            
            {isEditing ? (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                    {isSaving ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Save size={16} className="mr-2"/>}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <Edit2 size={14} className="mr-2"/> Edit Profile
                </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center text-slate-600 text-sm">
              <Mail className="h-4 w-4 mr-2 text-slate-400" />
              {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border-b border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent w-full text-xs"
                  />
              ) : formData.email}
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" />
              {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="border-b border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent w-full text-xs"
                  />
              ) : formData.location}
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              Joined {user.joined}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Status */}
        <div className="bg-white shadow rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Verifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                Email Address
              </div>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                Phone Number
              </div>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-slate-600">
                <CreditCard className="h-4 w-4 mr-2 text-slate-400" />
                Payment Method
              </div>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Verified</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6 border border-slate-200">
           <h3 className="text-lg font-medium text-slate-900 mb-4">Performance Stats</h3>
           <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-lg">
                 <div className="text-2xl font-bold text-slate-900">3</div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Total Contracts</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                 <div className="text-2xl font-bold text-emerald-600">100%</div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Completion Rate</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                 <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                    5.0 <Star className="h-4 w-4 ml-1 fill-current" />
                 </div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Avg Rating</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
