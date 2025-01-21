import { APIKeyTable } from "#ving/drizzle/schema/APIKey.mjs";
import { UserTable } from "#ving/drizzle/schema/User.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { undefinedTable } from "#ving/drizzle/schema/undefined.mjs";
import { CronJobTable } from "#ving/drizzle/schema/CronJob.mjs";
import { S3FileTable } from "#ving/drizzle/schema/S3File.mjs";
import { OrderTable } from "#ving/drizzle/schema/Order.mjs";
export const tableModules = {
    User: UserTable,
    undefined: undefinedTable,
    undefined: undefinedTable,
    undefined: undefinedTable,
    undefined: undefinedTable,
    undefined: undefinedTable,
    undefined: undefinedTable,
    APIKey: APIKeyTable,
    CronJob: CronJobTable,
    S3File: S3FileTable,
    Order: OrderTable,
};