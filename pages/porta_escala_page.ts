import { expect, Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class PortalEscala {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getDate() {
    const dataAtual = await new Date();
    const year = await dataAtual.getFullYear();
    const month = (await dataAtual).getMonth() + 1;
    const monthNames = [
      "JANEIRO",
      "FEVEREIRO",
      "MARÇO",
      "ABRIL",
      "MAIO",
      "JUNHO",
      "JULHO",
      "AGOSTO",
      "SETEMBRO",
      "OUTUBRO",
      "NOVEMBRO",
      "DEZEMBRO",
    ];
    const monthName = monthNames[month - 1];
    let date = {
      year: year,
      month: month,
      monthName: monthName,
    };
    return date;
  }

  async selectCurrentMonthReport() {
    const dateNow = await this.getDate();
    const input = await this.page.locator("//input[@role='input']");
    const DropdownMonth = await this.page.locator(
      "//button/span[contains(.,'Mês')]/.."
    );
    const btnMonth = await this.page.locator(
      `//label/button[starts-with(@id, '${dateNow.monthName}')]`
    );
    await DropdownMonth.click();
    await input.fill(`${dateNow.monthName}`);
    await setTimeout(3000);
    await btnMonth.waitFor({ state: "visible", timeout: 5000 });
    await btnMonth.click();
    await setTimeout(3000);
  }

  async selectStore(store) {
    const input = await this.page.locator("//input[@placeholder='Procurar']");
    const DropdownStore = await this.page.locator(
      "//button/span[contains(.,'Selecione a loja')]/.."
    );
    const btnStore = await this.page
      .locator(`//label/button[starts-with(@id,'${store}')]`)
      .first();
    await DropdownStore.click();
    await input.fill(store);
    await setTimeout(3000);
    await btnStore.waitFor({ state: "visible", timeout: 5000 });
    await btnStore.click();
  }

  async btnSend() {
    const btn = await this.page.locator("//button[contains(.,'Enviar para validação')]");
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await setTimeout(3000);
  }

  async btnValid() {
    const btn = await this.page.locator("//button[contains(.,'Validar escala')]");
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await setTimeout(3000);
  }

  async btnDraft() {
    const btn = await this.page.locator(
      "//button[contains(.,'Salvar rascunho')]"
    );
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
  }

  async valid() {
    await setTimeout(2000);
    const texts = ["Enviado", "Validado"];
    for (const text of texts) {
      const item = this.page.locator(`//span[contains(.,'${text}')]`);
      if ((await item.count()) > 0) {
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
    const texts = ["Pendente", "Não enviado"];
    for (const text of texts) {
      const item = this.page.locator(`//span[contains(.,'${text}')]`);
      if ((await item.count()) > 0) {
        await item.scrollIntoViewIfNeeded();
        await expect(item).toBeVisible();
        await setTimeout(3000);
        return;
      }
    }
    throw new Error(`⚠️ Este Relatório pode já ter sido enviado`);
  }

  async validReason(reason) {
    const cel = await this.page.locator("//table/tbody//tr/td[2]//button").first();
    const textReason = await this.page.locator("//table/tbody//tr/td[2]//button/div").first();
    const select = await this.page.locator("//button[@role='combobox'][contains(.,'Selecionar')]");
    const dayOff = await this.page.locator(`(//div[@id[starts-with(., 'radix-:r')]][contains(.,'${reason}')])[last()]`);
    const save = await this.page.locator("//div[@role='dialog']//button[contains(.,'Salvar')]");
    const exclude = await this.page.locator("//div[@role='dialog']//button[contains(.,'Excluir')]");
    await cel.click();
    await setTimeout(2000);
    await select.click();
    await setTimeout(2000);
    await dayOff.click();
    await setTimeout(2000);
    await save.click();
    await setTimeout(2000);
    const match = await reason.match(/\((\w{2})\)$/)?.[1];
    const content = await textReason.innerText();
    expect(match).not.toBeNull();
    expect(content).toEqual(match);
    await setTimeout(2000);
    await this.page.screenshot();
    await setTimeout(2000);
    await cel.click();
    await setTimeout(2000);
    await exclude.click();
    await setTimeout(2000);
  }

  async selectsRandomDaysOff(motive) {
    await this.page.waitForSelector("//table");
    const table = this.page.locator("//table");
    const headerCells = table.locator("thead tr th");
    const headerCount = await headerCells.count();
    const columnNames: string[] = [];

    for (let i = 0; i < headerCount; i++) {
      const text = await headerCells.nth(i).innerText();
      columnNames.push(text.trim());
    }

    const sabadoIndicesBase = columnNames
      .map((name, idx) => (name.endsWith("(Sáb)") ? idx : -1))
      .filter((idx) => idx !== -1);

    const domingoIndicesBase = columnNames
      .map((name, idx) => (name.endsWith("(Dom)") ? idx : -1))
      .filter((idx) => idx !== -1);

    if (sabadoIndicesBase.length === 0 || domingoIndicesBase.length === 0) {
      console.warn('Colunas com "(Sáb)" e "(Dom)" não encontradas.');
      return;
    }

    const bodyRows = table.locator("tbody tr");
    const totalLinhas = await bodyRows.count();

    for (let i = 0; i < totalLinhas; i++) {
      const row = bodyRows.nth(i);
      const cells = row.locator("td");

      try {
        const sabadoSelecionaveis = sabadoIndicesBase.filter((idx) => {
          const day = parseInt(columnNames[idx]);
          return i % 2 === 0 ? day % 2 !== 0 : day % 2 === 0; // Par: Sáb ímpar | Ímpar: Sáb par
        });

        const domingoSelecionaveis = domingoIndicesBase.filter((idx) => {
          const day = parseInt(columnNames[idx]);
          return i % 2 === 0 ? day % 2 === 0 : day % 2 !== 0; // Par: Dom par | Ímpar: Dom ímpar
        });

        for (const idx of domingoSelecionaveis) {
          await this.clickDayOffButton(cells, idx, motive);
        }

        for (const idx of sabadoSelecionaveis) {
          await this.clickDayOffButton(cells, idx, motive);
        }
      } catch (e) {
        console.warn(`Erro ao processar linha ${i}:`, e);
      }
    }
  }

  async clickDayOffButton(cells, columnIndex: number, motive: string) {
    try {
      const cell = cells.nth(columnIndex);
      const btn = cell.locator('button[role="button"]');
      const exists = await btn.count();

      if (exists > 0) {
        const select = this.page.locator(
          "//button[@role='combobox'][contains(.,'Selecionar')]"
        );
        const dayOff = this.page.locator(
          `(//div[@id[starts-with(., 'radix-:r')]][contains(.,'${motive}')])[last()]`
        );
        const save = this.page.locator(
          "//div[@role='dialog']//button[contains(.,'Salvar')]"
        );

        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        await select.click();
        await dayOff.click();
        await save.click();
        await setTimeout(2000);
      }
    } catch (e) {
      console.warn(`Erro ao clicar no índice ${columnIndex}:`, e);
    }
  }
}
