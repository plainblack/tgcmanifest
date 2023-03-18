import { describe, test, expect } from "vitest";
import { db } from '../server/drizzle/db';
import { like, eq, asc, and } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { AnyMySqlColumn } from 'drizzle-orm/mysql-core';
import { UserTable } from '../server/drizzle/schema/User';
import type { SQL } from 'drizzle-orm/sql';
import type { AnyMySqlSelect } from 'drizzle-orm/mysql-core/query-builders/select.types';

describe('UserTable', async () => {

    await db.delete(UserTable).where(like(UserTable.email, '%@shawshank.prison'));

    test("can insert", async () => {
        const result = await db.insert(UserTable).values({ id: 'a', username: 'warden', email: 'warden@shawshank.prison', realName: 'Warden' });
        expect(result[0].affectedRows).toBe(1);
    });

    test("can select", async () => {
        const result = await db.select().from(UserTable).where(eq(UserTable.id, 'a'));
        expect(result[0].realName).toBe('Warden');
    });

    test("can count", async () => {
        const result = await db.select({ count: sql<number>`count(*)` }).from(UserTable).where(eq(UserTable.id, 'a'));
        expect(result[0].count).toBe(1);
    });

    test("can count with column", async () => {
        const countWithColumn = (column: AnyMySqlColumn) => {
            return sql<number>`count(${column})`
        }
        const result = await db.select({ count: countWithColumn(UserTable.username) }).from(UserTable).where(eq(UserTable.id, 'a'));
        expect(result[0].count).toBe(1);
    });

    test("can pass where clause", async () => {
        const passWhere = async (where: SQL) => await db.select().from(UserTable).where(where);
        const result = await passWhere(eq(UserTable.id, 'a'));
        expect(result[0].realName).toBe('Warden');
    });

    test("can pass where clause as sql", async () => {
        const passWhere = async (where: SQL) => await db.select().from(UserTable).where(where);
        const result = await passWhere(sql`username = 'warden'`);
        expect(result[0].realName).toBe('Warden');
    });

    test("use a where callback to extend a query", async () => {
        const startIt = (whereCallback: (condition: SQL) => SQL | undefined = (c) => c) => {
            return db.select().from(UserTable).where(whereCallback(eq(UserTable.developer, true)));
        }
        const result = await startIt((c) => and(c, eq(UserTable.admin, true)));
        expect(result.length).toBe(0);
    });

    test("use a where callback to extend a query but with nothing to pass in", async () => {
        const startIt = (whereCallback: (condition: SQL) => SQL | undefined = (c) => c) => {
            return db.select().from(UserTable).where(whereCallback(eq(UserTable.developer, true)));
        }
        const result = await startIt();
        expect(result.length).toBe(0);
    });


    // can't figure out the types on this
    /*
    test("can pass order by", async () => {
        const passOrderBy = async (orderBy: (SQL | AnyMySqlColumn)[]) => await db.select().from(UserTable).orderBy(orderBy);
        const result = await passOrderBy([asc(UserTable.username), desc(UserTable.realName)]);
        expect(result[0].realName).toBe('Warden');
    });
    */

    test("can pass order by with 2", async () => {
        const passOrderBy = async (orderBy: SQL | AnyMySqlColumn) => await db.select().from(UserTable).orderBy(orderBy);
        const result = await passOrderBy(asc(UserTable.username));
        expect(result[0].realName).toBe('Warden');
    });


    test("can pass group by", async () => {
        const passGroupBy = async (groupBy: SQL | AnyMySqlColumn) => await db.select().from(UserTable).groupBy(groupBy);
        const result = await passGroupBy(UserTable.username);
        expect(result[0].realName).toBe('Warden');
    });

    test("can pass select query", async () => {
        const passSelect = async <T extends AnyMySqlSelect>(qb: T) => await qb.limit(1);
        const result = await passSelect(db.select().from(UserTable).where(eq(UserTable.id, 'a')));
        expect(result[0].realName).toBe('Warden');
    });

    test("can update", async () => {
        const result1 = await db.update(UserTable).set({ realName: 'Samuel Norton' }).where(eq(UserTable.id, 'a'));
        expect(result1[0].affectedRows).toBe(1);
        const result2 = await db.select().from(UserTable).where(eq(UserTable.id, 'a'));
        expect(result2[0].realName).toBe('Samuel Norton');
    });

    test("can delete", async () => {
        const result = await db.delete(UserTable).where(eq(UserTable.id, 'a'));
        expect(result[0].affectedRows).toBe(1);
    });

});