import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to login page (303 to switch from POST to GET)
  return NextResponse.redirect(new URL('/login', request.url), 303);
}
