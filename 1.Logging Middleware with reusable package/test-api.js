const { Log, Logger } = require('./dist/index');

async function testLoggingAPI() {
  console.log('🧪 Testing Logging Middleware with API Integration...\n');

  try {
    // Test 1: Basic Log function with API credentials
    console.log('1. Testing basic Log function with API:');
    const result1 = await Log('backend', 'error', 'handler', 'received string, expected bool');
    console.log('✅ Result:', result1);
    console.log('');

    // Test 2: Fatal log
    console.log('2. Testing fatal log:');
    const result2 = await Log('backend', 'fatal', 'db', 'Critical database connection failure.');
    console.log('✅ Result:', result2);
    console.log('');

    // Test 3: Frontend logs
    console.log('3. Testing frontend logs:');
    const frontendResult = await Log('frontend', 'info', 'component', 'React component mounted successfully');
    console.log('✅ Frontend Result:', frontendResult);
    console.log('');

    // Test 4: Logger convenience methods
    console.log('4. Testing Logger convenience methods:');
    
    const debugResult = await Logger.debug('frontend', 'component', 'Component mounted successfully');
    console.log('✅ Debug result:', debugResult);

    const infoResult = await Logger.info('frontend', 'api', 'API request initiated');
    console.log('✅ Info result:', infoResult);

    const warnResult = await Logger.warn('frontend', 'hook', 'Deprecated hook usage detected');
    console.log('✅ Warn result:', warnResult);

    const errorResult = await Logger.error('frontend', 'page', 'Page failed to load');
    console.log('✅ Error result:', errorResult);

    const fatalResult = await Logger.fatal('backend', 'db', 'Database connection lost');
    console.log('✅ Fatal result:', fatalResult);

    console.log('\n🎉 All tests completed successfully!');
    console.log('📊 Logs have been sent to the evaluation server with proper authentication.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLoggingAPI().catch(console.error);
