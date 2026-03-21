import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const [rows] = await pool.query('SELECT * FROM company_expectations WHERE company_id = ?', [id]);
        return NextResponse.json(rows[0] || {});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
