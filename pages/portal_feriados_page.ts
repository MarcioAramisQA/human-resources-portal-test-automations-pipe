import { expect, Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class PortalFeriados {

  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async getDate() {
    const dataAtual = await new Date();
    const year = await dataAtual.getFullYear();
    const month = (await dataAtual).getMonth() + 1;
    const monthNames = [
      'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
    ];
    const monthName = monthNames[month];
    let date = {
      year: year,   
      month: month,
      monthName: monthName,
    }
    return date;
  }

  async setDay(dayoff) {
    await this.page.waitForSelector("//button[@id='date'][contains(.,'Data do feriado')]");
    const btnCalender = await this.page.locator("//button[@id='date'][contains(.,'Data do feriado')]");
    const finishCalender = await this.page.locator("//h1[contains(.,'Portal RH')]");
    const btnNext = await this.page.locator("//button[@name='next-month']");
    await btnCalender.waitFor({ state: 'visible', timeout: 3000 });
    const exists = await btnCalender.count();
    if (exists > 0) {
      console.log(`Elemento ${btnCalender} localizado`);
      await btnCalender.click();
      await btnNext.click();
      const day = await this.page.locator(`(//button[@name='day' and contains(., '${dayoff}')])`).first();
      await day.click();
    } else {
      console.warn(`Feriado com Dercrição ${btnCalender} não localizada`);
    }
  }
  
  async selectStore(store) {
    const input = await this.page.locator("//input[@placeholder='Procurar']");
    const DropdownStore = await this.page.locator("//button/span[contains(.,'Selecione a loja')]/..");
    const btnStore = await this.page.locator(`//div[contains(.,'${store}')]/button[@role='checkbox']`);
    const btnSet = await this.page.locator("//div[@role='dialog']/div[contains(.,'Selecionar loja')]");
    await setTimeout(3000);
    await DropdownStore.click();
    await input.fill(store);
    await setTimeout(3000);
    await btnStore.waitFor({ state: 'visible', timeout: 5000 });
    await btnStore.click();
    await btnSet.click();
  }

  async inputDescription(description) {
    const input = await this.page.locator("//input[@placeholder='Digite uma descrição...']");
    await input.fill(description);
  }

  async btnAdd() {
    const btn = await this.page.locator("//button[contains(.,'Adicionar')]");
    await btn.click();
    await setTimeout(3000);
  }

  async validHoliday(description) {
    const holiday = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${description}')]`);
    const btnDelete = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${description}')]/div[2]/*[2]`);
    const delConfirm = await this.page.locator("//button[@role='button' and contains(., 'SIM')]");
    const exists = await holiday.count();
    if (exists > 0) {
      console.log(`Elemento ${holiday} localizado`);
      await holiday.scrollIntoViewIfNeeded();
      await btnDelete.click();
      await delConfirm.click();
      await setTimeout(3000);
    } else {
      throw new Error(`Feriado com nome ${description} não localizado`);
    }
  }

  async validHolidayDeleted(description) {
    const holiday = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${description}')]`);
    const exists = await holiday.count();
    if (exists > 0) {
      throw new Error(`Feriado com nome ${description} não foi Excluido`);
    } else {
      console.log(`Feriado ${description} excluido com sucesso`);
      await setTimeout(3000);
    }
  }

  async editHoliday(previous, description) {
    const holiday = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${previous}')]`);
    const btnEdit = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${previous}')]/div[2]/*[1]`);
    const input = await this.page.locator("//input[@placeholder='Digite uma descrição...']");
    const exists = await holiday.count();
    if (exists > 0) {
      console.log(`Elemento ${previous} localizado`);
      const btnUpdate = await this.page.locator("//button[contains(.,'Atualizar')]");
      await holiday.scrollIntoViewIfNeeded();
      await btnEdit.click();
      await input.clear();
      await input.fill(description);
      await btnUpdate.click();
      await setTimeout(3000);
    } else {
      throw new Error(`Feriado com nome ${description} não localizado`);
    }
  }

  async validStoreHoliday(description, store) {
    const label = await this.page.locator(`//main/div[2]/div[2]/div/div[contains(.,'${description}')]/div/span[2]`);
    const exists = await label.count();
    if (exists > 0) {
      console.log(`Elemento ${description} localizado`);
      await label.scrollIntoViewIfNeeded();
      const text = await label.innerText();
      expect(text).toEqual(store);
      await setTimeout(3000);
    } else {
      throw new Error(`Não localizado feriado ${description} especificado para loja ${store}`);
    }
  }
}