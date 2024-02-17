import { useKind } from '#ving/record/VingRecord.mjs';
import { obtainSession, describeParams } from '#ving/utils/rest.mjs';
import { defineEventHandler, getRouterParams } from 'h3';

export default defineEventHandler(async (event) => {
    const users = await useKind('User');
    const { id } = getRouterParams(event);
    const user = await users.findOrDie(id);
    const session = obtainSession(event);
    user.canEdit(session);
    await user.delete();
    return user.describe(describeParams(event, session));
});