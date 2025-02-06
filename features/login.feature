Feature: Login Functionality

@QaseId=633
  Scenario: User logs in successfully
    Given I am on the login page
    When I click on Eng button
    And I click on Phone Number button
    Then I should see Phone No field
    When I click on Phone No field
    And I enter the phone number '591708260'
    And I click on the password field
    And I enter "Xatu@123"
    And I click on Login button
    And I enter OTP Code "2222"
    And I click on Verify button
    And I click on Skip button
    Then I should see accounts
    When I click on Profile button
    Then I should see Settings button
    And I click on Sign out button
    And I click on Sign out button in modal


