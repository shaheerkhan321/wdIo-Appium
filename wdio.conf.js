// exports.config = {
//     runner: 'local',
//     path: '/',
//     port: 4725, // Appium server port
//     specs: ['./features/**/*.feature'], // Path to feature files
//     capabilities: [{
//         platformName: 'Android',
//         'appium:platformVersion': '11',
//         'appium:deviceName': 'emulator-5554',
//         'appium:app': 'C:\\Users\\zubai\\OneDrive\\Desktop\\Testing-Automation-Silk\\apk\\app-staging-release-universal.apk',
//         'appium:automationName': 'UiAutomator2',
//     }],
//     logLevel: 'info',
//     services: ['appium'],
//     framework: 'cucumber', // Use Cucumber framework
//     reporters: ['spec'],
//     cucumberOpts: {
//         require: ['./features/step-definitions/**/*.js'], // Path to step definitions
//         backtrace: false,
//         requireModule: [],
//         dryRun: false,
//         failFast: false,
//         format: ['pretty'],
//         snippets: true,
//         source: true,
//         strict: false,
//         tagExpression: '',
//         timeout: 60000,
//         ignoreUndefinedDefinitions: false,
//     },
// };

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ✅ Load properties from `features/config/config.properties`
const propertiesFilePath = path.resolve(__dirname, 'features', 'config', 'config.properties');
const properties = Object.fromEntries(
    fs.existsSync(propertiesFilePath)
        ? fs.readFileSync(propertiesFilePath, 'utf8')
              .split('\n')
              .filter(line => line && !line.startsWith('#')) // Ignore empty lines & comments
              .map(line => line.split('=').map(part => part.trim()))
        : []
);

// ✅ Convert `browserstack` value to Boolean (true/false)
const isBrowserStack = properties['browserstack']?.toLowerCase().trim() === 'true';

// ✅ Debugging Logs to Confirm Config is Loaded
console.log(`📂 Checking for config file at: ${propertiesFilePath}`);
console.log(`📂 File Exists? ${fs.existsSync(propertiesFilePath) ? "Yes" : "No"}`);
console.log(`📌 Running on BrowserStack: ${isBrowserStack}`);
console.log(`👤 BrowserStack User: ${properties['browserStackUser'] || "Not Set"}`);
console.log(`🔑 BrowserStack Access Key: ${properties['accessKey'] || "Not Set"}`);

exports.config = {
    runner: 'local',
    path: '/wd/hub',
    port: isBrowserStack ? 443 : 4725,

    // ✅ Services Configuration (Switching between Local & BrowserStack)
    services: isBrowserStack ? ['browserstack'] : ['appium'],

    // ✅ Set BrowserStack Credentials
    user: isBrowserStack ? properties['browserStackUser'] : undefined,
    key: isBrowserStack ? properties['accessKey'] : undefined,

    specs: ['./features/**/*.feature'], // Path to Cucumber feature files

    // ✅ Dynamic Capabilities for Local & BrowserStack Execution
    capabilities: isBrowserStack
        ? [{
            platformName: 'Android',
            'appium:deviceName': properties['browserstackDevice'] || 'Samsung Galaxy S22 Ultra',
            'appium:platformVersion': properties['browserstackOS'] || '12.0',
            'appium:automationName': 'UiAutomator2',
            'appium:autoGrantPermissions': true,
            'bstack:options': {
                projectName: 'WebDriverIO Mobile Automation',
                buildName: 'BrowserStack Build',
                sessionName: 'Automated Test Run',
                debug: true,
                networkLogs: true,
                appiumVersion: '1.22.0'
            },
            'appium:app': properties['BROWSERSTACK_APP_ID']
        }]
        : [{
            platformName: properties['platformName'] || 'Android',
            'appium:deviceName': properties['deviceName'] || 'emulator-5554',
            'appium:platformVersion': properties['platformVersion'] || '11',
            'appium:automationName': properties['automationName'] || 'UiAutomator2',
            'appium:app': path.join(__dirname, 'apk', properties['androidapk'] || 'app-staging-release-universal.apk')
        }],

    logLevel: 'info',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    framework: 'cucumber',
    reporters: ['spec'],

    cucumberOpts: {
        require: ['./features/step-definitions/**/*.js'],
        timeout: 60000,
    },
};
