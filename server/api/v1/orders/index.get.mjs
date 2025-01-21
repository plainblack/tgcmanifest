import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    return await orders.describeList(describeListParams(event), describeListWhere(event, orders.describeListFilter()));
});