import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    try {
        const { studentId, companyId, probability, strength, weakness, suggestions } = await request.json();
        await pool.query(`
            INSERT INTO placement_predictions (student_id, company_id, probability, strength, weakness, suggestions, date)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `, [studentId, companyId, probability, JSON.stringify(strength), JSON.stringify(weakness), JSON.stringify(suggestions)]);
        return NextResponse.json({ message: 'Prediction saved successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save prediction' }, { status: 500 });
    }
}
