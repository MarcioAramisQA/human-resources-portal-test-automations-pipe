import { Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class PortalMotivos {

  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async inputNameReasons(name) {
    const input = await this.page.locator("//div[contains(.,'Nome do motivo')]/../div[2]//input[@placeholder='Insira um nome...']");
    await input.fill(name);
    await setTimeout(3000);
  }

  async inputCode(code) {
    const input = await this.page.locator("//div[contains(.,'Código do motivo (2 caracteres)')]/../div[2]//input[@placeholder='Ex.: FF; FE...']");
    await input.fill(code);
    await setTimeout(3000);
  }

  async inputCodeExt(code) {
    const input = await this.page.locator("//div[contains(.,'Código externo')]/../div[2]//input[@placeholder='Ex.: 134; 658...']");
    await input.fill(code);
    await setTimeout(3000);
  }
  
  async btnComboBoxActivate(option) {
    const btn = await this.page.locator("//span[contains(.,'Deixar ativo motivo de ausência?')]/../button[@role='combobox']");
    const select = await this.page.locator(`//div[@role='group']/div[contains(.,'${option}')]`);
    await btn.click();
    await setTimeout(2000);
    await select.click();
    await setTimeout(2000);
  }

  async btnAdd() {
    const btn = await this.page.locator("//button[contains(.,'Adicionar')]");
    await btn.click();
    await setTimeout(2000);
  }

  async validReason(reason) {
    const element = await this.page.locator(`//span[contains(.,'Motivos de ausência cadastrados')]/../div/div[contains(.,'${reason}')]`);
    await element.scrollIntoViewIfNeeded();
    await this.page.screenshot();
    await setTimeout(3000);
  }

  async deleteReason(reason) {
    const btn = await this.page.locator(`//span[contains(.,'Motivos de ausência cadastrados')]/../div/div[contains(.,'${reason}')]/div[2]/*[2]`);
    const confirm = await this.page.locator("//div[@role='dialog']/div[2]/button[contains(.,'SIM')]");
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await setTimeout(2000);
    await confirm.click();
    await setTimeout(2000);
  }
  
}
