import { defineNitroPlugin } from '#imports';
import { startManifestConsumer } from '../services/manifestConsumer.mjs';
import { log } from '#ving/log.mjs';

export default defineNitroPlugin(() => {
    // Start SQS consumer in background
    startManifestConsumer().catch(error => {
        log('sqs').error('Failed to start manifest consumer:', error)
    });
});