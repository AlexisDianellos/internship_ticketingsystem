import { NextResponse } from 'next/server';
import db from '@/lib/db';

function convertDDMMYYYYtoYYYYMMDD(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const ticket_no = searchParams.get('ticket_no');
    const ticket_type = searchParams.get('ticket_type');
    const status = searchParams.get('status');
    const date_created_from = searchParams.get('date_created_from');
    const date_created_to = searchParams.get('date_created_to');
    const ext_support = searchParams.get('ext_support');
    const resolver = searchParams.get('resolver');
    const requestor = searchParams.get('requestor');  // <-- added

    console.log('Received search params:', {
      ticket_no,
      ticket_type,
      status,
      date_created_from,
      date_created_to,
      ext_support,
      resolver,
      requestor, // log it too
    });

    let queryText = 'SELECT * FROM ticket';
    const conditions = [];
    const queryParams = [];

    const secretHeader = request.headers.get('x-secret');
    const secretEnv = process.env.NEXT_PUBLIC_API_SECRET_KEY;

    if (secretHeader !== secretEnv) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (ticket_no) {
      const ticketNumbers = ticket_no
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(Boolean);

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

    if (date_created_from && date_created_to) {
      conditions.push(`CAST(date_created AS DATE) BETWEEN @date_created_from AND @date_created_to`);
      queryParams.push({ key: 'date_created_from', value: convertDDMMYYYYtoYYYYMMDD(date_created_from) });
      queryParams.push({ key: 'date_created_to', value: convertDDMMYYYYtoYYYYMMDD(date_created_to) });
    } else if (date_created_from) {
      conditions.push(`CAST(date_created AS DATE) >= @date_created_from`);
      queryParams.push({ key: 'date_created_from', value: convertDDMMYYYYtoYYYYMMDD(date_created_from) });
    } else if (date_created_to) {
      conditions.push(`CAST(date_created AS DATE) <= @date_created_to`);
      queryParams.push({ key: 'date_created_to', value: convertDDMMYYYYtoYYYYMMDD(date_created_to) });
    }


    if (ext_support) {
      const extSupportList = ext_support
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (extSupportList.length > 0) {
        const likeConditions = extSupportList.map((_, i) => `ext_support LIKE @ext_support_${i}`);
        conditions.push(`(${likeConditions.join(' OR ')})`);
        extSupportList.forEach((val, i) => {
          queryParams.push({ key: `ext_support_${i}`, value: `%${val}%` });
        });
      }
    }

    // Normalization function to remove spaces and dots, lowercase
    const normalize = str => str.replace(/[\s.]+/g, '').toLowerCase();

if (resolver) {
  const resolverList = resolver
    .split(',')
    .map(r => normalize(r.trim()))
    .filter(Boolean);

  if (resolverList.length > 0) {
    const placeholders = resolverList.map((_, i) => `@resolver_${i}`).join(', ');
    conditions.push(`REPLACE(REPLACE(LOWER(resolver), ' ', ''), '.', '') IN (${placeholders})`);
    resolverList.forEach((val, i) => {
      queryParams.push({ key: `resolver_${i}`, value: val });
    });
  }
}

if (requestor) {
  const requestorList = requestor
    .split(',')
    .map(r => normalize(r.trim()))
    .filter(Boolean);

  if (requestorList.length > 0) {
    const placeholders = requestorList.map((_, i) => `@requestor_${i}`).join(', ');
    conditions.push(`REPLACE(REPLACE(LOWER(requestor), ' ', ''), '.', '') IN (${placeholders})`);
    requestorList.forEach((val, i) => {
      queryParams.push({ key: `requestor_${i}`, value: val });
    });
  }
}


    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ` ORDER BY date_created DESC`;

    console.log('Final SQL Query:', queryText);
    console.log('Query Parameters:', queryParams);

    const pool = await db.getDbPool();
    const req = pool.request();

    queryParams.forEach(param => {
      console.log(`Binding param: ${param.key} = ${param.value}`);
      req.input(param.key, param.value);
    });

    const result = await req.query(queryText);

    console.log('Query returned', result.recordset.length, 'records');

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
