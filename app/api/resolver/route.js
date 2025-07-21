import db from '@/lib/db';

export async function GET() {
  try {
    const pool = await db.getDbPool();

    const result = await pool.request().query(`
      SELECT DISTINCT name FROM resolver ORDER BY name;
    `);

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB GET error:', err);
    return new Response('DB error', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return new Response('Invalid name', { status: 400 });
    }

    const pool = await db.getDbPool();

    await pool.request()
      .input('name', name)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM resolver WHERE name = @name)
        BEGIN
          INSERT INTO resolver (name) VALUES (@name);
        END
      `);

    return new Response(JSON.stringify({ name }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('DB POST error:', err);
    return new Response('DB error', { status: 500 });
  }
}
