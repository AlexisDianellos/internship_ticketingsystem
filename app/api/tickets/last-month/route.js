import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filters
    const ticket_no = searchParams.get('ticket_no');
    const ticket_type = searchParams.get('ticket_type');
    const status = searchParams.get('status');
    const date_created = searchParams.get('date_created');
    const ext_support = searchParams.get('ext_support');
    const resolver = searchParams.get('resolver');
    const requestor = searchParams.get('requestor');

    // Check if any filters are set (non-empty)
    const filtersExist = [ticket_no, ticket_type, status, date_created, ext_support, resolver, requestor]
      .some(filter => filter && filter.trim() !== '');

    let query = `SELECT * FROM ticket`;
    const conditions = [];
    const requestDb = (await db.getDbPool()).request();

    if (filtersExist) {
      // ticket_no IN (...)
      if (ticket_no) {
        const ticketNos = ticket_no.split(',');
        conditions.push(`ticket_no IN (${ticketNos.map((_, i) => `@ticket_no${i}`).join(',')})`);
        ticketNos.forEach((val, i) => requestDb.input(`ticket_no${i}`, val.trim()));
      }
      if (ticket_type) {
        conditions.push(`ticket_type LIKE @ticket_type`);
        requestDb.input('ticket_type', `%${ticket_type}%`);
      }
      if (status) {
        conditions.push(`status LIKE @status`);
        requestDb.input('status', `%${status}%`);
      }
      if (date_created) {
        // Assuming already formatted DD/MM/YYYY or YYYY-MM-DD - adjust as needed
        conditions.push(`CAST(date_created AS DATE) = @date_created`);
        requestDb.input('date_created', date_created);
      }
      if (ext_support) {
        conditions.push(`ext_support LIKE @ext_support`);
        requestDb.input('ext_support', `%${ext_support}%`);
      }
      if (resolver) {
        const resolvers = resolver.split(',');
        const resolverConditions = resolvers.map((val, i) => {
          requestDb.input(`resolver${i}`, `%${val.trim()}%`);
          return `resolver LIKE @resolver${i}`;
        });
        conditions.push(`(${resolverConditions.join(' OR ')})`);
      }
      if (requestor) {
        const requestors = requestor.split(',');
        const requestorConditions = requestors.map((val, i) => {
          requestDb.input(`requestor${i}`, `%${val.trim()}%`);
          return `requestor LIKE @requestor${i}`;
        });
        conditions.push(`(${requestorConditions.join(' OR ')})`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    } else {
      // No filters: last 30 days open tickets
      const today = new Date();
      const last30days = new Date(today);
      last30days.setDate(today.getDate() - 30);
      const startDate = last30days.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      query += ` WHERE date_created >= @startDate AND date_created <= @endDate`;
      requestDb.input('startDate', startDate);
      requestDb.input('endDate', endDate);
    }

    const result = await requestDb.query(query);

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Export API error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
