import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    return taskcompletions.mint().propOptions(describeParams(event), true);
});