const API_URL = "http://localhost:5000/api";

export const getStudentProfile = async (id) => {
    const res = await fetch(`${API_URL}/student/${id}`);
    return res.json();
};

export const saveStudentProfile = async (id, profile) => {
    const res = await fetch(`${API_URL}/student/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
    });

    return res.json();
};
};