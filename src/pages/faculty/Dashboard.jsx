import React from 'react';
import Layout from '../../components/Layout';
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    </div>
);

const FacultyDashboard = () => {
    const { companies } = useStorage();

    return (
        <Layout role="faculty">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value="120" icon={Users} color="text-blue-600" />
                <StatCard title="Companies Listed" value={companies.length} icon={Building2} color="text-purple-600" />
                <StatCard title="Avg. Placement Prob." value="68%" icon={TrendingUp} color="text-green-600" />
                <StatCard title="Active Openings" value="12" icon={Briefcase} color="text-orange-600" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Placement Insights</h3>
                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                        Download Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b">
                                <th className="py-3 font-medium">Student Name</th>
                                <th className="py-3 font-medium">Target Company</th>
                                <th className="py-3 font-medium">Probability</th>
                                <th className="py-3 font-medium">Key Weakness</th>
                                <th className="py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {[
                                { name: 'Student 1', company: 'Google', prob: '85%', weakness: 'System Design', status: 'High' },
                                { name: 'Student 2', company: 'Zoho', prob: '60%', weakness: 'Communication', status: 'Medium' },
                                { name: 'Student 3', company: 'TCS', prob: '92%', weakness: 'None', status: 'High' },
                                { name: 'Student 4', company: 'Google', prob: '45%', weakness: 'DSA, OS', status: 'Low' },
                                { name: 'Student 5', company: 'Zoho', prob: '78%', weakness: 'React', status: 'High' },
                            ].map((row, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {row.name.charAt(row.name.length - 1)}
                                        </div>
                                        <span className="font-semibold text-gray-800">{row.name}</span>
                                    </td>
                                    <td className="py-4">{row.company}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.status === 'High' ? 'bg-green-100 text-green-700' :
                                                row.status === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {row.prob} ({row.status})
                                        </span>
                                    </td>
                                    <td className="py-4 text-xs text-gray-500 font-medium">{row.weakness}</td>
                                    <td className="py-4">
                                        <button className="text-blue-600 hover:underline text-xs font-bold">View Analysis</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default FacultyDashboard;

