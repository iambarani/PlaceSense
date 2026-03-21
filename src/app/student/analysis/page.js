"use client";
import React from 'react';
import { useStorage } from '@/hooks/useStorage';
import { BarChart3, PieChart, Activity, CheckCircle2, XCircle, Target, TrendingUp, Layers } from 'lucide-react';

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

    // Advanced Data from New Tables
    const capabilityScores = profile.capabilityScores || [];
    const skillGapAnalysis = profile.skillGap || [];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Market Readiness & Advanced Capabilities */}
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

                {/* Capability Scores (from advanced SQL table) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="text-emerald-600" size={20} />
                        <h3 className="font-bold text-gray-800">Capability Breakdown</h3>
                    </div>
                    {capabilityScores.length > 0 ? (
                        <div className="space-y-4">
                            {capabilityScores.map((score, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500 font-medium">{score.capability_name}</span>
                                        <span className="font-bold text-emerald-600">{score.score}/100</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score.score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Layers className="text-gray-200 mb-2" size={32} />
                            <p className="text-xs text-gray-400">Detailed capability assessments (Aptitude, Core CS, Coding) will appear here after evaluation.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gap Analysis (Enhanced with skill_gap_analysis table) */}
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
                                Targeted Gaps
                            </h4>
                            <div className="space-y-3">
                                {skillGapAnalysis.length > 0 ? (
                                    skillGapAnalysis.map((gap, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                                            <span className="text-sm font-medium text-red-700">{gap.missing_skill}</span>
                                            <span className={`text-[10px] font-black uppercase ${gap.priority === 'High' ? 'text-red-400' : 'text-orange-400'}`}>
                                                {gap.priority || 'Priority'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    missingCore.map(skill => (
                                        <div key={skill} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                                            <span className="text-sm font-medium text-red-700">{skill}</span>
                                            <span className="text-[10px] font-black uppercase text-red-400">High Priority</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Insight */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Strategic Insight (ML-Enhanced)</h3>
                    <TrendingUp className="text-blue-400" size={24} />
                </div>
                <p className="text-blue-100 leading-relaxed opacity-90 mb-6">
                    Based on your 
                    <span className="font-bold text-white mx-1">
                        {capabilityScores.length > 0 ? 'Integrated Capability Assessment' : 'Profile Analytics'}
                    </span>, you exhibit strong 
                    <span className="font-bold text-white mx-1">{academicReadiness > 80 ? 'Academic' : 'Technical'}</span>
                    potential. {skillGapAnalysis.length > 0 ? `The data indicates minor gaps in ${skillGapAnalysis.slice(0, 2).map(g => g.missing_skill).join(' and ')}.` : 'Your baseline skills are strong.'} Specifically, you are a prime candidate for 
                    <span className="font-bold text-white mx-1">Product-centric engineering</span>
                    roles.
                </p>
                <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold transition-transform active:scale-95 shadow-lg">
                    Download Smart Analysis Report
                </button>
            </div>
        </div>
    );
};

export default Analysis;
