const { Given, When, Then } = require('@wdio/cucumber-framework');
const LoginPage = require('../../pages/LoginPage');

const loginPage = new LoginPage();

Given('I am on the login page', async () => {
    await loginPage.assertSilkHeadingDisplayed();
});

When('I click on Eng button', async () => {
    await loginPage.clickEngButton();
});

When('I click on Phone Number button', async () => {
    await loginPage.clickPhoneNoButton();
});

Then('I should see Phone No field', async () => {
    await loginPage.assertPhoneField();
});

When('I click on Phone No field', async () => {
    await loginPage.clickPhoneField();
});

// When('I enter the phone number {string}', async (phoneNumber) => {
//     await loginPage.enterPhone(phoneNumber);
// });

When('I enter the phone number {string}', async (phoneNumber) => {
    console.log('Phone Number Received:', phoneNumber); // Debug to verify the value
    await loginPage.enterPhone(phoneNumber); // Pass the phone number to the method
});


When('I click on the password field', async () => {
    await loginPage.clickPasswordField();
});

When('I enter {string}', async (password) => {
    await loginPage.enterPassword(password);
});

When('I click on Login button', async () => {
    await loginPage.clickLoginButton();
});

When('I enter OTP Code {string}', async (otpCode) => {
    await loginPage.enterOtpCode(otpCode);
});

When('I click on Verify button', async () => {
    await loginPage.clickVerifyButton();
});

When('I click on Skip button', async () => {
    await loginPage.clickSkipButton();
});

When('I should see accounts', async () => {
    await loginPage.assertAccountsVisible();
});

When('I click on Profile button', async () => {
    await loginPage.clickProfileButton();
});

When('I should see Settings button', async () => {
    await loginPage.tapAndHoldScrollUp();
});

When('I click on Sign out button', async () => {
    await loginPage.scrollToSignOutButton();
});

When('I click on Sign out button in modal', async () => {
    await loginPage.clickSignOutButtonInModal();
});