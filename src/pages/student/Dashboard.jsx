import React from 'react';
import Layout from '../../components/Layout';
import { Target, TrendingUp, Award, AlertCircle, ArrowRight } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
                {subtitle && <p className={`text-xs mt-2 font-medium ${color}`}>{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

const StudentDashboard = () => {
    const { profile, predictions } = useStorage();

    const latestProb = predictions.length > 0 ? predictions[0].probability : 72;
    const readiness = (parseFloat(profile.cgpa) / 10) * 100;

    return (
        <Layout role="student">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Overall Readiness"
                    value={`${readiness.toFixed(0)}%`}
                    subtitle="Based on academic score"
                    icon={TrendingUp}
                    color="text-blue-600"
                />
                <StatCard
                    title="Latest Prediction"
                    value={predictions.length > 0 ? `${latestProb}%` : 'N/A'}
                    subtitle={predictions.length > 0 ? `For ${predictions[0].company}` : 'Run a prediction'}
                    icon={Target}
                    color="text-purple-600"
                />
                <StatCard
                    title="Skills Verified"
                    value={`${profile.skills.length}/12`}
                    subtitle={`${Math.max(0, 12 - profile.skills.length)} to benchmark`}
                    icon={Award}
                    color="text-green-600"
                />
                <StatCard
                    title="Backlogs"
                    value={profile.backlogs}
                    subtitle={parseInt(profile.backlogs) === 0 ? 'Good standing' : 'Needs attention'}
                    icon={AlertCircle}
                    color={parseInt(profile.backlogs) === 0 ? "text-blue-600" : "text-orange-600"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Predictions */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Recent Prediction Activity</h3>
                        <Link to="/student/predict" className="text-sm font-bold text-blue-600 hover:underline">New Analysis</Link>
                    </div>
                    <div className="space-y-4">
                        {predictions.length > 0 ? predictions.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex gap-4 items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${p.probability > 75 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {p.probability}%
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{p.company}</h4>
                                        <p className="text-sm text-gray-500">{p.date}</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-300" />
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-gray-400 text-sm">No recent prediction data available.</p>
                                <Link to="/student/predict" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Strength */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Strength</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Academic Score</span>
                                <span className="font-bold text-gray-900">{profile.cgpa}/10</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${(profile.cgpa / 10) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Technical Skills</span>
                                <span className="font-bold text-gray-900">{profile.skills.length}/10</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500" style={{ width: `${(profile.skills.length / 10) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Core Consistency</span>
                                <span className="font-bold text-gray-900">7.5/10</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[75%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;

