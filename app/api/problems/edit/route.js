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

    const res = await db.query(
      `UPDATE problems
       SET problem_description = $1,
           date_started = $2,
           date_closed = $3,
           status = $4,
           type = $5,
           impact = $6,
           ext_support = $7,
           comments = $8
       WHERE problem_id = $9
       RETURNING *`,
      [
        problem_description,
        date_started,
        date_closed,
        status,
        type,
        impact,
        ext_support,
        comments,
        problem_id,
      ]
    );

    if (res.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(res.rows[0]), { status: 200 });
  } catch (err) {
    console.error('Error editing problem:', err);
    return new Response(JSON.stringify({ error: 'Failed to update problem' }), { status: 500 });
  }
}
