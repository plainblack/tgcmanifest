import { useKind } from '#ving/record/utils.mjs';
import { obtainSession, describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    const { id } = getRouterParams(event);
    const order = await orders.findOrDie(id);
    const session = obtainSession(event);
    await order.canEdit(session);
    await order.delete();
    return order.describe(describeParams(event, session));
});