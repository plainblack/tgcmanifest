import { useKind } from '#ving/record/utils.mjs';
import { describeParams, obtainSession, getBody } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    const { id } = getRouterParams(event);
    const taskcompletion = await taskcompletions.findOrDie(id);
    const session = obtainSession(event);
    await taskcompletion.canEdit(session);
    await taskcompletion.updateAndVerify(await getBody(event), session);
    return taskcompletion.describe(describeParams(event, session));
});