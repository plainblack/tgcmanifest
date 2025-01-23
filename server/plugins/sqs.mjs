import { startMessageConsumer } from '/server/services/messageConsumer.mjs'

export default defineNitroPlugin(() => {
    // Start SQS consumer in background
    startMessageConsumer().catch(error => {
        console.error('Failed to start message consumer:', error)
    })
}) 