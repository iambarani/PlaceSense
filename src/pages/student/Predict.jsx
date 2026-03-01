import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, Brain, CheckCircle, XCircle, AlertTriangle, ArrowRight, History } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const Predict = () => {
    const { profile, companies, addPrediction, predictions } = useStorage();
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isPredicting, setIsPredicting] = useState(false);
    const [result, setResult] = useState(null);

    const calculateProbability = (company) => {
        let prob = 30; // Base

        // Academic Score
        const cgpa = parseFloat(profile.cgpa);
        if (cgpa >= 9.0) prob += 30;
        else if (cgpa >= 8.0) prob += 20;
        else if (cgpa >= 7.0) prob += 10;

        // Skills
        const skillCount = profile.skills.length;
        prob += Math.min(skillCount * 5, 25);

        // Core Subjects
        if (profile.subjects['Data Structures'] === 'S' || profile.subjects['Data Structures'] === 'A') prob += 10;
        if (profile.subjects['DBMS'] === 'S' || profile.subjects['DBMS'] === 'A') prob += 10;

        // Backlogs
        if (parseInt(profile.backlogs) === 0) prob += 10;
        else prob -= 15;

        // Projects
        if (profile.projects && profile.projects.length > 20) prob += 5;

        // Difficulty adjustment
        if (company.difficulty === 'High') prob -= 20;
        else if (company.difficulty === 'Low') prob += 10;

        return Math.max(0, Math.min(99, prob));
    };

    const handlePredict = () => {
        if (!selectedCompanyId) return;

        setIsPredicting(true);
        const company = companies.find(c => c.id === parseInt(selectedCompanyId));

        setTimeout(() => {
            const prob = calculateProbability(company);
            const newResult = {
                id: Date.now(),
                company: company.name,
                probability: prob,
                date: new Date().toLocaleDateString(),
                strength: [
                    profile.cgpa >= 8.0 ? `Strong CGPA (${profile.cgpa})` : null,
                    profile.skills.length >= 4 ? `${profile.skills.length} Technical Skills` : null,
                    parseInt(profile.backlogs) === 0 ? 'Clear History (No Backlogs)' : null
                ].filter(Boolean),
                weakness: [
                    profile.cgpa < 7.5 ? 'Academic Score needs improvement' : null,
                    profile.skills.length < 3 ? 'Limited skill set' : null,
                    !profile.projects ? 'No projects listed' : null
                ].filter(Boolean),
                suggestions: [
                    prob < 60 ? 'Consider certifications in missing domains' : 'Practice mock interviews',
                    'Solve medium-level DSA problems',
                    'Document your projects more clearly'
                ]
            };

            setResult(newResult);
            addPrediction(newResult);
            setIsPredicting(false);
        }, 1500);
    };

    return (
        <Layout role="student">
            <div className="max-w-4xl mx-auto pb-20">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Internal Prediction Engine</h1>
                <p className="text-gray-500 mb-8">Select a target company to analyze your placement probability based on your current profile.</p>

                {/* Selection Area */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Company</label>
                        <div className="relative">
                            <select
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Select a company...</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.type}) - {c.difficulty} Difficulty</option>
                                ))}
                            </select>
                            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                        </div>
                    </div>
                    <button
                        onClick={handlePredict}
                        disabled={!selectedCompanyId || isPredicting}
                        className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-3 transition-all ${!selectedCompanyId ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                            }`}
                    >
                        {isPredicting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing Profile...
                            </>
                        ) : (
                            <>
                                <Brain size={20} />
                                Run Prediction
                            </>
                        )}
                    </button>
                </div>

                {/* Results Area */}
                {result && (
                    <div className="mt-8">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 border-t-4 border-t-blue-600">
                            {/* Header */}
                            <div className="p-8 text-center border-b">
                                <p className="text-gray-500 mb-2 uppercase tracking-widest text-xs font-bold">Results for {result.company}</p>
                                <div className={`text-7xl font-black mb-2 ${result.probability > 75 ? 'text-green-600' : result.probability > 50 ? 'text-blue-600' : 'text-orange-600'}`}>
                                    {result.probability}%
                                </div>
                                <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                                    {result.probability > 80 ? 'Excellent Match' : result.probability > 60 ? 'Good Potential' : 'Needs Improvement'}
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Strengths */}
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-green-700 mb-4 uppercase text-xs tracking-wider">
                                        <CheckCircle className="w-4 h-4" />
                                        Points of Strength
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.strength.length > 0 ? result.strength.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl text-green-800 text-sm border border-green-100">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                {item}
                                            </li>
                                        )) : <li className="text-sm text-gray-400 italic">No significant strengths found.</li>}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-red-700 mb-4 uppercase text-xs tracking-wider">
                                        <XCircle className="w-4 h-4" />
                                        Points of Concern
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.weakness.length > 0 ? result.weakness.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-800 text-sm border border-red-100">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                {item}
                                            </li>
                                        )) : <li className="text-sm text-gray-400 italic">No critical concerns found.</li>}
                                    </ul>
                                </div>
                            </div>

                            {/* Action Plan */}
                            <div className="p-8 bg-gray-50/50 border-t">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                    Personalized Roadmap
                                </h3>
                                <div className="grid gap-4">
                                    {result.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {idx + 1}
                                                </div>
                                                <span className="font-medium text-gray-700 group-hover:text-blue-700">{suggestion}</span>
                                            </div>
                                            <ArrowRight className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" size={20} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* History Section */}
                {predictions.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center gap-2 mb-6 text-gray-800">
                            <History size={24} />
                            <h2 className="text-2xl font-bold">Recent Predictions</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {predictions.slice(0, 4).map(p => (
                                <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{p.company}</h4>
                                        <p className="text-xs text-gray-500">{p.date}</p>
                                    </div>
                                    <div className={`text-2xl font-black ${p.probability > 75 ? 'text-green-600' : p.probability > 50 ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {p.probability}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Predict;

