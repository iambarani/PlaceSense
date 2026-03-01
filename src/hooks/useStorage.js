import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
    PROFILE: 'playsense_student_profile',
    COMPANIES: 'playsense_companies',
    PREDICTIONS: 'playsense_predictions',
};

const DEFAULT_PROFILE = {
    department: 'CSE',
    yearOfStudy: '1st Year',
    tenth: 88.5,
    twelfth: 84.2,
    cgpa: 8.1,
    semesterGpa: {
        sem1: '',
        sem2: '',
        sem3: '',
        sem4: '',
        sem5: '',
        sem6: '',
        sem7: '',
        sem8: ''
    },
    backlogs: 0,
    internshipExperience: 'No',
    hackathonsParticipated: 0,
    leadershipRoleExperience: 'No',
    competitiveCodingExperience: 'No',
    skills: ['Java', 'React', 'Python', 'SQL'],
    subjects: {
        'Data Structures': 'A',
        'DBMS': 'S',
        'Operating Systems': 'B',
        'Computer Networks': 'A',
        'OOPS': 'A',
        'Mathematics': 'B'
    },
    projects: [
        {
            id: 1,
            projectName: '',
            role: 'Team Member',
            techStack: [],
            description: ''
        }
    ],
    certifications: [
        {
            id: 1,
            certificationName: '',
            issuingOrganization: '',
            year: '',
            certificateType: 'Course'
        }
    ]
};

const DEFAULT_COMPANIES = [
    { id: 1, name: 'Google', roles: 'SDE-1', ctc: '24 LPA', type: 'Product', difficulty: 'High' },
    { id: 2, name: 'TCS', roles: 'Ninja, Digital', ctc: '3.5 - 7 LPA', type: 'Service', difficulty: 'Medium' },
    { id: 3, name: 'Zoho', roles: 'Software Developer', ctc: '8.4 LPA', type: 'Product', difficulty: 'Medium' },
];

export const useStorage = () => {
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (!saved) return DEFAULT_PROFILE;

        const parsed = JSON.parse(saved);
        const normalizedProjects = Array.isArray(parsed.projects)
            ? parsed.projects.map(project => ({
                id: project.id || Date.now() + Math.random(),
                projectName: project.projectName || '',
                role: project.role || 'Team Member',
                techStack: Array.isArray(project.techStack) ? project.techStack : [],
                description: project.description || ''
            }))
            : typeof parsed.projects === 'string' && parsed.projects.trim().length > 0
                ? [{
                    id: Date.now() + Math.random(),
                    projectName: '',
                    role: 'Team Member',
                    techStack: [],
                    description: parsed.projects
                }]
                : DEFAULT_PROFILE.projects;

        const normalizedCertifications = Array.isArray(parsed.certifications)
            ? parsed.certifications.map(certification => ({
                id: certification.id || Date.now() + Math.random(),
                certificationName: certification.certificationName || '',
                issuingOrganization: certification.issuingOrganization || '',
                year: certification.year || '',
                certificateType: certification.certificateType || 'Course'
            }))
            : DEFAULT_PROFILE.certifications;

        return {
            ...DEFAULT_PROFILE,
            ...parsed,
            semesterGpa: {
                ...DEFAULT_PROFILE.semesterGpa,
                ...(parsed.semesterGpa || {})
            },
            subjects: {
                ...DEFAULT_PROFILE.subjects,
                ...(parsed.subjects || {})
            },
            projects: normalizedProjects.length > 0 ? normalizedProjects : DEFAULT_PROFILE.projects,
            certifications: normalizedCertifications.length > 0 ? normalizedCertifications : DEFAULT_PROFILE.certifications
        };
    });

    const [companies, setCompanies] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
        return saved ? JSON.parse(saved) : DEFAULT_COMPANIES;
    });

    const [predictions, setPredictions] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    }, [companies]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
    }, [predictions]);

    const addCompany = (company) => {
        setCompanies(prev => [...prev, { ...company, id: Date.now() }]);
    };

    const deleteCompany = (id) => {
        setCompanies(prev => prev.filter(c => c.id !== id));
    };

    const addPrediction = (prediction) => {
        setPredictions(prev => [prediction, ...prev]);
    };

    return {
        profile,
        setProfile,
        companies,
        addCompany,
        deleteCompany,
        predictions,
        addPrediction
    };
};
