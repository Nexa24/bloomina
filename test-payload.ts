import { getPayload } from 'payload';
import config from './payload.config';

async function test() {
  console.log('Testing payload import...');
  try {
    const payload = await getPayload({ config });
    console.log('Payload initialized!');
    process.exit(0);
  } catch (err) {
    console.error('Payload failed:', err);
    process.exit(1);
  }
}

test();
