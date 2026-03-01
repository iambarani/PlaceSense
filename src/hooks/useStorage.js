import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
    PROFILE: 'playsense_student_profile',
    COMPANIES: 'playsense_companies',
    PREDICTIONS: 'playsense_predictions',
};

const DEFAULT_PROFILE = {
    tenth: 88.5,
    twelfth: 84.2,
    cgpa: 8.1,
    backlogs: 0,
    skills: ['Java', 'React', 'Python', 'SQL'],
    subjects: {
        'Data Structures': 'A',
        'DBMS': 'S',
        'Operating Systems': 'B',
        'Computer Networks': 'A',
        'OOPS': 'A',
        'Mathematics': 'B'
    },
    projects: ''
};

const DEFAULT_COMPANIES = [
    { id: 1, name: 'Google', roles: 'SDE-1', ctc: '24 LPA', type: 'Product', difficulty: 'High' },
    { id: 2, name: 'TCS', roles: 'Ninja, Digital', ctc: '3.5 - 7 LPA', type: 'Service', difficulty: 'Medium' },
    { id: 3, name: 'Zoho', roles: 'Software Developer', ctc: '8.4 LPA', type: 'Product', difficulty: 'Medium' },
];

export const useStorage = () => {
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
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
