import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();

    // Fetch latest open tickets
    const openTicketsResult = await pool.request()
      .query(`
        SELECT TOP 10 * 
        FROM ticket 
        WHERE LTRIM(RTRIM(LOWER(status))) IN ('open', 'open extended')
        ORDER BY [date_created] DESC;
      `);

    // Fetch latest open critical tickets (example: severity = '3 - Basic')
    const criticalTicketsResult = await pool.request()
      .query(`
        SELECT TOP 10 *
        FROM ticket
        WHERE LTRIM(RTRIM(LOWER(status))) IN ('open', 'open extended')
        AND REPLACE(LTRIM(RTRIM(LOWER(severity))), ' ', '') = '2-important'
        ORDER BY [date_created] DESC;
      `);

    const responseData = {
      openTickets: openTicketsResult.recordset,
      criticalTickets: criticalTicketsResult.recordset,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error:', err);
    return new Response('DB error', { status: 500 });
  }
}
