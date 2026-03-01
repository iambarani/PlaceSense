import React from 'react';
import Layout from '../../components/Layout';
import { Users, TrendingUp, Award, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color, isPositive }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
            </div>
        </div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
);

const Analytics = () => {
    return (
        <Layout role="faculty">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Student Analytics</h1>
                <p className="text-gray-500 mt-1">Holistic view of cohort performance and placement trends.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Active Students" value="154" change="+12%" icon={Users} color="text-blue-600" isPositive={true} />
                <StatCard title="Avg. Readiness" value="74.2%" change="+5.4%" icon={TrendingUp} color="text-purple-600" isPositive={true} />
                <StatCard title="Top Percentile" value="22" change="-2" icon={Award} color="text-green-600" isPositive={false} />
                <StatCard title="Mock Clear Rate" value="88%" change="+10%" icon={BarChart3} color="text-orange-600" isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Readiness Trend (Cohort)</h3>
                    <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm italic">Cohort progress visualization will be generated based on periodic assessment data.</p>
                    </div>
                </div>

                {/* Skill Distribution */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Core Competencies</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'DS & Algorithms', value: 85, color: 'bg-green-500' },
                            { name: 'System Design', value: 45, color: 'bg-yellow-500' },
                            { name: 'Full Stack Dev', value: 68, color: 'bg-blue-500' },
                            { name: 'Database Management', value: 92, color: 'bg-green-500' }
                        ].map(skill => (
                            <div key={skill.name}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-600 font-medium">{skill.name}</span>
                                    <span className="text-gray-900 font-bold">{skill.value}% Mastery</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Department Breakdown */}
            <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b">
                    <h3 className="font-bold text-gray-800">Department Performance Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs font-black uppercase tracking-widest border-b">
                            <tr>
                                <th className="px-8 py-4">Department</th>
                                <th className="px-8 py-4">Placement Rate</th>
                                <th className="px-8 py-4">Avg. CGPA</th>
                                <th className="px-8 py-4">Dream Benchmarks</th>
                                <th className="px-8 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {[
                                { dept: 'Computer Science', rate: '92%', cgpa: '8.4', bench: '15/20', status: 'Ahead' },
                                { dept: 'Information Tech', rate: '88%', cgpa: '8.1', bench: '12/20', status: 'On Track' },
                                { dept: 'Electronics & Comm', rate: '76%', cgpa: '7.8', bench: '8/20', status: 'Critical' }
                            ].map(row => (
                                <tr key={row.dept} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-4 font-bold text-gray-800">{row.dept}</td>
                                    <td className="px-8 py-4">{row.rate}</td>
                                    <td className="px-8 py-4 font-medium">{row.cgpa}</td>
                                    <td className="px-8 py-4">{row.bench}</td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${row.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                                                row.status === 'On Track' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {row.status}
                                        </span>
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

export default Analytics;
