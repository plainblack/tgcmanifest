import { describeParams, obtainSession } from '../../utils/rest';
import { ouch } from '../../../utils/ouch.mjs';
export default defineEventHandler(async (event) => {
    const session = obtainSession(event);
    if (session) {
        const user = await session.user();
        return await user.describe(describeParams(event));
    }
    else {
        return {};
    }
})
