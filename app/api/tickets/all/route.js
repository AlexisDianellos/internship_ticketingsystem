import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();

    const result = await pool.request().query(`
      SELECT TOP 10 * 
        FROM ticket 
        ORDER BY [date_created] DESC;
    `);

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error:', err);
    return new Response('DB error', { status: 500 });
  }
}
