"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Book, Award, Briefcase, Plus, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { profile, setProfile, loading } = useStorage();
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Form states
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });

    const [academicInfo, setAcademicInfo] = useState({
        cgpa: '',
        backlogs: '',
        department: '',
        yearOfPassing: ''
    });

    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (profile) {
            setPersonalInfo({
                fullName: profile.fullName || profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                location: profile.location || '',
                bio: profile.bio || ''
            });
            setAcademicInfo({
                cgpa: profile.cgpa || '',
                backlogs: profile.backlogs || '',
                department: profile.department || '',
                yearOfPassing: profile.yearOfPassing || ''
            });
            setSkills(profile.skills || []);
            setProjects(profile.projects || []);
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await setProfile({
            ...personalInfo,
            collegeAcademics: academicInfo,
            skills,
            projects
        });
        
        setIsSaving(false);
        setSaveStatus(success ? 'success' : 'error');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Student Profile</h2>
                    <p className="text-gray-500">Manage your academic and professional identity</p>
                </div>
                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {saveStatus && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                                    saveStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}
                            >
                                {saveStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {saveStatus === 'success' ? 'Saved Successfully' : 'Save Failed'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                        Save Profile
                    </button>
                </div>
            </div>

            {/* Content Sections (Personal, Academic, Skills, Projects) */}
            <div className="space-y-8">
                {/* Personal Info */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-blue-600" size={24} />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                value={personalInfo.fullName}
                                onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="student@example.com"
                            />
                        </div>
                    </div>
                </section>

                {/* Academic Info */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <GraduationCap className="text-purple-600" size={24} />
                        Academic Standing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Current CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                value={academicInfo.cgpa}
                                onChange={(e) => setAcademicInfo({...academicInfo, cgpa: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 8.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Active Backlogs</label>
                            <input
                                type="number"
                                value={academicInfo.backlogs}
                                onChange={(e) => setAcademicInfo({...academicInfo, backlogs: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </section>

                {/* Skills Container */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Award className="text-orange-500" size={24} />
                            Technical Skills
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl font-medium group">
                                {skill}
                                <button onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="hover:text-red-500 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Add a skill (e.g. React, Python)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSkills([...skills, e.target.value]);
                                    e.target.value = '';
                                }
                            }}
                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </section>

                {/* Projects Section */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Briefcase className="text-emerald-600" size={24} />
                            Key Projects
                        </h3>
                        <button
                            onClick={() => setProjects([...projects, { projectName: '', description: '', technologies: '' }])}
                            className="text-blue-600 font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all"
                        >
                            <Plus size={18} /> Add Project
                        </button>
                    </div>
                    <div className="space-y-6">
                        {projects.map((project, index) => (
                            <div key={index} className="p-6 bg-gray-50 rounded-2xl relative group">
                                <button
                                    onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        value={project.projectName}
                                        onChange={(e) => {
                                            const newProjects = [...projects];
                                            newProjects[index].projectName = e.target.value;
                                            setProjects(newProjects);
                                        }}
                                        className="bg-transparent border-none text-lg font-bold text-gray-800 focus:ring-0 p-0 mb-2"
                                        placeholder="Project Name"
                                    />
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => {
                                            const newProjects = [...projects];
                                            newProjects[index].description = e.target.value;
                                            setProjects(newProjects);
                                        }}
                                        className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 p-0 resize-none"
                                        placeholder="Brief description of your role and the technologies used..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
