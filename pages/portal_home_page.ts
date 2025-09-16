import { Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class PortalHome {

  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async btnBack() {
    const btn = await this.page.locator("//main/div/*[1]").first();
    await btn.click();
  }

  async clickBtnRelatorios() {
    const btnToEnter = await this.page.locator("//button[contains(.,'Gerenciar domingos e feriados')]");
    await btnToEnter.click();
    await setTimeout(3000);
  }

  async clickBtnBeneficios() {
    const btnToEnter = await this.page.locator("//button[contains(.,'Cadastrar benefícios')]");
    await btnToEnter.click();
    await setTimeout(3000);
  }

  async clickBtnFeriados() {
    const btnToEnter = await this.page.locator("//button[contains(.,'Cadastrar feriados')]");
    await btnToEnter.click();
    await setTimeout(3000);
  }

  async clickBtnFolgas() {
    const btnToEnter = await this.page.locator("//button[contains(.,'Gerenciar folgas')]");
    await btnToEnter.click();
    await setTimeout(3000);
  }

  async clickBtnMotivos() {
    const btnToEnter = await this.page.locator("//button[contains(.,'Motivos de ausência')]");
    await btnToEnter.click();
    await setTimeout(3000);
  }

  
}