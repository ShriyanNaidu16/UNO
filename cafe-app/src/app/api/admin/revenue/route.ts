import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import * as jose from 'jose';

// Define the expected output format
type RevenueData = {
  upi: number;
  card: number;
  cash: number;
  total: number;
  hourly: {
    hour: string;
    upi: number;
    card: number;
    cash: number;
  }[];
};

export async function GET(request: Request) {
  try {
    // 1. JWT Authentication (Bypass for demo/local testing with dummy-token)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token !== 'dummy-token') {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development');
      try {
        await jose.jwtVerify(token, secret);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
    }

    // 2. Parse Date
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // YYYY-MM-DD
    const targetDate = dateParam ? new Date(`${dateParam}T00:00:00Z`) : new Date();
    
    // Set start and end of the day for filtering (using UTC to prevent timezone offset bugs)
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // 3. Fetch Data from Supabase
    const { data: bills, error } = await supabase
      .from('bills')
      .select('total_amount, payment_method, payment_date')
      .eq('payment_status', 'paid')
      .gte('payment_date', startOfDay.toISOString())
      .lte('payment_date', endOfDay.toISOString());

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // 4. Calculate Revenue
    const revenue: RevenueData = {
      upi: 0,
      card: 0,
      cash: 0,
      total: 0,
      hourly: Array.from({ length: 24 }).map((_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        upi: 0,
        card: 0,
        cash: 0,
      })),
    };

    if (bills && bills.length > 0) {
      bills.forEach((bill) => {
        // Amounts in paise internally. Convert to INR for the API output.
        // Assuming DB stores paise: e.g., 15000 for 150 INR.
        const amountInPaise = Number(bill.total_amount);
        const amountInINR = amountInPaise / 100;
        const method = bill.payment_method as 'upi' | 'card' | 'cash';
        
        if (method === 'upi' || method === 'card' || method === 'cash') {
          revenue[method] += amountInINR;
          revenue.total += amountInINR;

          // Hourly bucket
          if (bill.payment_date) {
            const date = new Date(bill.payment_date);
            const hour = date.getHours();
            revenue.hourly[hour][method] += amountInINR;
          }
        }
      });
    }

    return NextResponse.json(revenue);
  } catch (error) {
    console.error('Revenue API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
