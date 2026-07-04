import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export function createAdminClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let serviceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY

  // Fallback: Read directly from .env file if running locally and process.env is missing it
  if (!serviceRoleKey || !url) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const envVars: Record<string, string> = {};
        envContent.split('\n').forEach(line => {
          const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            // Remove quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            envVars[key] = val;
          }
        });
        
        if (!url) url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
        if (!serviceRoleKey) {
          serviceRoleKey = envVars['NEXT_SUPABASE_SERVICE_ROLE_KEY'] || envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['SERVICE_ROLE_KEY'];
        }
      }
    } catch (e) {
      console.error('Failed to read .env file directly:', e);
    }
  }

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server credentials are not configured')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
