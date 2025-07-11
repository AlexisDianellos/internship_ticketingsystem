import db from '@/lib/db';

export async function POST(req) {
  try {
    const pool = await db.getDbPool();
    const ticket = await req.json();

    const request = pool.request();

    // Bind all params, converting your data to correct SQL types
    request.input('ticket_no', ticket.ticket_no);
    request.input('period', ticket.period);
    request.input('ticket_type', ticket.ticket_type);
    request.input('date_created', ticket.date_created);
    request.input('date_closed', ticket.date_closed);
    request.input('status', ticket.status);
    request.input('ext_support', ticket.ext_support);
    request.input('problem_id', ticket.problem_id);
    request.input('requestor', ticket.requestor);
    request.input('severity', ticket.severity);
    request.input('shop', ticket.shop);
    request.input('floor', ticket.floor);
    request.input('area_corner', ticket.area_corner);
    request.input('problem_type', ticket.problem_type);
    request.input('hardware', ticket.hardware);
    request.input('hardware_vendor', ticket.hardware_vendor);
    request.input('software', ticket.software);
    request.input('resolver', ticket.resolver);
    request.input('description', ticket.description);

    const query = `
      INSERT INTO ticket (
        ticket_no,
        period,
        ticket_type,
        date_created,
        date_closed,
        status,
        ext_support,
        problem_id,
        requestor,
        severity,
        shop,
        floor,
        area_corner,
        problem_type,
        hardware,
        hardware_vendor,
        software,
        resolver,
        description
      )
      OUTPUT INSERTED.*
      VALUES (
        @ticket_no,
        @period,
        @ticket_type,
        @date_created,
        @date_closed,
        @status,
        @ext_support,
        @problem_id,
        @requestor,
        @severity,
        @shop,
        @floor,
        @area_corner,
        @problem_type,
        @hardware,
        @hardware_vendor,
        @software,
        @resolver,
        @description
      )
    `;

    const result = await request.query(query);

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error:', err);
    return new Response('DB error', { status: 500 });
  }
}
