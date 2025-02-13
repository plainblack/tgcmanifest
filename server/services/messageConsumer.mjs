import { receiveMessages, deleteMessage } from '#ving/sqs.mjs'
import { useKind } from '#ving/record/utils.mjs'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function getManifestFromS3(url) {
    // Parse S3 URL to get bucket and key
    console.log('Parsing S3 URL:', url)
    const s3Url = new URL(url)

    // Get path parts after removing leading slash
    const pathParts = s3Url.pathname.substring(1).split('/')

    // First part is bucket name
    const bucket = pathParts[0]

    // Rest is the key
    const key = pathParts.slice(1).join('/')

    console.log('Parsed values:', {
        originalUrl: url,
        hostname: s3Url.hostname,
        bucket,
        key
    })

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    })

    const response = await s3Client.send(command)
    const manifestStr = await response.Body.transformToString()
    return JSON.parse(manifestStr)
}

async function processMessage(message) {
    try {
        // Get S3 URL from message body
        console.log('Raw message body:', message.Body)

        let manifestUrl = '';
        if (message.Body.startsWith('http')) {
            manifestUrl = message.Body
        } else {
            const body = JSON.parse(message.Body)
            console.log('Parsed message body:', body)
            manifestUrl = body.url
        }

        console.log('Final manifest URL:', manifestUrl)

        // Fetch manifest JSON from S3
        const manifest = await getManifestFromS3(manifestUrl)

        // Extract order number from manifest
        const orderNumber = parseInt(manifest.order_number)
        if (!orderNumber) {
            throw new Error('Invalid order number in manifest')
        }

        const orders = await useKind('orders');
        orders.create({
            orderNumber,
            manifest
        });

        console.log(`Processed order ${orderNumber}`)

        // Delete message after successful processing
        //await deleteMessage(message.ReceiptHandle)
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