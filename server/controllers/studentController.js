import pool from '../config/db.js';

export const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Student + User
        const [studentRows] = await pool.query(`
            SELECT
                s.student_id,
                s.register_number,
                s.department,
                s.year_of_study,
                u.name,
                u.email
            FROM students s
            LEFT JOIN users u ON s.user_id = u.user_id
            WHERE s.student_id = ?
        `, [studentId]);

        if (studentRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = studentRows[0];

        // School Academics
        const [schoolRows] = await pool.query(
            'SELECT * FROM school_academics WHERE student_id = ?',
            [studentId]
        );

        const tenth = schoolRows.find(r => r.level === '10th');
        const twelfth = schoolRows.find(r => r.level === '12th');

        // College Academics
        const [collegeRows] = await pool.query(
            'SELECT semester, gpa FROM college_academics WHERE student_id = ?',
            [studentId]
        );

        const semesterGpa = {};

        collegeRows.forEach(row => {
            semesterGpa[`sem${row.semester}`] = row.gpa;
        });

        const cgpa =
            collegeRows.length > 0
                ? (
                    collegeRows.reduce((sum, row) => sum + Number(row.gpa), 0) /
                    collegeRows.length
                ).toFixed(2)
                : 0;

        // Subject Performance
        const [subjectRows] = await pool.query(
            'SELECT subject_name, score FROM subject_performance WHERE student_id = ?',
            [studentId]
        );

        const subjects = {};

        subjectRows.forEach(row => {
            subjects[row.subject_name] = row.score;
        });

        // Skills
        const [skillRows] = await pool.query(
            'SELECT skill_name, proficiency_level FROM student_skills WHERE student_id = ?',
            [studentId]
        );

        const skills = skillRows.map(row => row.skill_name);

        // Experience
        const [experienceRows] = await pool.query(
            'SELECT * FROM student_experience WHERE student_id = ?',
            [studentId]
        );

        const experience = experienceRows[0] || {};

        // Projects
        const [projectRows] = await pool.query(
            'SELECT * FROM student_projects WHERE student_id = ?',
            [studentId]
        );

        const projects = projectRows.map(row => ({
            id: row.project_id,
            projectName: row.project_name,
            role: row.role,
            techStack: row.tech_stack || '',
            description: row.description || ''
        }));

        // Certifications
        const [certRows] = await pool.query(
            'SELECT * FROM certifications WHERE student_id = ?',
            [studentId]
        );

        const certifications = certRows.map(row => ({
            id: row.cert_id,
            certificationName: row.certification_name,
            issuingOrganization: row.organization,
            year: row.year,
            certificateType: row.certificate_type
        }));

        const profile = {
            id: student.student_id,
            name: student.name,
            email: student.email,
            rollNumber: student.register_number,
            department: student.department,
            yearOfStudy: student.year_of_study,

            tenth: tenth?.overall_percentage || 0,
            twelfth: twelfth?.overall_percentage || 0,

            cgpa,
            semesterGpa,

            internshipExperience: experience.internship ? 'Yes' : 'No',
            hackathonsParticipated: experience.hackathons_count || 0,
            leadershipRoleExperience: experience.leadership_role ? 'Yes' : 'No',
            competitiveCodingExperience: experience.competitive_coding ? 'Yes' : 'No',

            skills,
            subjects,
            projects,
            certifications
        };

        res.json(profile);

    } catch (error) {
        console.error('[GET /api/student/:id]', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
export const updateStudentProfile = async (req, res) => {
    console.log("POST API called");
    console.log(req.body);

    const connection = await pool.getConnection();

    try {
        const studentId = req.params.id;
        const p = req.body;

        await connection.beginTransaction();

        // Convert Year string to integer
        console.log("Year received from React:", p.yearOfStudy);
        let year = p.yearOfStudy;

        if (typeof year === "string") {
            const map = {
                "1st Year": 1,
                "2nd Year": 2,
                "3rd Year": 3,
                "4th Year": 4
            };
            year = map[year] || 1;
        }

        // ============================
        // Update students table
        // ============================

        await connection.query(
            `
            UPDATE students
            SET
                department = ?,
                year_of_study = ?
            WHERE student_id = ?
            `,
            [
                p.department,
                year,
                studentId
            ]
        );

        // ============================
        // Update 10th marks
        // ============================

        await connection.query(
            `
            UPDATE school_academics
            SET overall_percentage = ?
            WHERE
                student_id = ?
                AND level = '10th'
            `,
            [
                p.tenth,
                studentId
            ]
        );

        // ============================
        // Update 12th marks
        // ============================

        await connection.query(
            `
            UPDATE school_academics
            SET overall_percentage = ?
            WHERE
                student_id = ?
                AND level = '12th'
            `,
            [
                p.twelfth,
                studentId
            ]
        );

        // ============================
// Update College Academics
// ============================

// Remove old semester records
await connection.query(
    'DELETE FROM college_academics WHERE student_id = ?',
    [studentId]
);

// Insert semester GPAs
const semesterEntries = Object.entries(p.semesterGpa || {});

for (const [semesterKey, gpa] of semesterEntries) {

    if (gpa === '' || gpa === null || gpa === undefined) continue;

    const semester = parseInt(semesterKey.replace('sem', ''));

    await connection.query(
        `
        INSERT INTO college_academics
        (student_id, semester, gpa)
        VALUES (?, ?, ?)
        `,
        [
            studentId,
            semester,
            gpa
        ]
    );
}

// ============================
// Update Student Experience
// ============================

await connection.query(
    'DELETE FROM student_experience WHERE student_id = ?',
    [studentId]
);

await connection.query(
    `
    INSERT INTO student_experience
    (
        student_id,
        internship,
        hackathons_count,
        leadership_role,
        competitive_coding
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
        studentId,
        p.internshipExperience === 'Yes',
        p.hackathonsParticipated,
        p.leadershipRoleExperience === 'Yes',
        p.competitiveCodingExperience === 'Yes'
    ]
);

// ============================
// Update Skills
// ============================

await connection.query(
    'DELETE FROM student_skills WHERE student_id = ?',
    [studentId]
);

for (const skill of (p.skills || [])) {

    await connection.query(
        `
        INSERT INTO student_skills
        (
            student_id,
            skill_name,
            proficiency_level
        )
        VALUES (?, ?, ?)
        `,
        [
            studentId,
            skill,
            'Intermediate'
        ]
    );

}

// ============================
// Update Subject Performance
// ============================

await connection.query(
    'DELETE FROM subject_performance WHERE student_id = ?',
    [studentId]
);

for (const [subject, score] of Object.entries(p.subjects || {})) {

    await connection.query(
        `
        INSERT INTO subject_performance
        (
            student_id,
            subject_name,
            score
        )
        VALUES (?, ?, ?)
        `,
        [
            studentId,
            subject,
            score
        ]
    );

}

        await connection.commit();

        res.json({
            message: "Part 1 Updated Successfully"
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            error: "Update Failed"
        });

    } finally {

        connection.release();

    }
};