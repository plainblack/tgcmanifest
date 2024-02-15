import { VingRecord, VingKind } from "../VingRecord.mjs";
import { useDB } from '../../drizzle/db.mjs';
import { S3FileTable } from '../../drizzle/schema/S3File.mjs';
import { useUsers } from './User.mjs';
import { ouch } from '../../utils/ouch.mjs';
import { v4 } from 'uuid';
import sanitize from 'sanitize-filename';
import * as dotenv from 'dotenv';
dotenv.config();

/** A list of supported file extensions and the thumbnail they will be represented by. */
export const extensionMap = {
    mp3: 'audio',
    wav: 'audio',
    js: 'code',
    ts: 'code',
    pl: 'code',
    mjs: 'code',
    cjs: 'code',
    yaml: 'config',
    json: 'config',
    ini: 'config',
    config: 'config',
    css: 'config',
    rtf: 'document',
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    pages: 'document',
    odt: 'document',
    ttf: 'font',
    otf: 'font',
    tif: 'image',
    jpg: 'image',
    jpeg: 'image',
    tiff: 'image',
    gif: 'image',
    png: 'image',
    psd: 'image',
    bmp: 'image',
    xml: 'markup',
    html: 'markup',
    php: 'markup',
    njk: 'markup',
    ppt: 'presentation',
    odp: 'presentation',
    keynote: 'presentation',
    xls: 'spreadsheet',
    csv: 'spreadsheet',
    xlsx: 'spreadsheet',
    ods: 'spreadsheet',
    md: 'text',
    txt: 'text',
    svg: 'vector',
    ai: 'vector',
    ps: 'vector',
    mp4: 'video',
    mov: 'video',
    avi: 'video',
    gif: 'video',
    zip: 'archive',
    rar: 'archive',
    gz: 'archive',
    tar: 'archive',
    exe: 'disc',
    dmg: 'disc',
    msi: 'disc',
};

/**
     * Gets a file extension.
     * 
     * Usage: `const extension = getExtension('myimage.jpg')`
     * 
     * @param filename A filename.
     * @returns A file extension
     */
export const getExtension = (filename) => {
    const match = filename.toLowerCase().match(/^.*\.(\w*)$/);
    return match[1];
}

/**
     * Removes special characters from a filename. Special characters 
     * include /, ?, <, >, \, :, *, |, and " among others. Also checks
     * the filename against `extensionMap`.
     * 
     * Usage: `const filename = sanitizeFilename('myimage.jpg')`
     * 
     * @throws 415 if the file doesn't have an extension or has a disallowed extension
     * @param filename A filename.
     * @returns A file extension
     */
export const sanitizeFilename = (nameIn) => {
    const nameOut = sanitize(nameIn);
    const ext = getExtension(nameOut);
    const allowedExtensions = Object.keys(extensionMap);
    if (!ext)
        throw ouch(415, 'The file does not appear to have a file extension.');
    else if (!(allowedExtensions.includes(ext)))
        throw ouch(415, `The extension ${ext} is not one of the allowed file extensions.`, allowedExtensions);
    return nameOut;
};

/**
     * Formats a UUID as series of folders to be used as an S3 key.
     * 
     * Usage: `const folder = formatS3FolderName('0467810a-5d75-4a91-a868-4f87281fbab9')`
     * 
     * @param input A v4 UUID.
     * @returns A string with slashes splitting the first few characters and all dashes replaced with slashes.
     */
export const formatS3FolderName = (input) => {
    return input.replace(/-/g, '/').replace(/^(.{4})(.+)$/, '$1/$2');
}

/**
     * Generates a UUID and then formats it using `formatS3FolderName`.
     * 
     * Usage: `const folder = makeS3FolderName()`
     * 
     * @returns A string with slashes splitting the first few characters and all dashes replaced with slashes.
     */
export const makeS3FolderName = () => {
    return formatS3FolderName(v4());
}

/** A subclass of VingRecord that holds information about files in S3 for use by other Ving Records.
 * @class
 */
export class S3FileRecord extends VingRecord {

    /**
         * Generates the URL to the s3 storage location where this file exists.
         * 
         * Usage: `const url = s3file.fileUrl()`
         * 
         * @returns A URL to an S3 key.
         */

    fileUrl() {
        return `https://${process.env.AWS_UPLOADS_BUCKET}.s3.amazonaws.com/${this.get('s3folder')}/${this.get('filename')}`;
    }

    /**
         * Generates the URL to the thumbnail for a file or an icon that represents the file.
         * 
         * Usage: `const url = s3file.thumbnailUrl()`
         * 
         * @returns A URL to an image or icon representing this file.
         */
    thumbnailUrl() {
        switch (this.get('icon')) {
            case 'self':
                return this.fileUrl();
            case 'thumbnail':
                return `https://${process.env.AWS_THUMBNAILS_BUCKET}.s3.amazonaws.com/${formatS3FolderName(this.get('id'))}.png`;
            case 'extension': {
                const image = extensionMap[this.extension()] || 'unknown';
                return `/img/filetype/${image}.png`;
            }
            default:
                return '/img/pending.webp';
        }
    }

