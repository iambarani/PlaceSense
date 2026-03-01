import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Plus, X, GraduationCap, Book, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

const createEmptyProject = () => ({
    id: Date.now() + Math.random(),
    projectName: '',
    role: 'Team Member',
    techStack: [],
    description: ''
});

const createEmptyCertification = () => ({
    id: Date.now() + Math.random(),
    certificationName: '',
    issuingOrganization: '',
    year: '',
    certificateType: 'Course'
});

const StudentProfile = () => {
    const { profile, setProfile } = useStorage();
    const [newSkill, setNewSkill] = useState('');
    const [isSemesterOpen, setIsSemesterOpen] = useState(true);
    const [projectTechInput, setProjectTechInput] = useState({});

    const handleBasicChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSubjectChange = (subject, grade) => {
        setProfile(prev => ({
            ...prev,
            subjects: { ...prev.subjects, [subject]: grade }
        }));
    };

    const handleSemesterGpaChange = (semester, value) => {
        setProfile(prev => ({
            ...prev,
            semesterGpa: {
                ...(prev.semesterGpa || {}),
                [semester]: value
            }
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

    const addProject = () => {
        setProfile(prev => ({
            ...prev,
            projects: [...(Array.isArray(prev.projects) ? prev.projects : []), createEmptyProject()]
        }));
    };

    const removeProject = (projectId) => {
        setProfile(prev => {
            const currentProjects = Array.isArray(prev.projects) ? prev.projects : [];
            if (currentProjects.length <= 1) return prev;
            return {
                ...prev,
                projects: currentProjects.filter(project => project.id !== projectId)
            };
        });
        setProjectTechInput(prev => {
            const updated = { ...prev };
            delete updated[projectId];
            return updated;
        });
    };

    const handleProjectChange = (projectId, field, value) => {
        setProfile(prev => ({
            ...prev,
            projects: (Array.isArray(prev.projects) ? prev.projects : []).map(project =>
                project.id === projectId ? { ...project, [field]: value } : project
            )
        }));
    };

    const addProjectTechTag = (e, projectId) => {
        e.preventDefault();
        const currentTag = (projectTechInput[projectId] || '').trim();
        if (!currentTag) return;

        setProfile(prev => ({
            ...prev,
            projects: (Array.isArray(prev.projects) ? prev.projects : []).map(project => {
                if (project.id !== projectId) return project;
                const stack = Array.isArray(project.techStack) ? project.techStack : [];
                if (stack.includes(currentTag)) return project;
                return { ...project, techStack: [...stack, currentTag] };
            })
        }));

        setProjectTechInput(prev => ({ ...prev, [projectId]: '' }));
    };

    const removeProjectTechTag = (projectId, tagToRemove) => {
        setProfile(prev => ({
            ...prev,
            projects: (Array.isArray(prev.projects) ? prev.projects : []).map(project => {
                if (project.id !== projectId) return project;
                return {
                    ...project,
                    techStack: (Array.isArray(project.techStack) ? project.techStack : []).filter(tag => tag !== tagToRemove)
                };
            })
        }));
    };

    const addCertification = () => {
        setProfile(prev => ({
            ...prev,
            certifications: [...(Array.isArray(prev.certifications) ? prev.certifications : []), createEmptyCertification()]
        }));
    };

    const removeCertification = (certificationId) => {
        setProfile(prev => {
            const currentCertifications = Array.isArray(prev.certifications) ? prev.certifications : [];
            if (currentCertifications.length <= 1) return prev;
            return {
                ...prev,
                certifications: currentCertifications.filter(certification => certification.id !== certificationId)
            };
        });
    };

    const handleCertificationChange = (certificationId, field, value) => {
        setProfile(prev => ({
            ...prev,
            certifications: (Array.isArray(prev.certifications) ? prev.certifications : []).map(certification =>
                certification.id === certificationId ? { ...certification, [field]: value } : certification
            )
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={profile.department || 'CSE'}
                                    onChange={(e) => handleBasicChange('department', e.target.value)}
                                >
                                    <option>CSE</option>
                                    <option>IT</option>
                                    <option>AI & DS</option>
                                    <option>ECE</option>
                                    <option>EEE</option>
                                    <option>Mechanical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={profile.yearOfStudy || '1st Year'}
                                    onChange={(e) => handleBasicChange('yearOfStudy', e.target.value)}
                                >
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                    <option>4th Year</option>
                                </select>
                            </div>
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
                        </div>

                        <div className="relative z-10 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsSemesterOpen(prev => !prev)}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white text-left"
                            >
                                <span className="text-sm font-bold text-gray-800">Semester-wise Performance</span>
                                {isSemesterOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                            </button>

                            {isSemesterOpen && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    {[
                                        { key: 'sem1', label: 'Semester 1 GPA' },
                                        { key: 'sem2', label: 'Semester 2 GPA' },
                                        { key: 'sem3', label: 'Semester 3 GPA' },
                                        { key: 'sem4', label: 'Semester 4 GPA' },
                                        { key: 'sem5', label: 'Semester 5 GPA' },
                                        { key: 'sem6', label: 'Semester 6 GPA' },
                                        { key: 'sem7', label: 'Semester 7 GPA' },
                                        { key: 'sem8', label: 'Semester 8 GPA' }
                                    ].map(sem => (
                                        <div key={sem.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{sem.label}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="10"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={profile.semesterGpa?.[sem.key] ?? ''}
                                                onChange={(e) => handleSemesterGpaChange(sem.key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Experience</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    value={profile.internshipExperience || 'No'}
                                    onChange={(e) => handleBasicChange('internshipExperience', e.target.value)}
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Hackathons Participated</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    value={profile.hackathonsParticipated ?? 0}
                                    onChange={(e) => handleBasicChange('hackathonsParticipated', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leadership Role Experience</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    value={profile.leadershipRoleExperience || 'No'}
                                    onChange={(e) => handleBasicChange('leadershipRoleExperience', e.target.value)}
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Competitive Coding Experience</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    value={profile.competitiveCodingExperience || 'No'}
                                    onChange={(e) => handleBasicChange('competitiveCodingExperience', e.target.value)}
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                                Projects
                            </h2>
                            <button
                                type="button"
                                onClick={addProject}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 text-sm"
                            >
                                <Plus size={16} />
                                Add Project
                            </button>
                        </div>

                        <div className="space-y-6">
                            {(Array.isArray(profile.projects) ? profile.projects : []).map((project, index) => (
                                <div key={project.id || index} className="p-6 border border-gray-100 rounded-2xl bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Project {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeProject(project.id)}
                                            disabled={(Array.isArray(profile.projects) ? profile.projects.length : 0) <= 1}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                value={project.projectName || ''}
                                                onChange={(e) => handleProjectChange(project.id, 'projectName', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role in Project</label>
                                            <select
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                                value={project.role || 'Team Member'}
                                                onChange={(e) => handleProjectChange(project.id, 'role', e.target.value)}
                                            >
                                                <option>Team Member</option>
                                                <option>Team Lead</option>
                                                <option>Backend Developer</option>
                                                <option>Frontend Developer</option>
                                                <option>ML Developer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {(Array.isArray(project.techStack) ? project.techStack : []).map(tag => (
                                                <span key={`${project.id}-${tag}`} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100 shadow-sm">
                                                    {tag}
                                                    <button type="button" onClick={() => removeProjectTechTag(project.id, tag)} className="hover:text-blue-900 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <form onSubmit={(e) => addProjectTechTag(e, project.id)} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={projectTechInput[project.id] || ''}
                                                onChange={(e) => setProjectTechInput(prev => ({ ...prev, [project.id]: e.target.value }))}
                                                placeholder="Add a tech (e.g. React, Node.js)"
                                                className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            />
                                            <button type="submit" className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">
                                                <Plus size={20} />
                                            </button>
                                        </form>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            value={project.description || ''}
                                            onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                                Certifications
                            </h2>
                            <button
                                type="button"
                                onClick={addCertification}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 text-sm"
                            >
                                <Plus size={16} />
                                Add Certification
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(Array.isArray(profile.certifications) ? profile.certifications : []).map((certification, index) => (
                                <div key={certification.id || index} className="p-6 border border-gray-100 rounded-2xl bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Certification {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeCertification(certification.id)}
                                            disabled={(Array.isArray(profile.certifications) ? profile.certifications.length : 0) <= 1}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                value={certification.certificationName || ''}
                                                onChange={(e) => handleCertificationChange(certification.id, 'certificationName', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                value={certification.issuingOrganization || ''}
                                                onChange={(e) => handleCertificationChange(certification.id, 'issuingOrganization', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                            <input
                                                type="number"
                                                min="2000"
                                                max="2100"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                value={certification.year || ''}
                                                onChange={(e) => handleCertificationChange(certification.id, 'year', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                                            <select
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                                value={certification.certificateType || 'Course'}
                                                onChange={(e) => handleCertificationChange(certification.id, 'certificateType', e.target.value)}
                                            >
                                                <option>Course</option>
                                                <option>Internship</option>
                                                <option>Workshop</option>
                                                <option>Hackathon</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default StudentProfile;

