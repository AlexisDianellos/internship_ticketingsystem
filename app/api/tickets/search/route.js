import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const ticket_no = searchParams.get('ticket_no');
    const ticket_type = searchParams.get('ticket_type');
    const status = searchParams.get('status');
    const date_created = searchParams.get('date_created');
    const ext_support = searchParams.get('ext_support');

    let queryText = 'SELECT * FROM ticket';
    const conditions = [];
    const queryParams = [];

    const secretHeader = request.headers.get('x-secret');//secret for sec
    const secretEnv = process.env.NEXT_PUBLIC_API_SECRET_KEY;

    if (secretHeader !== secretEnv) {
    return new Response('Unauthorized', { status: 401 });
    }

    // Build conditions
    if (ticket_no) {
      const ticketNumbers = ticket_no.split(',').map(num => parseInt(num.trim())).filter(Boolean);
      if (ticketNumbers.length > 0) {
        const placeholders = ticketNumbers.map((_, i) => `@ticket_no_${i}`).join(', ');
        conditions.push(`ticket_no IN (${placeholders})`);
        ticketNumbers.forEach((val, i) => {
          queryParams.push({ key: `ticket_no_${i}`, value: val });
        });
      }
    }

    if (ticket_type) {
      conditions.push(`ticket_type LIKE @ticket_type`);
      queryParams.push({ key: 'ticket_type', value: `%${ticket_type}%` });
    }

    if (status) {
      conditions.push(`status LIKE @status`);
      queryParams.push({ key: 'status', value: `%${status}%` });
    }

    if (date_created) {
      // Match exact date ignoring time
      const [day, month, year] = date_created.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      conditions.push(`CAST(date_created AS DATE) = @date_created`);
      queryParams.push({ key: 'date_created',value: formattedDate });
    }

    if (ext_support) {
      conditions.push(`ext_support LIKE @ext_support`);
      queryParams.push({ key: 'ext_support', value: `%${ext_support}%` });
    }

    // Finalize SQL
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    const pool = await db.getDbPool();
    const req = pool.request();

    // Bind parameters
    queryParams.forEach(param => {
      req.input(param.key, param.value);
    });

    const result = await req.query(queryText);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
