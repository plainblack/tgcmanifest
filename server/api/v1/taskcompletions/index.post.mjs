import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const taskcompletion = await taskcompletions.createAndVerify(await getBody(event), session);
    return taskcompletion.describe(describeParams(event, session));
});