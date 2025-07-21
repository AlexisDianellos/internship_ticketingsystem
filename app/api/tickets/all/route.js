import db from '@/lib/db';

export async function GET(req) {
  try {

    const pool = await db.getDbPool();

    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '40', 10);

    const result = await pool.request().query(`
      SELECT * 
      FROM ticket 
      ORDER BY [date_created] DESC, [ticket_no] DESC, [description] DESC
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
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
