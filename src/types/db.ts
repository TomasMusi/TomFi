import { DATABASE_NAME, DATABASE_IP, DATABASE_PORT, DATABASE_PASSWORD, DATABASE_URL, DATABASE_USER } from '$env/static/private'
import { createPool } from 'mysql2' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely'
import type { DB } from './database.ts'

const dialect = new MysqlDialect({
    //@ts-ignore
    pool: createPool({
        database: DATABASE_NAME,
        host: DATABASE_IP,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        port: parseInt(DATABASE_PORT)
    })
})

export const db = new Kysely<DB>({
    dialect,
})
