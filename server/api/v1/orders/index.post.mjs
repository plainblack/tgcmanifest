import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const orders = await useKind('Order');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const order = await orders.createAndVerify(await getBody(event), session);
    return order.describe(describeParams(event, session));
});