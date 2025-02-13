import { defineNitroPlugin } from '#imports';
import { startMessageConsumer } from '../services/messageConsumer.mjs';
import { log } from '#ving/log.mjs';

export default defineNitroPlugin(() => {
    // Start SQS consumer in background
    startMessageConsumer().catch(error => {
        log('sqs').error('Failed to start message consumer:', error)
    });
});