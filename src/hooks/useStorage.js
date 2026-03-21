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

const API_BASE_URL = 'http://localhost:5000/api';
const STUDENT_ID = 1;

export const useStorage = () => {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile
                const profileRes = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch Companies
                const companiesRes = await fetch(`${API_BASE_URL}/companies`);
                if (companiesRes.ok) {
                    const companiesData = await companiesRes.json();
                    setCompanies(companiesData);
                }

                // Fetch Predictions
                const predictionsRes = await fetch(`${API_BASE_URL}/predictions/${STUDENT_ID}`);
                if (predictionsRes.ok) {
                    const predictionsData = await predictionsRes.json();
                    setPredictions(predictionsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Save Profile to SQL when changed
    const saveProfile = async (updatedProfile) => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile)
            });
            if (!response.ok) throw new Error('Failed to save profile');
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    // Proxy setProfile to also save to backend
    const updateProfile = (newProfileOrFn) => {
        setProfile(prev => {
            const next = typeof newProfileOrFn === 'function' ? newProfileOrFn(prev) : newProfileOrFn;
            saveProfile(next);
            return next;
        });
    };

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
        setProfile: updateProfile,
        companies,
        addCompany,
        deleteCompany,
        predictions,
        addPrediction,
        loading
    };
};
