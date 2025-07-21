// app/api/tickets/edit/route.js
import db from '@/lib/db';

export async function PATCH(request) {
  try {
let body = {};

try {
  body = await request.json();
} catch (e) {
  return new Response(JSON.stringify({ error: 'Invalid or empty JSON body' }), {
    status: 400,
  });
}

    const secretHeader = request.headers.get('x-secret');//secret for sec
    const secretEnv = process.env.NEXT_PUBLIC_API_SECRET_KEY;

    if (secretHeader !== secretEnv) {
    return new Response('Unauthorized', { status: 401 });
  }

    const {
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
    } = body;

    if (!ticket_no) {
      return new Response(JSON.stringify({ error: 'ticket_no is required to update' }), {
        status: 400,
      });
    }

    const pool = await db.getDbPool();
    const requestSQL = pool.request();

    requestSQL.input('ticket_no', ticket_no);
    requestSQL.input('period', period);
    requestSQL.input('ticket_type', ticket_type);
    requestSQL.input('date_created', date_created);
    requestSQL.input('date_closed', date_closed);
    requestSQL.input('status', status);
    requestSQL.input('ext_support', ext_support);
    requestSQL.input('problem_id', problem_id);
    requestSQL.input('requestor', requestor);
    requestSQL.input('severity', severity);
    requestSQL.input('shop', shop);
    requestSQL.input('floor', floor);
    requestSQL.input('area_corner', area_corner);
    requestSQL.input('problem_type', problem_type);
    requestSQL.input('hardware', hardware);
    requestSQL.input('hardware_vendor', hardware_vendor);
    requestSQL.input('software', software);
    requestSQL.input('resolver', resolver);
    requestSQL.input('description', description);

    const result = await requestSQL.query(`
      UPDATE ticket SET
        period = @period,
        ticket_type = @ticket_type,
        date_created = @date_created,
        date_closed = @date_closed,
        status = @status,
        ext_support = @ext_support,
        problem_id = @problem_id,
        requestor = @requestor,
        severity = @severity,
        shop = @shop,
        floor = @floor,
        area_corner = @area_corner,
        problem_type = @problem_type,
        hardware = @hardware,
        hardware_vendor = @hardware_vendor,
        software = @software,
        resolver = @resolver,
        description = @description
      WHERE ticket_no = @ticket_no;
    `);

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Edit Ticket Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
