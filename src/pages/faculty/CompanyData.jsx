import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Plus, Trash2, Edit, Building, X, Search } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const CompanyData = () => {
    const { companies, addCompany, deleteCompany } = useStorage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCompany, setNewCompany] = useState({
        company_name: '',
        industry_type: '',
        difficulty_level: 'Medium',
        aptitude_weight: '',
        programming_weight: '',
        communication_weight: ''
    });

    const handleChange = (e) => {
        setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCompany)
            });
            if (response.ok) {
                addCompany(newCompany);
                setIsModalOpen(false);
                setNewCompany({ company_name: '', industry_type: '', difficulty_level: 'Medium', aptitude_weight: '', programming_weight: '', communication_weight: '' });
            }
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    const filteredCompanies = companies.filter(c =>
        (c.company_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (c.industry_type || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );

    return (
        <Layout role="faculty">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Company Intelligence</h1>
                    <p className="text-gray-500 mt-1">Manage recruitment criteria and historical placement data.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Add Company
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search companies or industries..."
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map(company => (
                    <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                            <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"><Edit size={16} /></button>
                            <button
                                onClick={() => deleteCompany(company.id)}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
                            <Building size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-1">{company.company_name}</h3>
                        <div className="flex gap-2 mb-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                                {company.industry_type}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${company.difficulty_level === 'Hard' ? 'bg-red-50 text-red-600' :
                                    company.difficulty_level === 'Medium' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {company.difficulty_level} diff
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-xs">Aptitude Weight</span>
                                <span className="font-bold text-gray-800">{company.aptitude_weight}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-xs">Programming Weight</span>
                                <span className="font-bold text-gray-800">{company.programming_weight}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-xs">Communication Weight</span>
                                <span className="font-bold text-gray-800">{company.communication_weight}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t flex gap-2">
                            <button className="flex-1 py-2 text-purple-600 text-sm font-bold hover:bg-purple-50 rounded-lg transition">
                                Edit Criteria
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Company</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input required type="text" name="company_name" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newCompany.company_name} onChange={handleChange} placeholder="e.g. Microsoft" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                                    <input required type="text" name="industry_type" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newCompany.industry_type} onChange={handleChange} placeholder="e.g. Technology" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                                    <select name="difficulty_level" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium" value={newCompany.difficulty_level} onChange={handleChange}>
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Expectations</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aptitude Weight</label>
                                        <input required type="number" name="aptitude_weight" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newCompany.aptitude_weight} onChange={handleChange} placeholder="e.g. 30" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Programming Weight</label>
                                        <input required type="number" name="programming_weight" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newCompany.programming_weight} onChange={handleChange} placeholder="e.g. 40" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Communication Weight</label>
                                        <input required type="number" name="communication_weight" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newCompany.communication_weight} onChange={handleChange} placeholder="e.g. 30" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all active:scale-[0.98] mt-4">
                                Save Company Data
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default CompanyData;

