import { LoginPage } from '../pages/login_page';
import { PortalHome } from '../pages/portal_home_page';
import { PortalRelatorio } from '../pages/portal_relatorio_page';
import { PortalBeneficio } from '../pages/portal_beneficio_page';
import { PortalFeriados } from '../pages/portal_feriados_page';
import { PortalEscala } from '../pages/porta_escala_page';
import { PortalMotivos } from '../pages/portal_motivos-page';
import { test, expect } from '@playwright/test';
import { LoginHelpers } from "../helpers/login_helpers";
const PSW = process.env.CONNECT_PASSWORD
const HRA = process.env.CONNECT_HRA
const URL_BASE = process.env.CONNECT_URL
const LOJA = "BARRA RIO";

// npx playwright test suite_hra.test.ts

test("Validates registers benefits and validates report value by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(360000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalRelatorio = new PortalRelatorio(page);
  const portalBeneficio = new PortalBeneficio(page);

  await loginHelpers.navegateInline(URL_BASE);
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnBeneficios();

  await portalBeneficio.selectStore("CENTER NORTE");
  await portalBeneficio.validIfNotSent();
  const values = await portalBeneficio.setEmployeeBenefitValue("22,00", "25,00", "30,00", "30,00", "40,00", "30,00", "30,00", "45,00", "50,00");

  await portalBeneficio.btnBack();

  await portalHome.clickBtnRelatorios();

  await portalRelatorio.selectCurrentMonthReport();
  await portalRelatorio.selectStore("CENTER NORTE");
  await portalRelatorio.validIfNotSent();
  const totalValueReport = await portalRelatorio.selectRandomSundaysWorkedTable(values.vlrSunday, values.vlrHoliday);
  await portalRelatorio.btnValidar();
  const valueReport = await portalRelatorio.getValueReport();
  expect(totalValueReport).toEqual(valueReport);
  await portalRelatorio.valid();
});


test("Validates the registration of reasons for absence by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalMotivos = new PortalMotivos(page);
  const portalEscala = new PortalEscala(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnMotivos();

  await portalMotivos.inputNameReasons("Motivo Teste");
  await portalMotivos.inputCode("MT");
  await portalMotivos.inputCodeExt("171");
  await portalMotivos.btnComboBoxActivate("Sim");
  await portalMotivos.btnAdd();
  await portalMotivos.validReason("MT");

  await portalHome.btnBack();
  await portalHome.clickBtnFolgas();

  await portalEscala.selectCurrentMonthReport();
  await portalEscala.selectStore("ELDORADO");
  await portalEscala.validReason('Motivo Teste (MT)');

  await portalHome.btnBack(); 
  await portalHome.clickBtnMotivos();
  
  await portalMotivos.deleteReason("MT");
});


test("Validates assigning benefit values by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalBeneficio = new PortalBeneficio(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnBeneficios();

  await portalBeneficio.selectStore(LOJA);
  await portalBeneficio.validIfNotSent();
  const values = await portalBeneficio.setEmployeeBenefitValue("15,00", "25,00", "30,00", "30,00", "40,00", "30,00", "30,00", "45,00", "50,00");
  await loginHelpers.saveValues(values, 'valores');
});


test("Validates creation of regional holiday by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalFeriados = new PortalFeriados(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnFeriados();

  await portalFeriados.setDay(15);
  await portalFeriados.selectStore(LOJA);
  await portalFeriados.inputDescription("Teste Criação Feriado Regional");
  await portalFeriados.btnAdd();
  await portalFeriados.validStoreHoliday("Teste Criação Feriado Regional", LOJA);
  await portalFeriados.validHoliday("Teste Criação Feriado Regional");
  await portalFeriados.validHolidayDeleted("Teste Criação Feriado Regional");
});


test("Validates report generation by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalRelatorio = new PortalRelatorio(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnRelatorios();

  await portalRelatorio.selectCurrentMonthReport();
  await portalRelatorio.selectStore(LOJA)
  await portalRelatorio.validIfNotSent();
  await portalRelatorio.selectSundaysWorkedTable();
  await portalRelatorio.btnValidar();
  await portalRelatorio.valid();
});


test("Validates the specification of holiday days by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalFeriados = new PortalFeriados(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnFeriados();

  await portalFeriados.setDay(28);
  await portalFeriados.selectStore("Todas as lojas");
  await portalFeriados.inputDescription("Teste Criação");
  await portalFeriados.btnAdd();
  await portalFeriados.validHoliday("Teste Criação");
  await portalFeriados.validHolidayDeleted("Teste Criação");
});


test("Validates the holiday edition by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(240000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalFeriados = new PortalFeriados(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnFeriados();

  await portalFeriados.setDay(10);
  await portalFeriados.selectStore("Todas as lojas");
  await portalFeriados.inputDescription("Teste Edição");
  await portalFeriados.btnAdd();
  await portalFeriados.editHoliday("Teste Edição", "Teste Feriado Editado");
  await portalFeriados.validHoliday("Teste Feriado Editado");
  await portalFeriados.validHolidayDeleted("Teste Feriado Editado");
});


test("Validates generation of the time off scale by the Human Resources Analyst", {tag: '@RecursosHumanos'}, async ({ page }) => {
  test.setTimeout(360000);
  const loginHelpers = new LoginHelpers(page);
  const loginPage = new LoginPage(page);
  const portalHome = new PortalHome(page);
  const portalEscala = new PortalEscala(page);

  await loginHelpers.navegateInline(
    `${URL_BASE}/signin`
  );
  
  await loginPage.setEmail(HRA);
  await loginPage.setPassword(PSW);
  await loginPage.clickBtnLogin();
  await loginPage.clickBtnPortaRh();

  await portalHome.clickBtnFolgas();
  await portalEscala.selectCurrentMonthReport();
  await portalEscala.selectStore(LOJA);
  await portalEscala.validIfNotSent();
  await portalEscala.selectsRandomDaysOff('Folga (F)');
  await portalEscala.btnValid();
  await portalEscala.valid();
});

