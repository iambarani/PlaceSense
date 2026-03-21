import express from 'express';
import cors from 'cors';
import pool from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Fetch full student profile
app.get('/api/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Fetch basic, academic, and experience info
        const [rows] = await pool.query(`
            SELECT s.*, sa.*, ca.*, se.*
            FROM students s
            LEFT JOIN school_academics sa ON s.id = sa.student_id
            LEFT JOIN college_academics ca ON s.id = ca.student_id
            LEFT JOIN student_experience se ON s.id = se.student_id
            WHERE s.id = ?
        `, [studentId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });

        const data = rows[0];

        // Fetch subjects
        const [subjectRows] = await pool.query('SELECT subject_name, grade FROM subject_performance WHERE student_id = ?', [studentId]);
        const subjects = {};
        subjectRows.forEach(row => subjects[row.subject_name] = row.grade);

        // Fetch skills
        const [skillRows] = await pool.query('SELECT skill_name FROM student_skills WHERE student_id = ?', [studentId]);
        const skills = skillRows.map(row => row.skill_name);

        // Fetch projects
        const [projectRows] = await pool.query('SELECT project_name, role, tech_stack, description FROM student_projects WHERE student_id = ?', [studentId]);
        const projects = projectRows.map(row => ({
            projectName: row.project_name,
            role: row.role,
            techStack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || []),
            description: row.description
        }));

        // Fetch certifications
        const [certRows] = await pool.query('SELECT certification_name, issuing_org, year, cert_type FROM certifications WHERE student_id = ?', [studentId]);
        const certifications = certRows.map(row => ({
            certificationName: row.certification_name,
            issuingOrganization: row.issuing_org,
            year: row.year,
            certificateType: row.cert_type
        }));

        // Map to profile structure
        const profile = {
            id: data.id,
            department: data.department,
            yearOfStudy: data.year_of_study,
            tenth: data.tenth_percentage,
            twelfth: data.twelfth_percentage,
            cgpa: data.current_cgpa,
            semesterGpa: {
                sem1: data.sem1 || '', sem2: data.sem2 || '', sem3: data.sem3 || '', sem4: data.sem4 || '',
                sem5: data.sem5 || '', sem6: data.sem6 || '', sem7: data.sem7 || '', sem8: data.sem8 || ''
            },
            backlogs: data.backlogs,
            internshipExperience: data.internship_experience,
            hackathonsParticipated: data.hackathons,
            leadershipRoleExperience: data.leadership,
            competitiveCodingExperience: data.competitive_coding,
            skills: skills,
            subjects: subjects,
            projects: projects,
            certifications: certifications
        };

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/student/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const studentId = req.params.id;
        const p = req.body;

        await connection.beginTransaction();

        // Update college academics
        await connection.query(`
            UPDATE college_academics 
            SET department = ?, year_of_study = ?, current_cgpa = ?, backlogs = ?,
                sem1 = ?, sem2 = ?, sem3 = ?, sem4 = ?, sem5 = ?, sem6 = ?, sem7 = ?, sem8 = ?
            WHERE student_id = ?
        `, [
            p.department, p.yearOfStudy, p.cgpa, p.backlogs,
            p.semesterGpa.sem1, p.semesterGpa.sem2, p.semesterGpa.sem3, p.semesterGpa.sem4,
            p.semesterGpa.sem5, p.semesterGpa.sem6, p.semesterGpa.sem7, p.semesterGpa.sem8,
            studentId
        ]);

        // Update experience
        await connection.query(`
            UPDATE student_experience 
            SET internship_experience = ?, hackathons = ?, leadership = ?, competitive_coding = ?
            WHERE student_id = ?
        `, [p.internshipExperience, p.hackathonsParticipated, p.leadershipRoleExperience, p.competitiveCodingExperience, studentId]);

        // Update skills (Delete and Re-insert for simplicity)
        await connection.query('DELETE FROM student_skills WHERE student_id = ?', [studentId]);
        if (p.skills.length > 0) {
            await connection.query('INSERT INTO student_skills (student_id, skill_name) VALUES ?', 
                [p.skills.map(s => [studentId, s])]);
        }

        // Update subjects
        await connection.query('DELETE FROM subject_performance WHERE student_id = ?', [studentId]);
        const subjectValues = Object.entries(p.subjects).map(([name, grade]) => [studentId, name, grade]);
        if (subjectValues.length > 0) {
            await connection.query('INSERT INTO subject_performance (student_id, subject_name, grade) VALUES ?', [subjectValues]);
        }

        await connection.commit();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    } finally {
        connection.release();
    }
});

// Fetch companies
app.get('/api/companies', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM companies');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch predictions
app.get('/api/predictions/:studentId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT pp.*, c.name as company 
            FROM placement_predictions pp
            JOIN companies c ON pp.company_id = c.id
            WHERE pp.student_id = ?
            ORDER BY pp.date DESC
        `, [req.params.studentId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch company expectations
app.get('/api/company-expectations/:companyId', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM company_expectations WHERE company_id = ?', [req.params.companyId]);
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save a placement prediction
app.post('/api/predict', async (req, res) => {
    try {
        const { studentId, companyId, probability, strength, weakness, suggestions } = req.body;
        await pool.query(`
            INSERT INTO placement_predictions (student_id, company_id, probability, strength, weakness, suggestions, date)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `, [studentId, companyId, probability, JSON.stringify(strength), JSON.stringify(weakness), JSON.stringify(suggestions)]);
        res.json({ message: 'Prediction saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
