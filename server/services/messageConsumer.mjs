import { receiveMessages, deleteMessage } from '#ving/sqs.mjs'

async function processMessage(message) {
    try {
        // Parse message body
        const body = JSON.parse(message.Body)

        // TODO: Fetch manifest and store in database
        console.log('Processing message:', body)

        // Delete message after successful processing
        await deleteMessage(message.ReceiptHandle)
    } catch (error) {
        console.error('Error processing message:', error)
        // Don't delete message - it will return to queue after visibility timeout
    }
}

export async function startMessageConsumer() {
    console.log('Starting SQS message consumer...')

    while (true) {
        try {
            const messages = await receiveMessages()

            for (const message of messages) {
                await processMessage(message)
            }
        } catch (error) {
            console.error('Error in message consumer:', error)
            // Wait before retrying on error
            await new Promise(resolve => setTimeout(resolve, 5000))
        }
    }
} 