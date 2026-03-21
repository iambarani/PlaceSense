import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const [rows] = await pool.query(`
            SELECT pp.*, c.name as company 
            FROM placement_predictions pp
            JOIN companies c ON pp.company_id = c.id
            WHERE pp.student_id = ?
            ORDER BY pp.date DESC
        `, [id]);
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
