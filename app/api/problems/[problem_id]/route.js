// app/api/problems/[problem_id]/route.js
import db from '@/lib/db';

export async function DELETE(request, { params }) {
  const { problem_id } = context.params;

  try {
    const result = await db.query(
      `DELETE FROM problems WHERE problem_id = $1 RETURNING *`,
      [problem_id]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Problem deleted successfully' }), { status: 200 });
  } catch (err) {
    console.error('Error deleting problem:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete problem' }), { status: 500 });
  }
}
