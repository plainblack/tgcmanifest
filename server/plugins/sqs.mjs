import { defineNitroPlugin } from '#imports';
import { startMessageConsumer } from '../services/messageConsumer.mjs'

export default defineNitroPlugin(() => {
    // Start SQS consumer in background
    startMessageConsumer().catch(error => {
        console.error('Failed to start message consumer:', error)
    })
}) 