"use client";
import React from 'react';
import { useStorage } from '@/hooks/useStorage';
import { BarChart3, PieChart, Activity, CheckCircle2, XCircle } from 'lucide-react';

const Analysis = () => {
    const { profile, loading } = useStorage();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const academicReadiness = (parseFloat(profile.cgpa) / 10) * 100;
    const skillReadiness = (profile.skills.length / 8) * 100;

    const coreSkills = ['Java', 'Python', 'SQL', 'DBMS', 'DSA'];
    const missingCore = coreSkills.filter(s => !profile.skills.some(ps => ps.toLowerCase().includes(s.toLowerCase())));

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Market Readiness */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-blue-600" size={20} />
                        <h3 className="font-bold text-gray-800">Market Readiness</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Academic Standing</span>
                                <span className="font-bold">{academicReadiness.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${academicReadiness}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Technical Breadth</span>
                                <span className="font-bold">{Math.min(100, skillReadiness).toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, skillReadiness)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skill Distribution */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <PieChart className="text-gray-200 mb-4" size={64} />
                    <p className="text-gray-400 text-sm text-center">Interactive skill distribution chart will appear here as you add more profile data.</p>
                </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-8 border-b bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="text-orange-500" size={20} />
                        Placement Gap Analysis
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-500" />
                                Acquired Competencies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(skill => (
                                    <div key={skill} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 shadow-sm">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <XCircle size={16} className="text-red-500" />
                                Missing Industry Standard Skills
                            </h4>
                            <div className="space-y-3">
                                {missingCore.length > 0 ? missingCore.map(skill => (
                                    <div key={skill} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                                        <span className="text-sm font-medium text-red-700">{skill}</span>
                                        <span className="text-[10px] font-black uppercase text-red-400">High Priority</span>
                                    </div>
                                )) : <p className="text-sm text-green-600 font-medium italic">You've covered all core industry skills!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Insight */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">Strategic Insight (ML-Generated)</h3>
                <p className="text-blue-100 leading-relaxed opacity-90 mb-6">
                    Based on your current profile, you exhibit strong 
                    <span className="font-bold text-white mx-1">{academicReadiness > 80 ? 'Academic' : 'Learning'}</span>
                    potential. Your technical breadth of 
                    <span className="font-bold text-white mx-1">{profile.skills.length} skills</span>
                    makes you a {profile.skills.length > 5 ? 'highly competitive' : 'promising'} candidate for 
                    <span className="font-bold text-white mx-1">Product-based</span>
                    roles. {missingCore.length > 0 ? `To unlock Tier-1 opportunities, we recommend prioritizing ${missingCore.join(', ')}.` : 'You have a complete set of industry-standard core skills!'}
                </p>
                <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold transition-transform active:scale-95">
                    Download Detailed PDF Report
                </button>
            </div>
        </div>
    );
};

export default Analysis;
