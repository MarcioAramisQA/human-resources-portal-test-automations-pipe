import { Client } from 'pg';

export class PostgresClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: 'rh-portal-app-dev.postgres.database.azure.com',
      port: 5432,
      database: 'portgres',
      user: 'app_admin',
      password: 'Ar@m1s3ng022',
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Conectado ao PostgreSQL com sucesso.');
    } catch (err) {
      console.error('Erro ao conectar ao PostgreSQL:', err);
    }
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.error('Erro ao executar query:', err);
      throw err;
    }
  }

  async disconnect() {
    await this.client.end();
    console.log('Conexão com PostgreSQL encerrada.');
  }

  async dbReset() {
        const query = `UPDATE public."StoreMonthReport"	SET status = 0;`
        await this.connect();
        await this.executeQuery(query);
        await this.disconnect();
  }
}
