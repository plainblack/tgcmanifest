import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere, obtainSession } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    const { id } = getRouterParams(event);
    const order = await orders.findOrDie(id);
    const taskcompletions = await order.children('taskcompletions');
    const all = await taskcompletions.findMany();
    const session = obtainSession(event);
    for (const record of all) {
        if (record.isOwner(session))
            await record.delete();
    }
    return await taskcompletions.describeList(describeListParams(event, session), describeListWhere(event, taskcompletions.describeListFilter()));
});