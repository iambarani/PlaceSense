
import studentRoutes from './routes/studentRoutes.js';
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
 
const app = express();
app.use(cors());
app.use(express.json());
 
// Register Student Routes
app.use('/api/student', studentRoutes);
// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
 

 
// ============================================================
// STUDENT PROFILE — UPDATE (POST)
// ============================================================
/*
app.post('/api/student/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const studentId = req.params.id;
        const p = req.body;
 
        await connection.beginTransaction();
 
        // Upsert school_academics
        const [saRows] = await connection.query(
            'SELECT id FROM school_academics WHERE student_id = ?', [studentId]
        );
        if (saRows.length > 0) {
            await connection.query(
                'UPDATE school_academics SET tenth_percentage = ?, twelfth_percentage = ? WHERE student_id = ?',
                [p.tenth, p.twelfth, studentId]
            );
        } else {
            await connection.query(
                'INSERT INTO school_academics (student_id, tenth_percentage, twelfth_percentage) VALUES (?,?,?)',
                [studentId, p.tenth, p.twelfth]
            );
        }
 
        // Upsert college_academics
        const [caRows] = await connection.query(
            'SELECT id FROM college_academics WHERE student_id = ?', [studentId]
        );
        const caValues = [
            p.department, p.yearOfStudy, p.cgpa, p.backlogs,
            p.semesterGpa?.sem1 || null, p.semesterGpa?.sem2 || null,
            p.semesterGpa?.sem3 || null, p.semesterGpa?.sem4 || null,
            p.semesterGpa?.sem5 || null, p.semesterGpa?.sem6 || null,
            p.semesterGpa?.sem7 || null, p.semesterGpa?.sem8 || null,
            studentId
        ];
        if (caRows.length > 0) {
            await connection.query(`
    UPDATE college_academics
    SET department=?, year_of_study=?, current_cgpa=?, backlogs=?,
        sem1=?, sem2=?, sem3=?, sem4=?, sem5=?, sem6=?, sem7=?, sem8=?
    WHERE student_id=?
`, caValues);
        } else {
            await connection.query(`
                INSERT INTO college_academics
                  (department, year_of_study, current_cgpa, backlogs,
                   sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, student_id)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            `, caValues);
        }
 
        // Upsert student_experience
        const [seRows] = await connection.query(
            'SELECT id FROM student_experience WHERE student_id = ?', [studentId]
        );
        const seValues = [
            p.internshipExperience, p.hackathonsParticipated,
            p.leadershipRoleExperience, p.competitiveCodingExperience,
            studentId
        ];
        if (seRows.length > 0) {
            await connection.query(`
                UPDATE student_experience
                SET internship_experience=?, hackathons=?, leadership=?, competitive_coding=?
                WHERE student_id=?
            `, seValues);
        } else {
            await connection.query(`
                INSERT INTO student_experience
                  (internship_experience, hackathons, leadership, competitive_coding, student_id)
                VALUES (?,?,?,?,?)
            `, seValues);
        }
 
        // Replace skills
        await connection.query('DELETE FROM student_skills WHERE student_id = ?', [studentId]);
        if (p.skills && p.skills.length > 0) {
            await connection.query(
                'INSERT INTO student_skills (student_id, skill_name) VALUES ?',
                [p.skills.map(s => [studentId, s])]
            );
        }
 
        // Replace subjects
        await connection.query('DELETE FROM subject_performance WHERE student_id = ?', [studentId]);
        const subjectValues = Object.entries(p.subjects || {}).map(([name, grade]) => [studentId, name, grade]);
        if (subjectValues.length > 0) {
            await connection.query(
                'INSERT INTO subject_performance (student_id, subject_name, grade) VALUES ?',
                [subjectValues]
            );
        }
 
        // Replace projects
        await connection.query('DELETE FROM student_projects WHERE student_id = ?', [studentId]);
        const validProjects = (p.projects || []).filter(pr => pr.projectName?.trim());
        if (validProjects.length > 0) {
            await connection.query(
                'INSERT INTO student_projects (student_id, project_name, role, tech_stack, description) VALUES ?',
                [validProjects.map(pr => [
                    studentId, pr.projectName, pr.role,
                    JSON.stringify(pr.techStack || []), pr.description || ''
                ])]
            );
        }
 
        // Replace certifications
        await connection.query('DELETE FROM certifications WHERE student_id = ?', [studentId]);
        const validCerts = (p.certifications || []).filter(c => c.certificationName?.trim());
        if (validCerts.length > 0) {
            await connection.query(
                'INSERT INTO certifications (student_id, certification_name, issuing_org, year, cert_type) VALUES ?',
                [validCerts.map(c => [
                    studentId, c.certificationName, c.issuingOrganization,
                    c.year || null, c.certificateType || 'Course'
                ])]
            );
        }
 
        await connection.commit();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('[POST /api/student/:id]', error);
        res.status(500).json({ error: 'Failed to update profile' });
    } finally {
        connection.release();
    }
});
 */

