const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    async assertSilkHeadingDisplayed() {
        const silkHeading = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]');
        await expect(silkHeading).toBeDisplayed();
        console.log('Silk heading is displayed.');
    }

    async clickEngButton() {
        const engButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[5]');
        await engButton.click();
        console.log('Clicked on the Eng button.');
    }

    async clickPhoneNoButton() {
        const phoneNoButton = await $('//android.view.View[@content-desc="Phone number"]');
        await phoneNoButton.click();
        console.log('Clicked on the Phone Number button.');
    }

    async assertPhoneField() {
        const phoneField = await $('//android.widget.EditText[@resource-id="fldFrmTel"]');
        await expect(phoneField).toBeDisplayed();
    }

    async clickPhoneField() {
        const phoneField = await $('//android.widget.EditText[@resource-id="fldFrmTel"]');
        await phoneField.click();
        console.log('Clicked on the Phone number field.');
    }

    async enterPhone(phoneNumber) {
        const phoneInput = await $('//android.widget.EditText[@resource-id="fldFrmTel"]');
        await phoneInput.waitForDisplayed({ timeout: 5000 }); // Wait for the input to appear
        await phoneInput.setValue(phoneNumber); // Enter the phone number
        console.log(`Phone number entered: ${phoneNumber}`); // Debug log
    }
    
    async clickPasswordField() {
        const passwordField = await this.getPasswordField();
        await passwordField.click();
        console.log('Clicked on the Password field.');
    }

    async enterPassword(password) {
        const passwordField = await this.getPasswordField();
        await passwordField.setValue(password);
        console.log(`Entered password: ${'*'.repeat(password.length)}`);
    }

    // Reusable method for password field locator
    async getPasswordField() {
        return await $('//android.widget.EditText[@resource-id="password"]');
    }

    async clickLoginButton() {
        const loginButton = await $('//android.widget.Button[@resource-id="kc-login"]');
        await loginButton.waitForDisplayed({ timeout: 5000 });
        await loginButton.click();
        console.log('Clicked on the Login button.');
    }

    async enterOtpCode(otpCode) {
        const otpInput = await $('//android.widget.EditText[@resource-id="OTPCodeInput--fake"]');
        await otpInput.waitForDisplayed({ timeout: 5000 });
        await otpInput.click(); // Focus the OTP input field
    
        for (const char of otpCode) {
            const keyCode = char.charCodeAt(0) - '0'.charCodeAt(0) + 7; // Calculate Android keycode for digit
            await driver.pressKeyCode(keyCode); // Simulate physical key press
            await browser.pause(500); // Add slight delay between key presses
        }
    
        console.log(`Simulated typing for OTP code: ${otpCode}`);
    }
    
    
    async clickVerifyButton() {
        const verifyButton = await $('//android.widget.Button[@text="Verify"]');
        await verifyButton.waitForDisplayed({ timeout: 5000 });
        await browser.pause(2000);
        await verifyButton.click();
        console.log('Clicked on the Verify button.');
    }

    async clickSkipButton() {
        const skipButton = await $('//android.view.View[@content-desc="Skip"]');
        await browser.pause(3000); 
        await skipButton.waitForDisplayed({ timeout: 10000 });
        await skipButton.click();
        console.log('Clicked on the Skip button.');
    }

    async assertAccountsVisible() {
        const accountsHeading = await $('//android.view.View[@content-desc="Other banks cards"]');
        await accountsHeading.waitForDisplayed({ timeout: 5000 });
        console.log('Accounts heading is visible.');
        await expect(accountsHeading).toBeDisplayed();
    }

    async clickProfileButton() {
        const profileButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[5]');
        await profileButton.waitForDisplayed({ timeout: 5000 });
        await profileButton.click();
        console.log('Clicked on the Profile button.');
    }

    // async assertSettingsButtonVisible() {
    //     const settingsButton = await $('//android.view.View[@content-desc="Settings"]');
    //     await settingsButton.waitForDisplayed({ timeout: 5000 });
    //     console.log('Settings button is visible.');
    //     await expect(settingsButton).toBeDisplayed();
    // }
    
    async tapAndHoldScrollUp() {
        const settingsElement = await $('//android.view.View[@content-desc="Settings"]');
        await settingsElement.waitForDisplayed({ timeout: 5000 }); // Ensure the element is visible
    
        // Get the element's location and size for precise scrolling
        const location = await settingsElement.getLocation(); // Get element's location
        const size = await settingsElement.getSize(); // Get element's size
    
        // Calculate the start point (center of the element)
        const startX = location.x + size.width / 2;
        const startY = location.y + size.height / 2;
    
        // Perform tap and hold, then scroll up
        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: startX, y: startY }, // Move to the element
                    { type: 'pointerDown', button: 0 }, // Tap and hold
                    { type: 'pause', duration: 1000 }, // Hold for 1 second
                    { type: 'pointerMove', duration: 1000, x: startX, y: startY - 500 }, // Scroll upward
                    { type: 'pointerUp', button: 0 } // Release
                ],
            },
        ]);
    
        console.log('Tapped and held on the Settings element, then scrolled up.');
    }
    

    async scrollToSignOutButton() {
        const signOutButton = await $('//android.view.View[@content-desc="Sign Out"]');
        // await signOutButton.scrollIntoView(); // Scroll to the Sign out button
        // console.log('Scrolled to the Sign out button.');
        // await signOutButton.waitForDisplayed({ timeout: 5000 });
        await signOutButton.click();
        console.log('Clicked on the Sign out button.');
    }

    async clickSignOutButtonInModal() {
        const signOutModalButton = await $('//android.view.View[@content-desc="Sign Out"]');
        await signOutModalButton.waitForDisplayed({ timeout: 5000 });
        await signOutModalButton.click();
        console.log('Clicked on the Sign out button in the modal.');
    }
}

module.exports = LoginPage;
