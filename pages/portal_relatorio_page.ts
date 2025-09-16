import { expect, Page } from "@playwright/test";
import { setTimeout } from "timers/promises";
import { PostgresClient } from "../helpers/pg_client";

export class PortalRelatorio {

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
    const monthName = monthNames[month - 1];
    let date = {
      year: year,   
      month: month,
      monthName: monthName,
    }
    return date;
  }

  async valid() {
    await setTimeout(6000);
    const texts = ['Enviado', 'Validado'];
    for (const text of texts) {
      const item = this.page.locator(`//span[contains(.,'${text}')]`);
      if (await item.count() > 0) {
        await item.scrollIntoViewIfNeeded();
        await expect(item).toBeVisible();
        await setTimeout(1000);
        return;
      }
    }
    throw new Error(`⚠️ Não encontrado mensagem para validar envio`);
  }


  async validIfNotSent() {
    await setTimeout(1000);
    const texts = ['Pendente', 'Não enviado'];
    for (const text of texts) {
      const item = this.page.locator(`//span[contains(.,'${text}')]`);
      if (await item.count() > 0) {
        await item.scrollIntoViewIfNeeded();
        await expect(item).toBeVisible();
        await setTimeout(3000);
        return;
      }
    }
    throw new Error(`⚠️ Este Relatório pode já ter sido enviado`);
  }


  async btnValidar() {
    const btn = await this.page.locator("//button[contains(.,'VALIDAR')]");
    await btn.click();
    await setTimeout(3000);
  }

  async btnSaveDraft() {
    const btn = await this.page.locator("//button[contains(.,'SALVAR RASCUNHO')]");
    await btn.click();
  }

  async btnSend() {
    const btn = await this.page.locator("//button[contains(.,'ENVIAR')]");
    await btn.click();
  }

  async btnConfirm() {
    const btn = await this.page.locator("//button[contains(.,'SIM')]");
    await btn.click();
    await setTimeout(3000);
  }

  async selectCurrentMonthReport() {
    const dateNow = await this.getDate();
    const input = await this.page.locator("//input[@role='input']");
    const DropdownMonth = await this.page.locator("//button/span[contains(.,'Mês')]/..");
    const btnMonth = await this.page.locator(`//label/button[starts-with(@id, '${dateNow.monthName}')]`);
    await DropdownMonth.click();
    await input.fill(`${dateNow.monthName}`);
    await setTimeout(3000);
    await btnMonth.waitFor({ state: 'visible', timeout: 5000 });
    await btnMonth.click();
    await setTimeout(3000);
  }

  async selectStore(store) {
    const input = await this.page.locator("//input[@role='input']");
    const DropdownStore = await this.page.locator("//button/span[contains(.,'Loja')]/..");
    const btnStore = await this.page.locator(`//label/button[starts-with(@id,'${store}')]`).first();
    await DropdownStore.click();
    await input.fill(store);
    await setTimeout(3000);
    await btnStore.waitFor({ state: 'visible', timeout: 5000 });
    await btnStore.click();
    await setTimeout(3000);
  }

  async deleteItensTable() {
    await this.page.waitForSelector('//table//tbody');
    const table = await this.page.locator("//table//tbody");
    const btn = await this.page.locator("//button[contains(.,'SALVAR RASCUNHO')]");
    const rows = await table.locator('tr');
    const totalLinhas = await rows.count();
    const condition = await this.page.locator("//table//tbody//button[@aria-checked='true']").first();
    const exists = await condition.count();
  
    if (exists > 0) {
      for (let i = 0; i < totalLinhas; i++) {
      const row = await rows.nth(i);
      const cells = await row.locator('td, th');
      const totalColunas = await cells.count();
  
      for (let j = 1; j < totalColunas - 2; j++) {
        const cell = await cells.nth(j);
  
        const linhaEhPar = i % 2 === 0;
        const colunaEhPar = j % 2 === 0;
  
        const deveClicar = (!linhaEhPar && !colunaEhPar) || (linhaEhPar && colunaEhPar);
  
        if (deveClicar) {
          const checkbox = await cell.locator('button[role="checkbox"]');
          const exists = await checkbox.count();
          if (exists > 0) {
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.click();
          } else {
            throw new Error(`⚠️ Nenhum checkbox encontrado na célula linha ${i}, coluna ${j}`);
          }
        }
      }
    }
    await btn.click();
    await setTimeout(3000);
    }
  }
  
  async selectSundaysWorkedTable() {
    await this.page.waitForSelector('//table//tbody');
    const table = await this.page.locator("//table//tbody");
    const rows = await table.locator('tr');
    const totalLinhas = await rows.count();
  
    for (let i = 0; i < totalLinhas; i++) {
      const row = await rows.nth(i);
      const cells = await row.locator('td, th');
      const totalColunas = await cells.count();
  
      for (let j = 1; j < totalColunas - 2; j++) {
        const cell = await cells.nth(j);
  
        const linhaEhPar = i % 2 === 0;
        const colunaEhPar = j % 2 === 0;
  
        const deveClicar = (!linhaEhPar && !colunaEhPar) || (linhaEhPar && colunaEhPar);
  
        if (deveClicar) {
          const checkbox = await cell.locator('button[role="checkbox"]');
          const exists = await checkbox.count();
  
          if (exists > 0) {
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.click();
          } else {
            throw new Error(`Nenhum checkbox encontrado na célula linha ${i}, coluna ${j}`);
          }
        }
      }
    }
  }
  
  async selectRandomSundaysWorkedTable(vlrSunday, vlrHoliday): Promise<string> {
    await this.page.waitForSelector('//table');
    const table = this.page.locator('//table');
  
    const headerCells = table.locator('thead tr th');
    const headerCount = await headerCells.count();
    const columnNames: string[] = [];
  
    for (let i = 0; i < headerCount; i++) {
      const text = await headerCells.nth(i).innerText();
      columnNames.push(text.trim());
    }
  
    const bodyRows = table.locator('tbody tr');
    const totalLinhas = await bodyRows.count();
  
    let totalGeral = 0;
  
    for (let i = 0; i < totalLinhas; i++) {
      const row = bodyRows.nth(i);
      const cells = row.locator('td');
      const totalColunas = await cells.count();
  
      const limiteColunaClique = totalColunas - 2;
      const listadalinha: (string | number)[] = [];
  
      for (let j = 1; j < limiteColunaClique; j++) {
        const cell = cells.nth(j);
        const colunaNome = columnNames[j];
  
        const linhaEhPar = i % 2 === 0;
        const colunaEhPar = j % 2 === 0;
        const deveClicar = (!linhaEhPar && !colunaEhPar) || (linhaEhPar && colunaEhPar);
  
        if (deveClicar) {
          const checkbox = cell.locator('button[role="checkbox"]');
          const exists = await checkbox.count();
  
          if (exists > 0) {
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.click();
            console.log(`✅ Clicado na célula linha ${i}, coluna '${colunaNome}'`);
  
            if (colunaNome.trim().endsWith('(DOM)')) {
              listadalinha.push(vlrSunday);
            } else if (colunaNome.trim().endsWith('(Feriado)')) {
              listadalinha.push(vlrHoliday);
            } else {
              throw new Error(`⚠️ Tipo de coluna inválido: '${colunaNome}' na linha ${i}`);
            }
          } else {
            throw new Error(`⚠️ Nenhum checkbox encontrado na célula linha ${i}, coluna '${colunaNome}'`);
          }
        }
      }
  
      const ultimaColunaIndex = totalColunas - 1;
      const ultimaCelula = cells.nth(ultimaColunaIndex);
      const valorUltimaCelula = await ultimaCelula.innerText();
      const valorFormatado = valorUltimaCelula
        .replace(/R\$\s?/, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();
  
      const valorFinalNaTabela = parseFloat(valorFormatado);
      const valorSomadoStr = await this.sumValues(...listadalinha);
      const valorSomadoNum = parseFloat(valorSomadoStr.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.'));
  
      const colunaFinalNome = columnNames[ultimaColunaIndex] ?? `Coluna ${ultimaColunaIndex}`;
      console.log(`📦 Valor da última coluna (linha ${i}, coluna '${colunaFinalNome}'): ${valorFinalNaTabela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
      console.log(`📊 Valor calculado da linha ${i}: ${valorSomadoStr}`);
  
      const diferenca = Math.abs(valorFinalNaTabela - valorSomadoNum);
      if (diferenca > 0.01) {
        throw new Error(`❌ Soma incorreta na linha ${i}. Esperado: ${valorSomadoStr}, mas encontrado: ${valorUltimaCelula.trim()}`);
      }
  
      totalGeral += valorFinalNaTabela;
    }
  
    return totalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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

  async getValueReport() {
    function normalizeText(str: string): string {
      return str
        .normalize('NFKC')                    
        .replace(/\s+/g, ' ')                 
        .replace(/[\u200B\u00A0]/g, '')       
        .trim();
    }
  
    const totalVT = await this.page.locator("//span[contains(.,'Total VT:')]/../span[2]");
    const totalVRD = await this.page.locator("//span[contains(.,'Total VR Domingo:')]/../span[2]");
    const totalVRF = await this.page.locator("//span[contains(.,'Total VR Feriado:')]/../span[2]");
    const totalVBD = await this.page.locator("//span[contains(.,'Total Bônus Domingo:')]/../span[2]");
    const totalVBF = await this.page.locator("//span[contains(.,'Total Bônus Feriado:')]/../span[2]");
    const totalVAD = await this.page.locator("//span[contains(.,'Total Ajuda de Custo Domingo:')]/../span[2]");
    const totalVAF = await this.page.locator("//span[contains(.,'Total Ajuda de Custo Feriado:')]/../span[2]");
    const totalVID = await this.page.locator("//span[contains(.,'Total Indenização Domingo:')]/../span[2]");
    const totalVIF = await this.page.locator("//span[contains(.,'Total Indenização Feriado:')]/../span[2]");
    await totalVT.scrollIntoViewIfNeeded();
    const VT = await totalVT.innerText();
    const VRD = await totalVRD.innerText();
    const VRF = await totalVRF.innerText();
    const VBD = await totalVBD.innerText();
    const VBF = await totalVBF.innerText();
    const VAD = await totalVAD.innerText();
    const VAF = await totalVAF.innerText();
    const VID = await totalVID.innerText();
    const VIF = await totalVIF.innerText();
    const NVT = normalizeText(VT);
    const NVRD = normalizeText(VRD);
    const NVRF = normalizeText(VRF);
    const NVBD = normalizeText(VBD);
    const NVBF = normalizeText(VBF);
    const NVAD = normalizeText(VAD);
    const NVAF = normalizeText(VAF);
    const NVID = normalizeText(VID);
    const NVIF = normalizeText(VIF);
    const value = this.sumValues(NVT, NVRD, NVRF, NVBD, NVBF, NVAD, NVAF, NVID, NVIF);

    return value
  }

}

