import { Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class PortalBeneficio {

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

  async btnBack() {
    const btn = await this.page.locator("//main/div/*[1]").first();
    await btn.click();
  }

  async selectStore(store) {
    const input = await this.page.locator("//input[@placeholder='Procurar']");
    const DropdownStore = await this.page.locator("//button/span[contains(.,'Selecione a loja')]/..");
    const btnStore = await this.page.locator(`//label/button[starts-with(@id,'${store}')]`).first();
    await DropdownStore.click();
    await input.fill(store);
    await setTimeout(3000);
    await btnStore.waitFor({ state: 'visible', timeout: 5000 });
    await btnStore.click();
  }

  async validIfNotSent() {
    function normalizeText(str: string): string {
      return str
        .normalize('NFKC')                    
        .replace(/\s+/g, ' ')                 
        .replace(/[\u200B\u00A0]/g, '')       
        .trim();
    }
    await this.page.waitForSelector('//table//tbody');
    const table = await this.page.locator("//table//tbody");
    const text = await table.locator('xpath=./tr[1]/td[5]').innerText();
    const vlr1 = "R$ 0,00";
    const vlr2 = "0,00";
  
    const cellVT = normalizeText(text);
    const valid1 = normalizeText(vlr1);
    const valid2 = normalizeText(vlr2);
    console.log("Valor encontrado:", cellVT);
  
     if (cellVT === valid1 || cellVT === valid2) {
       console.log("Preencher valores");
     } else if (cellVT.startsWith("R$")) {
       await this.setStartValue();
     } else {
       console.log("Valor sem R$: considerado preenchível");
     }
    }

  async setStartValue() {
    const checkbox = await this.page.locator("//button[@id='Selecionar']");
    const btn = await this.page.locator("//button[contains(.,'EDITAR SELEÇÃO')]");
    const BtnSave = await this.page.locator("//form/button[@type='submit']");
    await checkbox.click();
    await setTimeout(1000);
    const exist = await btn.count();
    if (exist > 0) {
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await BtnSave.click();
    }
    await setTimeout(2000);
  }

  async setEmployeeBenefitValue(VT, VRD, VRF, VBD, VBF, VACD, VACF, VID, VIF) {
    await this.page.waitForSelector('//table//tbody');
    const table = await this.page.locator("//table//tbody");
    const rows = await table.locator('tr');
    const totalLinhas = await rows.count();
    const vlrSunday = await this.sumValues(VT, VRD, VBD, VACD, VID);
    const vlrHoliday = await this.sumValues(VT, VRF, VBF, VACF, VIF);
    const values = {
            vlrSunday: vlrSunday,
            vlrHoliday: vlrHoliday
        };
  
    for (let i = 0; i < totalLinhas; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td, th');
      const totalColunas = await cells.count();
  
      const lastCell = cells.nth(totalColunas - 1);
      const edit = lastCell.locator('//div/div/div[1]');
      const exists = await edit.count();
  
      if (exists > 0) {
        await edit.scrollIntoViewIfNeeded();
        await edit.click();
        const TranspVoucher = await this.page.locator("//form/div[contains(.,'Valor do vale transporte')]//input");
        const SundayMealVoucher = await this.page.locator("//form/div/div[2]/div[1] [contains(.,'Valor do VR (Domingo)')]//input");
        const HolidayMealVoucher = await this.page.locator("//form/div/div[2]/div[2] [contains(.,'Valor do VR (Feriado)')]//input");
        const SundayBonusValue = await this.page.locator("//form/div/div[2]/div[1] [contains(.,'Valor do bônus (Domingo)')]//input");
        const HolidayBonusValues = await this.page.locator("//form/div/div[2]/div[2] [contains(.,'Valor do bônus (Feriado)')]//input");
        const SundayAllowance = await this.page.locator("//form/div/div[2]/div[1] [contains(.,'Valor da ajuda de custo (Domingo)')]//input");
        const HolidayAllowance = await this.page.locator("//form/div/div[2]/div[2] [contains(.,'Valor da ajuda de custo (Feriado)')]//input");
        const CompensationSunday = await this.page.locator("//form/div/div[2]/div[1] [contains(.,'Valor da indenização (Domingo)')]//input");
        const CompensationHoliday = await this.page.locator("//form/div/div[2]/div[2] [contains(.,'Valor da indenização (Feriado)')]//input");
        const BtnSave = await this.page.locator("//form/button[@type='submit']");
        await TranspVoucher.fill(VT);
        await SundayMealVoucher.fill(VRD);
        await HolidayMealVoucher.fill(VRF); 
        await SundayBonusValue.fill(VBD);
        await HolidayBonusValues.fill(VBF); 
        await SundayAllowance.fill(VACD);
        await HolidayAllowance.fill(VACF);
        await CompensationSunday.fill(VID);
        await CompensationHoliday.fill(VIF);
        await BtnSave.click();
      } else {
        throw new Error(`Nenhum item editar encontrado na linha ${i}`);
      }
    }
    return values
  }

  async sumValues(...valores: (string | number)[]): Promise<string> {
    let total = 0;
  
    for (const valor of valores) {
      let numero = 0;
  
      if (typeof valor === 'string') {
        const valorLimpo = valor
          .replace(/R\$\s?/, '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim();
  
        numero = parseFloat(valorLimpo);
      } else {
        numero = valor;
      }
  
      if (!isNaN(numero)) {
        total += numero;
      }
    }
  
    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

}

