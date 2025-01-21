import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    return await taskcompletions.describeList(describeListParams(event), describeListWhere(event, taskcompletions.describeListFilter()));
});