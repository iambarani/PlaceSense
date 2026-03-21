import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const [students] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
        if (students.length === 0) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

        const student = students[0];
        
        // Fetch related data
        const [school] = await pool.query('SELECT * FROM school_academics WHERE student_id = ?', [id]);
        const [college] = await pool.query('SELECT * FROM college_academics WHERE student_id = ?', [id]);
        const [experience] = await pool.query('SELECT * FROM student_experience WHERE student_id = ?', [id]);
        const [skills] = await pool.query('SELECT * FROM student_skills WHERE student_id = ?', [id]);
        const [projects] = await pool.query('SELECT * FROM student_projects WHERE student_id = ?', [id]);
        const [certifications] = await pool.query('SELECT * FROM certifications WHERE student_id = ?', [id]);
        const [performance] = await pool.query('SELECT * FROM subject_performance WHERE student_id = ?', [id]);

        return NextResponse.json({
            ...student,
            schoolAcademics: school[0] || {},
            collegeAcademics: college[0] || {},
            experience: experience,
            skills: skills.map(s => s.skill_name),
            projects: projects,
            certifications: certifications,
            subjectPerformance: performance
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { id } = await params;
    const data = await request.json();
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Update college academics
        if (data.collegeAcademics) {
            const { cgpa, backlogs, department, yearOfPassing } = data.collegeAcademics;
            await connection.query(`
                INSERT INTO college_academics (student_id, cgpa, backlogs, department, year_of_passing)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE cgpa = VALUES(cgpa), backlogs = VALUES(backlogs), 
                department = VALUES(department), year_of_passing = VALUES(year_of_passing)
            `, [id, cgpa, backlogs, department, yearOfPassing]);
        }

        // Update skills (Replace all)
        if (data.skills) {
            await connection.query('DELETE FROM student_skills WHERE student_id = ?', [id]);
            for (const skill of data.skills) {
                await connection.query('INSERT INTO student_skills (student_id, skill_name) VALUES (?, ?)', [id, skill]);
            }
        }

        // Update projects
        if (data.projects) {
            await connection.query('DELETE FROM student_projects WHERE student_id = ?', [id]);
            for (const proj of data.projects) {
                await connection.query(`
                    INSERT INTO student_projects (student_id, project_name, description, technologies, link)
                    VALUES (?, ?, ?, ?, ?)
                `, [id, proj.projectName, proj.description, proj.technologies, proj.link]);
            }
        }

        await connection.commit();
        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    } finally {
        connection.release();
    }
}
