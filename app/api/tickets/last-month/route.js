import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();
    const request = pool.request();

    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const startDate = lastMonth.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const result = await request.query(`
      SELECT
        period, ticket_no, ticket_type, date_created, date_closed, status,
        ext_support, problem_id, requestor, severity, shop, floor,
        area_corner, problem_type, hardware, hardware_vendor, software,
        resolver, description
      FROM ticket
      WHERE date_created >= '${startDate}' AND date_created <= '${endDate}'
    `);

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching last month tickets:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}