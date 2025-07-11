import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();

    const problemsResult = await pool.request()
      .query(`
        SELECT TOP 25 * FROM dbo.problems ORDER BY date_started DESC;
      `);

    return new Response(JSON.stringify(problemsResult.recordset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error (problems):', err);
    return new Response('DB error', { status: 500 });
  }
}
