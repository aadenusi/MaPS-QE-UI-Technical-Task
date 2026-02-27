Feature: Holiday Entitlement Calculator for employess if the job was started on or before 1 October 1998

  Scenario Outline: Calculate holiday entitlement for an employee with irregular hours
    Given I am on the "Calculate your holiday entitlement" start page
    When I start the holiday entitlement calculator
    And I answer "<irregularHours>" to "Does the employee work irregular hours or for part of the year?"
    And I enter <leaveDay> day <leaveMonth> month and <leaveYear> year as the leave year start date
    And I choose "<entitlementsBasedOn>" as what the entitlement is based on
    And I choose to work out holiday "<holidayCalculation>"
    And I enter "<daysWorkedPerWeek>" days worked per week
    Then the statutory holiday entitlement displayed is "<entitlementDays>" days

    Examples:
      | irregularHours | leaveDay | leaveMonth | leaveYear | entitlementsBasedOn   | holidayCalculation    | daysWorkedPerWeek | entitlementDays |
      | Yes            | 20       | 01         | 1998      | days worked per week  | for a full leave year | 5                 | 28              |
      | Yes            | 20       | 01         | 1944      | days worked per week  | for a full leave year | 4                 | 22.4            |
      | Yes            | 20       | 01         | 1994      | days worked per week  | for a full leave year | 3                 | 16.8            |

Scenario Outline: Calculate holiday entitlement for an employee with regular hours who has worked 72hrs
    Given I am on the "Calculate your holiday entitlement" start page
    When I start the holiday entitlement calculator
    And I answer "<irregularHours>" to "Does the employee work irregular hours or for part of the year?"
    And I choose "<entitlementsBasedOn>" as what the entitlement is based on
    And I choose to work out holiday "<holidayCalculation>"
    And I enter "<daysWorkedPerWeek>" days worked per week
    Then the statutory holiday entitlement displayed is "<entitlementDays>" days

    Examples:
      | irregularHours | leaveDay | leaveMonth | leaveYear | entitlementsBasedOn   | holidayCalculation   | daysWorkedPerWeek | entitlementDays |
      | No            | 20       | 01         | 2023      | days worked per week  | for a full leave year | 3                 | 16.8            |