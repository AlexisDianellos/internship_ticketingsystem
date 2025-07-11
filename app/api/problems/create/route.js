import db from '@/lib/db';

export async function POST(req) {
  try {
    const problem = await req.json();
    const pool = await db.getDbPool();
    const request = pool.request();

    // Bind all problem fields as inputs
    request.input('problem_id', problem.id);
    request.input('problem_description', problem.problem_description);
    request.input('date_started', problem.date_started);
    request.input('date_closed', problem.date_closed);
    request.input('status', problem.status);
    request.input('type', problem.type);
    request.input('impact', problem.impact);
    request.input('ext_support', problem.ext_support);
    request.input('comments', problem.comments);

    const query = `
      INSERT INTO dbo.problems (
        problem_id,
        problem_description,
        date_started,
        date_closed,
        status,
        type,
        impact,
        ext_support,
        comments
      )
      OUTPUT INSERTED.*
      VALUES (
        @problem_id,
        @problem_description,
        @date_started,
        @date_closed,
        @status,
        @type,
        @impact,
        @ext_support,
        @comments
      )
    `;

    const result = await request.query(query);

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB error (create problem):', err);
    return new Response('DB error', { status: 500 });
  }
}