// ============================================================
// COMPANIES — GET ALL
// ============================================================
app.get('/api/companies', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM companies ORDER BY company_name'
        );

        res.json(rows);
    } catch (error) {
        console.error('[GET /api/companies]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// ============================================================
// COMPANIES — ADD
// ============================================================
app.post('/api/companies', async (req, res) => {
    try {
        const { name, roles, ctc, type, difficulty } = req.body;
        if (!name) return res.status(400).json({ error: 'Company name is required' });
 
        const [result] = await pool.query(
            'INSERT INTO companies (name, roles, ctc, type, difficulty) VALUES (?,?,?,?,?)',
            [name, roles, ctc, type || 'Product', difficulty || 'Medium']
        );
        res.json({ id: result.insertId, name, roles, ctc, type, difficulty });
    } catch (error) {
        console.error('[POST /api/companies]', error);
        res.status(500).json({ error: 'Failed to add company' });
    }
});
 
// ============================================================
// COMPANIES — DELETE
// ============================================================
app.delete('/api/companies/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM companies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Company deleted' });
    } catch (error) {
        console.error('[DELETE /api/companies/:id]', error);
        res.status(500).json({ error: 'Failed to delete company' });
    }
});
 
// ============================================================
// COMPANY EXPECTATIONS — GET
// ============================================================
app.get('/api/company-expectations/:companyId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM company_expectations WHERE company_id = ?',
            [req.params.companyId]
        );
        if (rows.length === 0) {
            // Return safe defaults if no expectations row exists
            return res.json({ min_cgpa: 7.0, required_skills: [] });
        }
        const row = rows[0];
        res.json({
            ...row,
            required_skills: typeof row.required_skills === 'string'
                ? JSON.parse(row.required_skills)
                : (row.required_skills || [])
        });
    } catch (error) {
        console.error('[GET /api/company-expectations/:id]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// ============================================================
// COMPANY EXPECTATIONS — UPSERT (PUT)
// ============================================================
app.put('/api/company-expectations/:companyId', async (req, res) => {
    try {
        const { min_cgpa, required_skills, preferred_department, min_projects, backlog_tolerance } = req.body;
        const companyId = req.params.companyId;
 
        const [existing] = await pool.query(
            'SELECT id FROM company_expectations WHERE company_id = ?', [companyId]
        );
 
        const skills = JSON.stringify(required_skills || []);
 
        if (existing.length > 0) {
            await pool.query(`
                UPDATE company_expectations
                SET min_cgpa=?, required_skills=?, preferred_department=?,
                    min_projects=?, backlog_tolerance=?
                WHERE company_id=?
            `, [min_cgpa, skills, preferred_department, min_projects, backlog_tolerance, companyId]);
        } else {
            await pool.query(`
                INSERT INTO company_expectations
                  (company_id, min_cgpa, required_skills, preferred_department, min_projects, backlog_tolerance)
                VALUES (?,?,?,?,?,?)
            `, [companyId, min_cgpa, skills, preferred_department, min_projects, backlog_tolerance]);
        }
        res.json({ message: 'Expectations saved' });
    } catch (error) {
        console.error('[PUT /api/company-expectations/:id]', error);
        res.status(500).json({ error: 'Failed to save expectations' });
    }
});
 
// ============================================================
// PREDICTIONS — GET by student
// ============================================================
app.get('/api/predictions/:studentId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT pp.*, c.name AS company
            FROM placement_predictions pp
            JOIN companies c ON pp.company_id = c.id
            WHERE pp.student_id = ?
            ORDER BY pp.date DESC
        `, [req.params.studentId]);
 
        const predictions = rows.map(r => ({
            ...r,
            strength:    typeof r.strength    === 'string' ? JSON.parse(r.strength)    : (r.strength    || []),
            weakness:    typeof r.weakness    === 'string' ? JSON.parse(r.weakness)    : (r.weakness    || []),
            suggestions: typeof r.suggestions === 'string' ? JSON.parse(r.suggestions) : (r.suggestions || []),
            date: new Date(r.date).toLocaleDateString()
        }));
 
        res.json(predictions);
    } catch (error) {
        console.error('[GET /api/predictions/:studentId]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// ============================================================
// PREDICTIONS — SAVE (POST)
// ============================================================
app.post('/api/predict', async (req, res) => {
    try {
        const { studentId, companyId, probability, strength, weakness, suggestions } = req.body;
 
        if (!studentId || !companyId || probability === undefined) {
            return res.status(400).json({ error: 'Missing required fields: studentId, companyId, probability' });
        }
 
        const [result] = await pool.query(`
            INSERT INTO placement_predictions
              (student_id, company_id, probability, strength, weakness, suggestions, date)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `, [
            studentId, companyId, probability,
            JSON.stringify(strength || []),
            JSON.stringify(weakness || []),
            JSON.stringify(suggestions || [])
        ]);
 
        res.json({ id: result.insertId, message: 'Prediction saved successfully' });
    } catch (error) {
        console.error('[POST /api/predict]', error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
});
 
// ============================================================
// FACULTY — ALL STUDENTS LIST (for dashboard table)
// ============================================================
app.get('/api/faculty/students', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                s.id, s.name, s.roll_number,
                ca.department, ca.year_of_study, ca.current_cgpa, ca.backlogs,
                se.internship_experience, se.hackathons
            FROM students s
            LEFT JOIN college_academics  ca ON s.id = ca.student_id
            LEFT JOIN student_experience se ON s.id = se.student_id
            ORDER BY s.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('[GET /api/faculty/students]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// ============================================================
// FACULTY — PLACEMENT INSIGHTS (latest prediction per student)
// ============================================================
app.get('/api/faculty/insights', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                s.name,
                c.name  AS company,
                pp.probability,
                pp.weakness,
                pp.date
            FROM placement_predictions pp
            JOIN students  s ON pp.student_id = s.id
            JOIN companies c ON pp.company_id  = c.id
            WHERE pp.date = (
                SELECT MAX(pp2.date)
                FROM placement_predictions pp2
                WHERE pp2.student_id = pp.student_id
            )
            ORDER BY pp.probability DESC
        `);
 
        const insights = rows.map(r => ({
            ...r,
            weakness: typeof r.weakness === 'string' ? JSON.parse(r.weakness) : (r.weakness || []),
            status: r.probability >= 75 ? 'High' : r.probability >= 50 ? 'Medium' : 'Low',
            date: new Date(r.date).toLocaleDateString()
        }));
 
        res.json(insights);
    } catch (error) {
        console.error('[GET /api/faculty/insights]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅  PlaceSense server running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/api/health`);
});
 


