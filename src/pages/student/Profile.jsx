import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Save, Plus, X, GraduationCap, Book } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const StudentProfile = () => {
    const { profile, setProfile } = useStorage();
    const [newSkill, setNewSkill] = useState('');

    const handleBasicChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSubjectChange = (subject, grade) => {
        setProfile(prev => ({
            ...prev,
            subjects: { ...prev.subjects, [subject]: grade }
        }));
    };

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    return (
        <Layout role="student">
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-500">Keep your academic and skill data updated for better predictions.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Auto-saving to Local
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">

                    {/* Academic Info */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <GraduationCap size={120} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
                            <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                            Academic History
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">10th Standard (%)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={profile.tenth}
                                    onChange={(e) => handleBasicChange('tenth', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">12th Standard (%)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={profile.twelfth}
                                    onChange={(e) => handleBasicChange('twelfth', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={profile.cgpa}
                                    onChange={(e) => handleBasicChange('cgpa', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Backlogs (History)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={profile.backlogs}
                                    onChange={(e) => handleBasicChange('backlogs', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Core Subjects */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Book size={120} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
                            <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
                            Subject Performance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {Object.entries(profile.subjects).map(([subj, grade]) => (
                                <div key={subj}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{subj}</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                        value={grade}
                                        onChange={(e) => handleSubjectChange(subj, e.target.value)}
                                    >
                                        <option>S</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                        <option>D</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills & Achievements */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                            Skills & Achievements
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profile.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100 shadow-sm">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="hover:text-blue-900 transition-colors"><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                            <form onSubmit={addSkill} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill (e.g. Node.js)"
                                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <button type="submit" className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">
                                    <Plus size={20} />
                                </button>
                            </form>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Projects & Certifications</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="List your major projects, hackathon wins, and certifications here..."
                                value={profile.projects}
                                onChange={(e) => handleBasicChange('projects', e.target.value)}
                            ></textarea>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default StudentProfile;

