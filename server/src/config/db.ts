import pg, { types } from 'pg';
import pc from 'picocolors';
import config from './env';

types.setTypeParser(types.builtins.INT8, val => val);

const db = new pg.Pool({
  connectionString: config.DATABASE_URL,
  connectionTimeoutMillis: 1000 * 60 * 10,
  max: 10
});

db.connect()
  .then(() => console.log(pc.blue('[database]: connected')))
  .catch(e => console.log(pc.red('[database]: connection error'), e.stack));

db.on('remove', () => console.log('[database]: disconnected'));

export async function query(text: string, query?: unknown[]) {
  return await db.query(text, query);
}