    /**
         * Gets the extension for this this S3File.
         * 
         * Usage: `const extension = s3file.extension()`
         * 
         * @returns A string containing the file extension.
         */
    extension() {
        return getExtension(this.get('filename'));
    }

    /**
     * Generates a description of this S3File beyond the normal VingRecord
     * description. This includes the `meta` fields `fileUrl`, `thumbnailUrl`,
     * and `extension`.
     * 
     * Usage: `const description = await s3file.describe()`
     * 
     * @see VingRecord.describe()
     * @param params See VingRecord describe for details.
     * @returns An object with the description. See VingRecord for details.
     */
    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.meta && out.meta) {
            if (this.isOwner(params?.currentUser)) {
                out.meta.fileUrl = this.fileUrl();
            }
            out.meta.thumbnailUrl = this.thumbnailUrl();
            out.meta.extension = this.extension();
        }
        return out;
    }

    /**
         * Makes a call out to an AWS Lambda function to do post processing 
         * of the file after upload. It includes collecting metadata, verifying
         * file size, and generating thumbnails as necessary.
         * 
         * Usage: `await s3file.postProcessFile()`
         * @throws 500 or other codes depending upon what the Lambda function returns.
         */
    async postProcessFile() {
        const self = this;
        let response = null;
        let metadata = {};
        try {
            response = await fetch(process.env.LAMBDA_PROCESS_UPLOADS_URL, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: self.fileUrl(),
                    thumbnailKey: formatS3FolderName(self.get('id')) + '.png',
                    fileType: self.extension(),
                }),
            });
            metadata = await response.json();
            if (metadata.error) {
                throw ouch(metadata.error.code, metadata.error.message);
            }
        }
        catch (e) {
            self.set('status', 'postProcessingFailed');
            await self.update();
            // future: kick off deletion process
            console.error(`Could not post process ${self.get('id')} because ${response.statusText}`, { response, error: e });
            //console.debug(response);
            throw ouch(504, `Could not post process ${self.get('filename')}.`);
        }
        if (metadata.thumbnail) {
            self.set('icon', 'thumbnail');
            delete metadata.thumbnail;
        }
        if (metadata.sizeInBytes) {
            self.set('sizeInBytes', metadata.sizeInBytes);
            delete metadata.sizeInBytes;
        }
        self.set('metadata', metadata);
        self.set('status', 'ready');
        await self.update();
        return metadata;
    }

    /**
         * Checks the dimensions of the image from the metadata and returns 
         * true if they do or calls `markUnverified()` if they don't.
         * 
         * Usage: `await s3file.verifyExactDimensions(width, height)`
         * 
         * @param width The width in pixels this image should be.
         * @param height The height in pxiels this image should be.
         * @throws 442 if the dimensions do not match
         * @returns `true` if successful.
         */
    async verifyExactDimensions(width, height) {
        const metadata = this.get('metadata');
        if (width != metadata.width || height != metadata.height)
            await this.markUnverified(`${this.get('filename')} should be ${width}x${height}, but was ${metadata.width}x${metadata.height}.`);
        return true;
    }

    /**
         * Checks the extension of the file against a whitelist and returns 
         * true if they do or calls `markUnverified()` if they don't.
         * 
         * Usage: `await s3file.verifyExtension(['png','gif','jpeg','jpg'])`
         * 
         * @param whitelist An array of allowed file extensions
         * @throws 442 if the extension is not in the whitelist
         * @returns `true` if successful.
         */
    async verifyExtension(whitelist) {
        if (!whitelist.includes(this.extension()))
            await this.markUnverified(`${this.get('filename')} needs to be one of ${whitelist.join(', ')}.`);
        return true;
    }

    /**
         * Generally this would be called by a verify function such as 
         * `verifyExtension` rather than by you directly.
         * 
         * This function sets the status of this file to `verifyFailed`,
         * logs the failure, kicks off a background process to delete
         * the file, then throws a `442`.
         * 
         * Usage: `await s3file.markUnverified('This file sucks!')`
         * 
         * @param error A message about why the file is being marked as a failure.
         * @throws 442
         * @returns `true` if successful.
         */
    async markUnverified(error) {
        this.set('status', 'verifyFailed');
        await this.update();
        // future: kick off deletion process
        console.log(`S3File ${this.get('id')} unverified because ${error}.`);
        throw ouch('442', error)
    }

    /**
         * A relationship to a `UserRecord` that owns this file.
         * 
         * Usage: `const user = await s3file.user`
         * 
         * @throws 404 if the user cannot be found
         * @returns A `User` instance
         */
    get user() {
        return useUsers().findOrDie(this.get('userId'));
    }

    /**
         * A relationship to `UserKind` that use this file as an avatar
         * 
         * Usage: `const users = await s3file.avatarUsers`
         * 
         * @returns UserKind
         */
    get avatarUsers() {
        const users = useUsers();
        users.propDefaults.push({
            prop: 'avatarId',
            field: users.table.avatarId,
            value: this.get('id')
        });
        return users;
    }

}

/** A subclass of VingKind that sets up S3FileRecords.
 * @class
 */
export class S3FileKind extends VingKind {
    // add custom Kind code here
}

/** A composable that initializes `S3FileKind`. */
export const useS3Files = () => {
    return new S3FileKind(useDB(), S3FileTable, S3FileRecord);
}