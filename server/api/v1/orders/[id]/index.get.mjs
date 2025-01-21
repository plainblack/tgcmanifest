import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    const { id } = getRouterParams(event);
    const order = await orders.findOrDie(id);
    return order.describe(describeParams(event));
});