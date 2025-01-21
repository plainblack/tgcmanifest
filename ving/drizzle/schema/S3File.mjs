import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, char, varchar, text, int, bigint, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {UserTable} from '#ving/drizzle/schema/User.mjs';


export const S3FileTable = mysqlTable('s3files',
    {
        id: bigint('id', {mode:'number', unsigned: true}).notNull().autoincrement().primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		filename: varchar('filename', { length: 256 }).notNull().default(''),
		extension: varchar('extension', { length: 10 }).notNull().default(''),
		contentType: varchar('contentType', { length: 256 }).notNull().default(''),
		s3folder: varchar('s3folder', { length: 256 }).notNull().default(''),
		sizeInBytes: int('sizeInBytes').notNull().default(0),
		metadata: json('metadata').notNull().default({}),
		status: mysqlEnum('status', ['pending','ready','postProcessingFailed','verifyFailed']).notNull().default('pending'),
		icon: mysqlEnum('icon', ['pending','thumbnail','extension','self']).notNull().default('pending'),
		userId: bigint('userId', {mode:'number', unsigned: true}).notNull()
    }, 
    (table) => ([
        foreignKey({ name: "s3files_user_40cb3d4d_fk", columns: [table.userId], foreignColumns: [UserTable.id]}).onDelete("cascade").onUpdate("cascade")
    ])
);

