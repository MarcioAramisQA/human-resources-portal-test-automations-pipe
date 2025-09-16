import { Page } from '@playwright/test'
import fs from 'fs';
import path from 'path';

export class LoginHelpers {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async navegateInline(endpoint) {
        await this.page.goto(endpoint)
    }

    async saveValues(user: Record<string, any>, test) {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; 
    
        const dir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    
        const filePath = path.join(dir, `${test}.json`); 
    
        fs.writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf-8');
        console.log(`Valores salvo em: ${filePath}`);
  }
  
    async loadValues(test) {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const filePath = path.join(__dirname, 'data', `${test}.json`);
    
        if (!fs.existsSync(filePath)) {
        throw new Error(`O arquivo dos valores ${test} não foi encontrado.`);
        }
    
        const userData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(userData);
    }
}


