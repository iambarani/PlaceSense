"use client";
import { useState, useEffect } from 'react';

export const useStorage = () => {
    const [profile, setProfile] = useState({
        name: 'Student User',
        id: '1',
        cgpa: '0.0',
        skills: [],
        projects: []
    });
    const [companies, setCompanies] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // In Next.js, we call relative API routes
                const [profileRes, companiesRes, predictionsRes] = await Promise.all([
                    fetch('/api/student/1'),
                    fetch('/api/companies'),
                    fetch('/api/predictions/1')
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile({
                        ...profileData,
                        cgpa: profileData.collegeAcademics?.cgpa || '0.0',
                        skills: profileData.skills || [],
                        projects: profileData.projects || []
                    });
                }

                if (companiesRes.ok) {
                    setCompanies(await companiesRes.json());
                }

                if (predictionsRes.ok) {
                    setPredictions(await predictionsRes.json());
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateProfile = async (newData) => {
        try {
            const res = await fetch('/api/student/1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (res.ok) {
                setProfile(prev => ({ ...prev, ...newData }));
                return true;
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
        return false;
    };

    const addPrediction = async (prediction) => {
        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: 1, ...prediction })
            });
            if (res.ok) {
                setPredictions(prev => [prediction, ...prev]);
                return true;
            }
        } catch (error) {
            console.error("Failed to save prediction:", error);
        }
        return false;
    };

    return { profile, setProfile: updateProfile, companies, predictions, addPrediction, loading };
};
