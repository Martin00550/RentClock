import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/actions/test-email';

export async function GET() {
    const result = await sendTestEmail();
    return NextResponse.json(result);
}
