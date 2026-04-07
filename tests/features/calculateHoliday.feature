Feature: Calculate Holiday Entitlement

  Scenario Outline: Calculate statutory holiday entitlement
    Given I am on the "Calculate your holiday entitlement" start page
    When I start the holiday entitlement calculator
    And I answer "<irregularHours>" to "Does the employee work irregular hours or for part of the year?"
    And I enter <leaveDay> day <leaveMonth> month and <leaveYear> year as the leave year start date if asked
    And I choose "<entitlementsBasedOn>" as what the entitlement is based on
    And I choose to work out holiday "<holidayCalculation>"
    And I enter "<daysWorkedPerWeek>" days worked per week
    Then the statutory holiday entitlement displayed is "<entitlementDays>" days

    @smoke
    Examples: Smoke
      | irregularHours | leaveDay | leaveMonth | leaveYear | entitlementsBasedOn   | holidayCalculation    | daysWorkedPerWeek | entitlementDays |
      | Yes            | 20       | 01         | 1998      | days worked per week  | for a full leave year | 5                 | 28              |

    Examples: Full regression
      | irregularHours | leaveDay | leaveMonth | leaveYear | entitlementsBasedOn   | holidayCalculation    | daysWorkedPerWeek | entitlementDays |
      | Yes            | 20       | 01         | 1944      | days worked per week  | for a full leave year | 4                 | 22.4            |
      | Yes            | 20       | 01         | 1994      | days worked per week  | for a full leave year | 3                 | 16.8            |
      | No             | 20       | 01         | 2023      | days worked per week  | for a full leave year | 3                 | 16.8            |
      | No             | 20       | 01         | 2023      | days worked per week  | for a full leave year | 7                 | 28              |

  Scenario Outline: Show validation error for invalid days worked per week input
    Given I am on the "Calculate your holiday entitlement" start page
    When I start the holiday entitlement calculator
    And I answer "No" to "Does the employee work irregular hours or for part of the year?"
    And I enter 20 day 01 month and 2023 year as the leave year start date if asked
    And I choose "days worked per week" as what the entitlement is based on
    And I choose to work out holiday "for a full leave year"
    And I enter "<invalidDaysWorkedPerWeek>" days worked per week
    Then I should see a validation error for days worked per week

    @smoke
    Examples: Smoke
      | invalidDaysWorkedPerWeek |
      | abc                      |

    Examples: Full regression
      | invalidDaysWorkedPerWeek |
      | 0                        |
      | 8                        |