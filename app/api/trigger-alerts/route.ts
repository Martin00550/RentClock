import { NextRequest, NextResponse } from 'next/server';
import { processLeaseReminders } from '@/lib/reminder-service';

export async function GET(req: NextRequest) {
    // Secure this endpoint. It triggers emails, we don't want spam loops.
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const result = await processLeaseReminders();
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
