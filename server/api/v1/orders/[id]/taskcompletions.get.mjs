import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    const { id } = getRouterParams(event);
    const order = await orders.findOrDie(id);
    const taskcompletions = await order.children('taskcompletions');
    return await taskcompletions.describeList(describeListParams(event), describeListWhere(event, taskcompletions.describeListFilter()));
});