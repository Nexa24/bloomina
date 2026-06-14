import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Products } from './collections/Products'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = process.env.DATABASE_URI || 'file:./bloomina.db'

console.log('--- Payload Init: Using DATABASE_URI:', process.env.DATABASE_URI?.substring(0, 20) + '...');
// Force reload to apply schema changes


export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Products,
    Media,
    Orders,
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: false, // Optional by default
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('PAYLOAD_SECRET is required in production');
    }
    return secret || 'bloomina-secret-key-dev';
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseUri.startsWith('postgres') 
    ? postgresAdapter({
        pool: {
          connectionString: databaseUri,
          ssl: {
            rejectUnauthorized: false,
          },
        },
        push: false,
      })
    : sqliteAdapter({
        client: {
          url: databaseUri,
        },
      }),
})
