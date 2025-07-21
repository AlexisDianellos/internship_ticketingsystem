import db from '@/lib/db';

export async function PATCH(request) {
  try {
    const contentLength = request.headers.get('content-length');
    if (!contentLength || parseInt(contentLength, 10) === 0) {
      return new Response(JSON.stringify({ error: 'Empty request body' }), { status: 400 });
    }

    const data = await request.json();
    const {
      problem_id,
      problem_description,
      date_started,
      date_closed,
      status,
      type,
      impact,
      ext_support,
      comments,
    } = data;

    const pool = await db.getDbPool();
    const requestSQL = pool.request();

    requestSQL.input('problem_id', problem_id);
    requestSQL.input('problem_description', problem_description);
    requestSQL.input('date_started', date_started);
    requestSQL.input('date_closed', date_closed);
    requestSQL.input('status', status);
    requestSQL.input('type', type);
    requestSQL.input('impact', impact);
    requestSQL.input('ext_support', ext_support);
    requestSQL.input('comments', comments);

    const result = await requestSQL.query(`
      UPDATE problems
      SET problem_description = @problem_description,
          date_started = @date_started,
          date_closed = @date_closed,
          status = @status,
          type = @type,
          impact = @impact,
          ext_support = @ext_support,
          comments = @comments
      WHERE problem_id = @problem_id;
    `);

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error editing problem:', err);
    return new Response(JSON.stringify({ error: 'Failed to update problem' }), { status: 500 });
  }
}