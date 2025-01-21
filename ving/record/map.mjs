import { APIKeyRecord, APIKeyKind } from "#ving/record/records/APIKey.mjs";
import { UserRecord, UserKind } from "#ving/record/records/User.mjs";
import { TaskCompletionRecord, TaskCompletionKind } from "#ving/record/records/TaskCompletion.mjs";
import { OrderRecord, OrderKind } from "#ving/record/records/Order.mjs";
import { CronJobRecord, CronJobKind } from "#ving/record/records/CronJob.mjs";
import { S3FileRecord, S3FileKind } from "#ving/record/records/S3File.mjs";

export const recordModules = {
    User: UserRecord,
    TaskCompletion: TaskCompletionRecord,
    Order: OrderRecord,
    APIKey: APIKeyRecord,
    CronJob: CronJobRecord,
    S3File: S3FileRecord,
};

export const kindModules = {
    User: UserKind,
    TaskCompletion: TaskCompletionKind,
    Order: OrderKind,
    APIKey: APIKeyKind,
    CronJob: CronJobKind,
    S3File: S3FileKind,
};