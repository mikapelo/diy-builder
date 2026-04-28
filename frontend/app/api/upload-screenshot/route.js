import { NextResponse } from 'next/server';

// Route désactivée — outil de développement supprimé pour raisons de sécurité (Path Traversal)
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
