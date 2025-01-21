import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    return orders.mint().propOptions(describeParams(event), true);
});