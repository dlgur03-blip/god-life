import { cookies } from 'next/headers';
import { DEFAULT_TIMEZONE } from './date';

const TIMEZONE_COOKIE_NAME = 'user-timezone';

// Get user's timezone from cookie (server-side only)
export async function getUserTimezone(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(TIMEZONE_COOKIE_NAME)?.value || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}
