import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();

    // Step 1: Get the latest 50 tickets by date_created
    const result = await pool.request().query(`
      SELECT TOP 50 ticket_no, date_created 
      FROM ticket 
      WHERE ticket_no IS NOT NULL
      ORDER BY [date_created] DESC;
    `);

    const tickets = result.recordset;

    // Step 2: Find the ticket with the max ticket_no among these
    const highestTicketNo = tickets.reduce((max, curr) => {
      return curr.ticket_no > max ? curr.ticket_no : max;
    }, 0);

    return new Response(JSON.stringify({ ticket_no: highestTicketNo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error:', err);
    return new Response('DB error', { status: 500 });
  }
}
