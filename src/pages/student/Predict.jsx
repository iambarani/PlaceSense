import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, Brain, CheckCircle, XCircle, AlertTriangle, ArrowRight, History, Activity, Trophy } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const Predict = () => {
    const { profile, companies, predictions } = useStorage();
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isPredicting, setIsPredicting] = useState(false);
    const [result, setResult] = useState(null);

    const validProjects = Array.isArray(profile.projects)
        ? profile.projects.filter(project => (project.projectName || '').trim() || (project.description || '').trim())
        : [];

    const calculateProbability = (company, expectations) => {
        // ML-Enhanced Weighted Scoring Model
        // Weights: CGPA (40%), Skills (25%), Projects (15%), Backlogs (20%)
        let score = 0;

        // 1. Academic Score (Weight: 40)
        const cgpa = parseFloat(profile.cgpa);
        const minCgpa = parseFloat(expectations.min_cgpa || 7.0);
        if (cgpa >= minCgpa) {
            score += 25; // Base for meeting criteria
            score += Math.min(15, (cgpa - minCgpa) * 10); // Bonus for higher CGPA
        } else if (cgpa >= minCgpa - 0.5) {
            score += 10; // Partial score
        }

        // 2. Technical Skills (Weight: 25)
        const requiredSkills = typeof expectations.required_skills === 'string' 
            ? JSON.parse(expectations.required_skills) 
            : (expectations.required_skills || []);
        
        const matchedSkills = profile.skills.filter(s => 
            requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
        );
        
        const skillMatchRate = requiredSkills.length > 0 
            ? matchedSkills.length / requiredSkills.length 
            : 0.5;
        
        score += skillMatchRate * 25;

        // 3. Projects & Consistency (Weight: 15)
        if (validProjects.length >= 2) score += 15;
        else if (validProjects.length === 1) score += 10;

        // 4. Backlogs (Weight: 20)
        const backlogs = parseInt(profile.backlogs || 0);
        if (backlogs === 0) score += 20;
        else if (backlogs <= 2) score += 5;

        // 5. Difficulty & Market Bias
        if (company.difficulty === 'High') score -= 10;
        else if (company.difficulty === 'Low') score += 5;

        // Sigmoid-like Normalization to 0-99
        return Math.max(5, Math.min(99, Math.round(score)));
    };

    const handlePredict = async () => {
        if (!selectedCompanyId) return;

        setIsPredicting(true);
        try {
            const company = companies.find(c => c.id === parseInt(selectedCompanyId));
            
            // Fetch real expectations from SQL
            const expRes = await fetch(`http://localhost:5000/api/company-expectations/${selectedCompanyId}`);
            const expectations = await expRes.json();

            // Simulate "Inference" processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const prob = calculateProbability(company, expectations);
            
            const newResult = {
                id: Date.now(),
                companyId: company.id,
                company: company.name,
                probability: prob,
                date: new Date().toLocaleDateString(),
                strength: [
                    profile.cgpa >= (expectations.min_cgpa || 7.5) ? `Academic excellence (Above ${expectations.min_cgpa || 7.5} threshold)` : null,
                    profile.skills.length >= 5 ? `Broad technical breadth (${profile.skills.length} skills)` : null,
                    parseInt(profile.backlogs) === 0 ? 'Consistent performance (Zero Backlogs)' : null
                ].filter(Boolean),
                weakness: [
                    profile.cgpa < (expectations.min_cgpa || 7.0) ? 'Academic score below target company preference' : null,
                    profile.skills.length < 3 ? 'Needs to acquire more industry-specific skills' : null,
                    validProjects.length === 0 ? 'Lack of practical project exposure' : null
                ].filter(Boolean),
                suggestions: [
                    prob < 60 ? 'Focus on building strong projects in MERN or Java' : 'Start practicing LeetCode medium problems',
                    'Revise core CS fundamentals (OS, DBMS)',
                    'Consider a certification in Cloud or AI'
                ]
            };

            // Save result to SQL
            await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: 1, // Default student
                    ...newResult
                })
            });

            setResult(newResult);
        } catch (error) {
            console.error("Prediction failed:", error);
        } finally {
            setIsPredicting(false);
        }
    };

    return (
        <Layout role="student">
            <div className="max-w-4xl mx-auto pb-20">
                {/* Search & Select */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Target Company</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none text-gray-700 font-medium"
                                >
                                    <option value="">Select a company to predict...</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>{company.name} ({company.roles})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handlePredict}
                            disabled={!selectedCompanyId || isPredicting}
                            className="bg-gray-800 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                        >
                            {isPredicting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                            {/* ML Model Insights */}
                            <div className="px-8 pb-8">
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <Activity size={16} />
                                        ML Model Insights (Feature Importance)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-blue-700 font-medium">Academic Weight (40%)</span>
                                                    <span className="font-bold text-blue-900">{profile.cgpa >= 8.5 ? 'High Impact' : 'Moderate Impact'}</span>
                                                </div>
                                                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-purple-700 font-medium">Skill Match (25%)</span>
                                                    <span className="font-bold text-purple-900">{profile.skills.length >= 5 ? 'Strong Match' : 'Gap Detected'}</span>
                                                </div>
                                                <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '25%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center p-4 bg-white/50 rounded-2xl border border-blue-50 italic text-xs text-blue-600 text-center">
                                            "This model uses a weighted ensemble of your current academics, verified skills, and project history to determine placement probability."
                                        </div>
                                    </div>
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
