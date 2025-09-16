import { LoginPage } from '../pages/login_page';
import { PortalHome } from '../pages/portal_home_page';
import { PortalRelatorio } from '../pages/portal_relatorio_page';
import { PortalEscala } from '../pages/porta_escala_page';
import { test, expect } from '@playwright/test';
import { LoginHelpers } from "../helpers/login_helpers";
const PSW = process.env.CONNECT_PASSWORD
const MGR = process.env.CONNECT_MGR
const URL_BASE = process.env.CONNECT_URL

// npx playwright test suite_manager.test.ts

test("Validates report generation by the Store Manager", {tag: '@GerenteLoja'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalRelatorio = new PortalRelatorio(page);

  await loginHelpers.navegateInline(URL_BASE);
  await loginPage.setEmail(MGR);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnRelatorios();
  await portalRelatorio.selectCurrentMonthReport();
  await portalRelatorio.validIfNotSent();
  await portalRelatorio.deleteItensTable();
  await portalRelatorio.selectSundaysWorkedTable();
  await portalRelatorio.btnSend();
  await portalRelatorio.btnConfirm();
  await portalRelatorio.valid();
});


test("Validates generation of the time off scale by the Store Manager", {tag: '@GerenteLoja'}, async ({ page }) => {
  test.setTimeout(420000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalEscala = new PortalEscala(page);

  await loginHelpers.navegateInline(URL_BASE);

  await loginPage.setEmail(MGR);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnFolgas();
  await portalEscala.selectCurrentMonthReport();
  await portalEscala.validIfNotSent();
  await portalEscala.selectsRandomDaysOff('Folga (F)');
  await portalEscala.btnSend();
  await portalEscala.valid();
});