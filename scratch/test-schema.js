const { getPayload } = require('payload');
const config = require('./payload.config').default;

async function test() {
  try {
    const payload = await getPayload({ config });
    console.log('Payload initialized successfully');
    
    // Check fields of products collection
    const products = payload.collections.products;
    console.log('Fields in products collection:');
    products.config.fields.forEach(f => {
      console.log(`- ${f.name} (${f.type})`);
    });
    
    // Try to fetch one product
    const result = await payload.find({
      collection: 'products',
      limit: 1,
    });
    console.log('Fetch successful! Found:', result.totalDocs, 'products');
  } catch (error) {
    console.error('Payload test failed:', error);
  }
  process.exit(0);
}

test();
