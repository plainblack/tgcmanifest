import { defineCommand } from "citty";
import { publishUserToast } from '#ving/messagebus.mjs';
import { useCache } from '#ving/cache.mjs';
import { useKind } from '#ving/record/VingRecord.mjs'
import { eq } from '#ving/drizzle/orm.mjs';

export default defineCommand({
    meta: {
        name: "Message Bus",
        description: "Useful for testing the message bus",
    },
    args: {
        user: {
            type: "string",
            description: "Who to send it to",
            valueHint: "username",
            alias: "u",
        },
        message: {
            type: "string",
            description: "Send a message",
            alias: "m",
            default: "1 ping only",
        },
        severity: {
            type: "string",
            description: "Choose `info` or `warning` or `success` or `danger`",
            default: "info",
            alias: "s",
        },
    },
    async run({ args }) {
        if (args.user) {
            const users = await useKind('User');
            const user = await users.findOne(eq(users.table.username, args.user));
            if (user) {
                const severity = args.severity == 'info' || 'danger' || 'success' || 'warning' ? args.type : 'info';
                const pub = await publishUserToast(user.get('id'), args.message, severity);
                await pub.quit();
            }
            else {
                console.log('user not found');
            }
            await users.db.session.client.pool.end();
            await useCache().disconnect();
        }
        else {
            console.log('user is required');
        }
    },
});