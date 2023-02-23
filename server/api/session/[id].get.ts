import { testSession } from '~/utils/session';
import { ouch } from '~/utils/utils';
export default defineEventHandler(async (event) => {
    const session = event.context.ving.session;
    testSession(session);
    const { id } = getRouterParams(event);
    console.log(session.id + ' == ' + id)
    if (session.id == id || session.get('admin')) {
        return session.describe({ currentUser: session, include: event.context.ving.include });
    }
    throw ouch(403, 'Session ID in cookie must match the one in the endpoint.')
});