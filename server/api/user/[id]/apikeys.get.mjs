import { useKind } from '#ving/record/VingRecord.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import { defineEventHandler, getRouterParams } from 'h3';

export default defineEventHandler(async (event) => {
    const users = await useKind('User');
    const { id } = getRouterParams(event);
    const user = await users.findOrDie(id);
    const APIKeys = user.apikeys;
    return await APIKeys.describeList(describeListParams(event), describeListWhere(event, APIKeys.describeListFilter()));
});