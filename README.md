# Testing-Automation-Silk

This is a mobile automation testing framework built using WebDriverIO and Appium, designed to run tests on local emulators, real devices, and BrowserStack cloud devices.

1) Features: 
- Supports Android App Testing via Appium.
- Runs on Local & BrowserStack seamlessly.
- Implements Cucumber BDD for feature-driven testing.
- Auto-Handles Permissions on BrowserStack.
- Flexible Configuration via config.properties.

Install Dependencies:
- npm install

2. Set Up Local Appium Server (if running locally)
- appium

3. Run Tests

  Local Execution:
- npx wdio wdio.conf.js

  BrowserStack Execution: Update config.properties

browserstack=true
browserStackUser=your_browserstack_username
accessKey=your_browserstack_access_key

Run the tests:
- npx wdio wdio.conf.js
