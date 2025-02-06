require('dotenv').config();
const fs = require('fs');
const path = require('path');

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

const QaseReporter = require('wdio-qase-reporter').default || require('wdio-qase-reporter');

process.env.QASE_API_TOKEN = '91180df25cd81b812a4e7aab4d425bb0b4b1e79377f9b48edd0234391b91b74f';
process.env.QASE_PROJECT_CODE = 'SILKAPP';

const QASE_API_TOKEN = process.env.QASE_API_TOKEN;
const QASE_PROJECT_CODE = process.env.QASE_PROJECT_CODE;

// ✅ File to store Qase Test Run ID & Results
const QASE_RUN_FILE = path.resolve(__dirname, 'qase-run.json');

let qaseTestCases = [];

const propertiesFilePath = path.resolve(__dirname, 'features', 'config', 'config.properties');
const properties = Object.fromEntries(
    fs.existsSync(propertiesFilePath)
        ? fs.readFileSync(propertiesFilePath, 'utf8')
              .split('\n')
              .filter(line => line && !line.startsWith('#'))
              .map(line => line.split('=').map(part => part.trim()))
        : []
);

const isBrowserStack = properties['browserstack']?.toLowerCase().trim() === 'true';

console.log(`📂 Checking for config file at: ${propertiesFilePath}`);
console.log(`📂 File Exists? ${fs.existsSync(propertiesFilePath) ? "Yes" : "No"}`);
console.log(`📌 Running on BrowserStack: ${isBrowserStack}`);
console.log(`👤 BrowserStack User: ${properties['browserStackUser'] || "Not Set"}`);
console.log(`🔑 BrowserStack Access Key: ${properties['accessKey'] || "Not Set"}`);

console.log(`🔗 Using Qase API Token: ${QASE_API_TOKEN ? 'Yes' : 'No'}`);
console.log(`📊 Qase Project Code: ${QASE_PROJECT_CODE}`);

exports.config = {
    runner: 'local',
    path: '/wd/hub',
    port: isBrowserStack ? 443 : 4725,

    services: isBrowserStack ? ['browserstack'] : ['appium'],
    user: isBrowserStack ? properties['browserStackUser'] : undefined,
    key: isBrowserStack ? properties['accessKey'] : undefined,

    specs: ['./features/**/*.feature'],

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

    reporters: [
        'spec',
        [
            QaseReporter.default || QaseReporter,
            {
                apiToken: QASE_API_TOKEN,
                projectCode: QASE_PROJECT_CODE,
                runComplete: true,
                logging: true,
                environment: "Staging",
                runTitle: "Automated Test Run"
            }
        ]
    ],

    onPrepare: async function () {
        console.log(`🚀 Creating Qase Test Run...`);

        const response = await fetch(`https://api.qase.io/v1/run/${QASE_PROJECT_CODE}`, {
            method: 'POST',
            body: JSON.stringify({ 
                title: "Automated Test Run", 
                description: "Run triggered from WebDriverIO",
                environment: "Staging"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Token': QASE_API_TOKEN,
            }
        });

        const data = await response.json();

        if (data.result && data.result.id) {
            fs.writeFileSync(QASE_RUN_FILE, JSON.stringify({ qaseRunId: data.result.id, testResults: [] }));
            console.log(`✅ Qase Test Run Created: ${data.result.id}`);
        } else {
            console.error(`❌ Failed to create Qase Test Run.`, JSON.stringify(data, null, 2));
        }
    },

    framework: 'cucumber',

    cucumberOpts: {
        require: ['./features/step-definitions/**/*.js'],
        tagExpression: '',
        timeout: 60000,
    },

    beforeScenario: function (world, context) {
        console.log(`🔎 Running Scenario: ${world.pickle ? world.pickle.name : 'undefined'}`);

        if (world.pickle && world.pickle.tags) {
            console.log(`📌 Raw Scenario Tags Object:`, JSON.stringify(world.pickle.tags, null, 2));

            const qaseTag = world.pickle.tags.find(tag => tag.name.startsWith('@QaseId='));
            if (qaseTag) {
                const testCaseId = parseInt(qaseTag.name.replace('@QaseId=', ''), 10);
                qaseTestCases.push(testCaseId);
                console.log(`✅ Qase Test Case ID Found: ${testCaseId}`);
            } else {
                console.warn(`⚠️ No Qase Test Case ID found for this scenario!`);
            }
        }
    },

    afterScenario: async function (world, result) {
        const runData = JSON.parse(fs.readFileSync(QASE_RUN_FILE));
        const qaseRunId = runData.qaseRunId;
    
        console.log(`📤 Uploading test case results to Qase...`);
        console.log(`🔎 Using Qase Test Run ID: ${qaseRunId}`);
    
        if (!qaseRunId) {
            console.error("❌ No Test Run ID found. Make sure Test Run is created.");
            return;
        }
    
        // ✅ Fix: Extract the correct test status
        const testStatus = result.passed ? "passed" : "failed";
        console.log(`📊 WebDriverIO Test Passed: ${testStatus}`);
    
        // ✅ Extract and map step results correctly
        const steps = world.pickle.steps.map((step, index) => ({
            position: index + 1,
            action: step.text,
            expected_result: "",
            data: "",
            status: testStatus  // ✅ Assign overall test status to all steps
        }));
    
        console.log(`📋 Extracted Test Steps:`, JSON.stringify(steps, null, 2));
    
        for (let testCaseId of qaseTestCases) {
            console.log(`✅ Uploading result for Case ID: ${testCaseId} to Test Run ${qaseRunId}`);
    
            const response = await fetch(`https://api.qase.io/v1/result/${QASE_PROJECT_CODE}/${qaseRunId}`, {
                method: 'POST',
                body: JSON.stringify({ 
                    case_id: testCaseId, 
                    status: testStatus,
                    steps: steps  // ✅ Include step results
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Token': QASE_API_TOKEN,
                }
            });
    
            const data = await response.json();
            console.log(`📥 Qase API Response:`, JSON.stringify(data, null, 2));
        }
    },
    

    onComplete: async function () {
        console.log(`✅ Marking Test Run as complete...`);

        const runData = JSON.parse(fs.readFileSync(QASE_RUN_FILE));
        const qaseRunId = runData.qaseRunId;

        await fetch(`https://api.qase.io/v1/run/${QASE_PROJECT_CODE}/${qaseRunId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': QASE_API_TOKEN,
            }
        });

        console.log(`✅ Test Run ${qaseRunId} marked as completed.`);
    }
};