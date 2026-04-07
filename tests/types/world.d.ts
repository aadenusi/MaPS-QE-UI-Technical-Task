import type { Page } from '@playwright/test';
import type CalculateHolidayPage from '../pages/CalculateHolidayPage';

declare module '@cucumber/cucumber' {
  interface World {
    page: Page;
    calculateHolidayPage: CalculateHolidayPage;
  }
}
