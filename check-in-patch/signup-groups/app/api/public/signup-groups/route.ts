import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { listSiteSignupGroups, toPublicSignupGroups } from '@/lib/site-signup-groups';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase är inte konfigurerat.' },
        { status: 500, headers: corsHeaders },
      );
    }

    const supabase = createClient(url, anonKey);
    const rows = await listSiteSignupGroups(supabase);

    return NextResponse.json(
      { groups: toPublicSignupGroups(rows) },
      {
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('GET /api/public/signup-groups failed:', error);
    return NextResponse.json(
      { error: 'Kunde inte ladda gruppinformation.' },
      { status: 500, headers: corsHeaders },
    );
  }
}
