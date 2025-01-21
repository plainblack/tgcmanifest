import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";
import {eq} from '#ving/drizzle/orm.mjs';
import { isUndefined } from '#ving/utils/identify.mjs';

/** Management of individual TaskCompletions.
 * @class
 */
export class TaskCompletionRecord extends VingRecord {
    // add custom Record code here
    
  /**
   * Extends `describe()` in `VingRecord` to add `meta` property `bar`
   *  and the `extra` property `foo`.
   * 
   * Note, these don't do anything, this is just here to explain how to extend
   * the describe method.
   * 
   * @see VingRecord.describe()
   */
  async describe(params = {}) {
      const out = await super.describe(params);
      if (params?.include?.meta && out.meta) {
          out.meta.bar = 'bar';
      }
      if (params?.include?.extra.includes('foo')) {
          out.extra.foo = 'foo';
      }
      return out;
  }
  
    
  /**
   * Extends `describeLinks()` in `VingRecord` 
   * @see VingRecord.describeLinks()
   */
    async describeLinks(idString, restVersion, schema, params = {}) {
        const links = await super.describeLinks(idString, restVersion, schema, params);
        links.view = { href: `/taskcompletions/${idString}`, methods: ['GET'], usage: 'page' };
        links.edit = { href: `/taskcompletions/${idString}/edit`, methods: ['GET'], usage: 'page' };
        links.list = { href: '/taskcompletions', methods: ['GET'], usage: 'page' };
        return links;
    }
  
    
}

/** Management of all TaskCompletions.
 * @class
 */
export class TaskCompletionKind extends VingKind  {
    // add custom Kind code here
    
    /**
     * An example of a shortcut for a common query you might want to make.
     * 
     * @returns a list of `TaskCompletionRecord`s that are cool
     */
    async findCool() {
        return this.select.findMany(eq(this.table.isCool, true));
    }
    
}