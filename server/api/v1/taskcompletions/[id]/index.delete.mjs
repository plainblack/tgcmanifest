import { useKind } from '#ving/record/utils.mjs';
import { obtainSession, describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const taskcompletions = await useKind('TaskCompletion');
    const { id } = getRouterParams(event);
    const taskcompletion = await taskcompletions.findOrDie(id);
    const session = obtainSession(event);
    await taskcompletion.canEdit(session);
    await taskcompletion.delete();
    return taskcompletion.describe(describeParams(event, session));
});