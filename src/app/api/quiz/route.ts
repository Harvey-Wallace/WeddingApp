import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo; replace with DB or external storage for production
const submissions: Record<string, unknown>[] = [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Add timestamp for uniqueness
    submissions.push({ ...data, submittedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function GET() {
  // For admin/debug: return all submissions
  return NextResponse.json({ submissions });
}
