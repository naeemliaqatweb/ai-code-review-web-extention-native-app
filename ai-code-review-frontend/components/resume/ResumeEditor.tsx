"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  PlusCircle, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Link2,
  Globe,
  Camera,
  GraduationCap,
  Briefcase,
  User
} from 'lucide-react';
import api from '@/lib/api';

interface ResumeEditorProps {
  id: string;
  data: any;
  onSave: (newData: any) => void;
  isLoading: boolean;
}

export default function ResumeEditor({ id, data, onSave, isLoading }: ResumeEditorProps) {
  const [editedData, setEditedData] = useState(data || {
    summary: '',
    experience: [],
    skills: [],
    education: [],
    contact_details: {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    profile_image: ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleSave = () => {
    onSave(editedData);
  };

  const updateSection = (section: string, value: any) => {
    setEditedData({ ...editedData, [section]: value });
  };

  const updateContact = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      contact_details: { ...editedData.contact_details, [field]: value }
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await api.post(`/resumes/${id}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateSection('profile_image', response.data.path);
    } catch (error) {
      console.error('Photo upload failed', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addExperience = () => {
    const newExp = { role: 'New Role', company: 'Company', duration: 'Date - Present', achievements: [''] };
    updateSection('experience', [...(editedData.experience || []), newExp]);
  };

  const removeExperience = (index: number) => {
    const newExp = editedData.experience.filter((_: any, i: number) => i !== index);
    updateSection('experience', newExp);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...editedData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    updateSection('experience', newExp);
  };

  const addAchievement = (expIndex: number) => {
    const newExp = [...editedData.experience];
    newExp[expIndex].achievements.push('');
    updateSection('experience', newExp);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const newExp = [...editedData.experience];
    newExp[expIndex].achievements[achIndex] = value;
    updateSection('experience', newExp);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const newExp = [...editedData.experience];
    newExp[expIndex].achievements = newExp[expIndex].achievements.filter((_: any, i: number) => i !== achIndex);
    updateSection('experience', newExp);
  };

  const addEducation = () => {
    const newEdu = { degree: 'Degree Name', institution: 'University Name', year: '20XX' };
    updateSection('education', [...(editedData.education || []), newEdu]);
  };

  const removeEducation = (index: number) => {
    const newEdu = editedData.education.filter((_: any, i: number) => i !== index);
    updateSection('education', newEdu);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...editedData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    updateSection('education', newEdu);
  };

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      {/* Visual Identity Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-40 w-40 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-all duration-500">
               {editedData.profile_image ? (
                 <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${editedData.profile_image}`} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                 />
               ) : (
                 <User className="h-16 w-16 text-slate-300" />
               )}
               {uploadingPhoto && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 </div>
               )}
            </div>
            <label className="absolute -bottom-2 -right-2 h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95">
              <Camera className="h-5 w-5" />
              <input type="file" onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input 
                value={editedData.contact_details?.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Phone className="h-3 w-3" /> Phone Number
              </label>
              <input 
                value={editedData.contact_details?.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Location
              </label>
              <input 
                value={editedData.contact_details?.location}
                onChange={(e) => updateContact('location', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Link2 className="h-3 w-3" /> LinkedIn
              </label>
              <input 
                value={editedData.contact_details?.linkedin}
                onChange={(e) => updateContact('linkedin', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
           <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
              <User className="h-5 w-5" />
           </div>
           Professional Summary
        </h3>
        <textarea
          value={editedData.summary}
          onChange={(e) => updateSection('summary', e.target.value)}
          className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
          placeholder="Describe your professional journey..."
        />
      </div>

      {/* Experience Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                <Briefcase className="h-5 w-5" />
             </div>
             Work Experience
          </h3>
          <button 
            onClick={addExperience}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            Add Position
          </button>
        </div>

        <div className="space-y-12">
          {(editedData.experience || []).map((exp: any, i: number) => (
            <div key={i} className="relative group/exp border-l-2 border-indigo-100 dark:border-indigo-900/50 pl-8 space-y-4">
              <button 
                onClick={() => removeExperience(i)}
                className="absolute -left-3.5 top-0 h-7 w-7 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border border-red-100 dark:border-red-500/20 opacity-0 group-hover/exp:opacity-100 transition-all hover:scale-110"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={exp.role}
                  onChange={(e) => updateExperience(i, 'role', e.target.value)}
                  className="bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none py-1 text-lg font-black text-slate-900 dark:text-white"
                  placeholder="Job Title"
                />
                <input
                  value={exp.duration}
                  onChange={(e) => updateExperience(i, 'duration', e.target.value)}
                  className="bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none py-1 text-sm text-slate-400 font-bold md:text-right"
                  placeholder="e.g. Jan 2020 - Present"
                />
              </div>
              <input
                value={exp.company}
                onChange={(e) => updateExperience(i, 'company', e.target.value)}
                className="bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none py-1 text-sm font-black text-indigo-600 uppercase tracking-[0.2em] w-full"
                placeholder="Company Name"
              />

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Key Achievements</label>
                <div className="space-y-4">
                  {(exp.achievements || []).map((ach: string, j: number) => (
                    <div key={j} className="flex gap-4 group/ach">
                      <div className="mt-2.5 h-1.5 w-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                      <textarea
                        value={ach}
                        onChange={(e) => updateAchievement(i, j, e.target.value)}
                        className="flex-1 bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none py-1 text-sm text-slate-600 dark:text-slate-400 resize-none min-h-[40px]"
                        placeholder="Detail a specific achievement..."
                      />
                      <button 
                        onClick={() => removeAchievement(i, j)}
                        className="opacity-0 group-hover/ach:opacity-100 text-red-400 hover:text-red-600 transition-all self-start mt-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addAchievement(i)}
                    className="flex items-center gap-1.5 text-xs font-black text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-wider"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Bullet Point
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                <GraduationCap className="h-5 w-5" />
             </div>
             Education
          </h3>
          <button 
            onClick={addEducation}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            Add Education
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(editedData.education || []).map((edu: any, i: number) => (
            <div key={i} className="group/edu p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative space-y-3">
              <button 
                onClick={() => removeEducation(i)}
                className="absolute -top-2 -right-2 h-7 w-7 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center border border-red-100 dark:border-red-500/20 opacity-0 group-hover/edu:opacity-100 transition-all hover:scale-110 shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <input
                value={edu.degree}
                onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 dark:text-white outline-none border-b border-transparent focus:border-indigo-500"
                placeholder="Degree/Certification"
              />
              <input
                value={edu.institution}
                onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                className="w-full bg-transparent text-sm text-indigo-600 font-bold outline-none border-b border-transparent focus:border-indigo-500"
                placeholder="Institution"
              />
              <input
                value={edu.year}
                onChange={(e) => updateEducation(i, 'year', e.target.value)}
                className="w-full bg-transparent text-xs text-slate-400 font-bold outline-none border-b border-transparent focus:border-indigo-500"
                placeholder="2018 - 2022"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] group"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
          Save Changes & Create Version
        </button>
      </div>
    </div>
  );
}

