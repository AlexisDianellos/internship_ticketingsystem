import db from '@/lib/db';

export async function DELETE(request, context) {
  const secretHeader = request.headers.get('x-secret'); // for API security
  const secretEnv = process.env.NEXT_PUBLIC_API_SECRET_KEY;

  if (secretHeader !== secretEnv) {
    return new Response('Unauthorized', { status: 401 });
  }

  const params = await context.params;
  const { ticket_no } = params;

  if (!ticket_no || typeof ticket_no !== 'string') {
    return new Response(JSON.stringify({ error: 'Valid ticket_no is required' }), { status: 400 });
  }

  try {
    const pool = await db.getDbPool();
    const requestDb = pool.request();

    requestDb.input('ticket_no', ticket_no);
    const deleteQuery = 'DELETE FROM ticket WHERE ticket_no = @ticket_no';

    const result = await requestDb.query(deleteQuery);

    // MSSQL-specific: use rowsAffected array
    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Ticket deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Delete Ticket Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}