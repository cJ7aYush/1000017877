const { Log, Logger } = require('./dist/index');

async function demo() {
  console.log('Testing Logging Middleware...\n');

  // Test basic Log function
  console.log('1. Testing basic Log function:');
  const result1 = await Log('backend', 'error', 'handler', 'received string, expected bool');
  console.log('Result:', result1);

  // Test fatal log
  console.log('\n2. Testing fatal log:');
  const result2 = await Log('backend', 'fatal', 'db', 'Critical database connection failure.');
  console.log('Result:', result2);

  // Test Logger convenience methods
  console.log('\n3. Testing Logger convenience methods:');
  
  const debugResult = await Logger.debug('frontend', 'component', 'Component mounted successfully');
  console.log('Debug result:', debugResult);

  const infoResult = await Logger.info('frontend', 'api', 'API request initiated');
  console.log('Info result:', infoResult);

  const warnResult = await Logger.warn('frontend', 'hook', 'Deprecated hook usage detected');
  console.log('Warn result:', warnResult);

  const errorResult = await Logger.error('frontend', 'page', 'Page failed to load');
  console.log('Error result:', errorResult);

  const fatalResult = await Logger.fatal('backend', 'db', 'Database connection lost');
  console.log('Fatal result:', fatalResult);

  console.log('\nDemo completed!');
}

demo().catch(console.error);
