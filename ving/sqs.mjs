import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'
import { log } from '#ving/log.mjs';

export const config = {
    queueUrl: process.env.AWS_SQS_QUEUE_URL,
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

// Initialize SQS client
export const sqsClient = new SQSClient({
    region: config.region,
    credentials: config.credentials
})

// Function to receive messages
export async function receiveMessages() {
    const command = new ReceiveMessageCommand({
        QueueUrl: config.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20 // Long polling
    })

    try {
        const response = await sqsClient.send(command)
        log('sqs').debug('Received messages: ' + JSON.stringify(response.Messages))
        return response.Messages || []
    } catch (error) {
        log('sqs').error('Error receiving messages:', error)
        return []
    }
}

// Function to delete a processed message
export async function deleteMessage(receiptHandle) {
    const command = new DeleteMessageCommand({
        QueueUrl: config.queueUrl,
        ReceiptHandle: receiptHandle
    })

    try {
        await sqsClient.send(command)
    } catch (error) {
        log('sqs').error('Error deleting message:', error)
    }
} 