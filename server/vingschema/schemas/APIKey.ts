import { vingSchema } from '../../../types/vingschema';
import { baseSchemaProps, dbString, zodString, dbText, zodText, dbRelation } from '../helpers';
import crypto from 'crypto';

export const apikeySchema: vingSchema = {
    kind: 'APIKey',
    tableName: 'apikeys',
    owner: ['$userId', 'admin'],
    props: [
        ...baseSchemaProps,
        {
            type: "string",
            name: 'name',
            required: true,
            length: 60,
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            default: '',
            view: ['public'],
            edit: ['owner'],
        },
        {
            type: "string",
            name: 'url',
            length: 65535,
            required: true,
            db: (prop) => dbText(prop),
            zod: (prop) => zodText(prop).url(),
            default: '',
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: 'reason',
            required: false,
            length: 65535,
            default: '',
            db: (prop) => dbText(prop),
            zod: (prop) => zodText(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: 'privateKey',
            required: false,
            length: 39,
            default: () => 'pk_' + crypto.randomBytes(18).toString('hex'),
            db: (prop) => dbString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "id",
            name: 'userId',
            required: true,
            length: 36,
            db: (prop) => dbRelation(prop),
            relation: {
                type: 'parent',
                name: 'user',
                kind: 'User',
            },
            default: undefined,
            view: ['public'],
            edit: ['owner'],
        },
    ],
};