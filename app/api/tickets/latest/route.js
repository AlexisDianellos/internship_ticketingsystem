import db from '@/lib/db';

export async function GET(req) {
  try {
    const pool = await db.getDbPool();

    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '40', 10);

    const openTicketsResult = await pool.request()
      .query(`
        SELECT * 
        FROM ticket 
        WHERE LTRIM(RTRIM(LOWER(status))) IN ('open', 'open extended')
        ORDER BY [date_created] DESC, [ticket_no] DESC, [description] DESC
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      `);

    //2 - Important instead of 1-Critial bc no one has ever made critical tickets
    const criticalTicketsResult = await pool.request()
      .query(`
        SELECT *
        FROM ticket
        WHERE LTRIM(RTRIM(LOWER(status))) IN ('open', 'open extended')
        AND REPLACE(LTRIM(RTRIM(LOWER(severity))), ' ', '') = '2-important'
        ORDER BY [date_created] DESC, [ticket_no] DESC, [description] DESC
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
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
