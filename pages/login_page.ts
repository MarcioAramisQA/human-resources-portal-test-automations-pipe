import { Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class LoginPage {

  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async validLogin() {
    const LabelDataCompany = await this.page.locator("//h1[contains(.,'Gestor de pagamentos')]")
    await setTimeout(8000, await this.page.locator("//h2[contains(.,'Visualize todos os seus boletos')]"));
    await LabelDataCompany.isVisible
  }

  async setEmail(email) {
    const inputEmail = await this.page.locator("//div[contains(.,'E-mail')]/../div[2]/input");
    await inputEmail.fill(email);
  }

  async setPassword(password) {
    const inputPasswd = await this.page.locator("//div[contains(.,'Senha')]/../div[2]/input");
    await inputPasswd.fill(password);
  }

  async clickBtnLogin() {
    const btnToEnter = await this.page.locator("//button[@type='submit']");
    await btnToEnter.click();
  }

  async clickBtnSignUp() {
    const btnToEnter = await this.page.locator("//button[contains(.,'CRIAR CONTA')]");
    await btnToEnter.click();
  }

  async clickBtnForgotPsw() {
    const btnToEnter = await this.page.locator("//a[@id='forgotPassword']");
    await btnToEnter.click();
  }

  async getMsgErrorGeneral() {
    const msgError = await this.page.innerText("//p[@id='general-error']");
    return msgError;
  }

  async getMsgErrorEmail() {
    const msgError = await this.page.innerText("//input[@id='email']/../div/p");
    return msgError;
  }

  async getMsgErrorPassword() {
    const msgError = await this.page.innerText("//input[@id='password']/../div/p");
    return msgError;
  }

  async clickBtnPortaRh() {
    const btnToEnter = await this.page.locator("//a[@data-testid='menu-item-portal-rh']");
    await btnToEnter.click();
  }

  async clickBtnCMSVendedor() {
    const btnToEnter = await this.page.locator("//a[@data-testid='menu-item-cms-vendedor']");
    await btnToEnter.click();
  }
  
};