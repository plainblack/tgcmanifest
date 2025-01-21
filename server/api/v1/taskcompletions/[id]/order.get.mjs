import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    const { id } = getRouterParams(event);
    const taskcompletion = await taskcompletions.findOrDie(id);
    const order = await taskcompletion.parent('order');
    return await order.describe(describeParams(event));
});