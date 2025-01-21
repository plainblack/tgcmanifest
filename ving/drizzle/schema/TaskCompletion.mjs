import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, char, varchar, text, int, bigint, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import { OrderTable } from '#ving/drizzle/schema/Order.mjs';
import { UserTable } from '#ving/drizzle/schema/User.mjs';


export const TaskCompletionTable = mysqlTable('taskcompletions',
    {
        id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
        updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
        manifestTaskId: char('manifestTaskId', { length: 36 }).notNull(),
        orderId: bigint('orderId', { mode: 'number', unsigned: true }).notNull(),
        completedById: bigint('completedById', { mode: 'number', unsigned: true }).notNull()
    },
    (table) => ({
        taskcompletions_order_3c1145bf_fk: foreignKey({ name: "taskcompletions_order_3c1145bf_fk", columns: [table.orderId], foreignColumns: [OrderTable.id] }).onDelete("cascade").onUpdate("cascade"),
        taskcompletions_user_5481f188_fk: foreignKey({ name: "taskcompletions_user_5481f188_fk", columns: [table.completedById], foreignColumns: [UserTable.id] }).onDelete("cascade").onUpdate("cascade")
    })
);

