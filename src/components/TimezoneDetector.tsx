'use client';

import { useEffect } from 'react';

const TIMEZONE_COOKIE_NAME = 'user-timezone';

export default function TimezoneDetector() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Check if cookie already has the correct timezone
    const existingTimezone = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${TIMEZONE_COOKIE_NAME}=`))
      ?.split('=')[1];

    if (existingTimezone !== timezone) {
      // Set cookie with 1 year expiry, accessible from server
      document.cookie = `${TIMEZONE_COOKIE_NAME}=${timezone}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  return null;
}
