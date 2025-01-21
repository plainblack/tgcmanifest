import { baseSchemaId, baseSchemaCreatedAt, baseSchemaUpdatedAt, dbVarChar, zodString, dbEnum, dbBoolean, dbText, dbRelation, dbDateTime, dbTimestamp, dbBigInt, dbInt, dbUuid, dbJson, zodNumber, zodJsonObject, dbMediumText } from '../helpers.mjs';

export const orderSchema = {
    kind: 'Order',
    tableName: 'orders',
    owner: ['admin'],
    props: [
        { ...baseSchemaId },
        { ...baseSchemaCreatedAt },
        { ...baseSchemaUpdatedAt },
        {
            type: "int",
            name: "orderNumber",
            required: true,
            default: 0,
            filterRange: true,
            db: (prop) => dbInt(prop),
            zod: (prop) => zodNumber(prop).nonnegative(),
            view: ['public'],
            edit: [],
        },
        {
            type: "json",
            name: "manifest",
            required: true,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: ['public'],
            edit: [],
        },
    ],
};