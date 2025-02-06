// exports.config = {
//     runner: 'local',
//     path: '/',
//     port: 4725, // Default Appium port
//     specs: ['./features/**/*.feature'],
//     capabilities: [{
//         platformName: 'Android',
//         'appium:platformVersion': '11', // Add 'appium:' prefix
//         'appium:deviceName': 'emulator-5554', // Add 'appium:' prefix
//         'appium:app': 'C:\\Users\\zubai\\OneDrive\\Desktop\\Testing-Automation-Silk\\apk\\app-staging-release-universal.apk', // Add 'appium:' prefix
//         'appium:automationName': 'UiAutomator2', // Add 'appium:' prefix
//     }],
//     logLevel: 'info',
//     services: ['appium'],
//     framework: 'mocha',
//     reporters: ['spec'],
//     mochaOpts: {
//         timeout: 60000
//     },
// };


exports.config = {
    runner: 'local',
    path: '/',
    port: 4725, // Appium server port
    specs: ['./features/**/*.feature'], // Path to feature files
    capabilities: [{
        platformName: 'Android',
        'appium:platformVersion': '11',
        'appium:deviceName': 'emulator-5554',
        'appium:app': 'C:\\Users\\zubai\\OneDrive\\Desktop\\Testing-Automation-Silk\\apk\\app-staging-release-universal.apk',
        'appium:automationName': 'UiAutomator2',
    }],
    logLevel: 'info',
    services: ['appium'],
    framework: 'cucumber', // Use Cucumber framework
    reporters: ['spec'],
    cucumberOpts: {
        require: ['./features/step-definitions/**/*.js'], // Path to step definitions
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        format: ['pretty'],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false,
    },
};
