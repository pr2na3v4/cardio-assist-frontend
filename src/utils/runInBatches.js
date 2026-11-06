/**
 * utils/runInBatches.js
 * ========================
 * Runs an async task for every item in `items`, at most `concurrency` at a
 * time, calling `onItemDone` after each one so callers can update a live
 * progress bar. Used by BulkPatientUpload to submit many POST /patients
 * calls without opening hundreds of simultaneous connections.
 */

export async function runInBatches(items, task, { concurrency = 3, onItemDone } = {}) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor++;
      try {
        const value = await task(items[currentIndex], currentIndex);
        results[currentIndex] = { status: "fulfilled", value };
      } catch (error) {
        results[currentIndex] = { status: "rejected", error };
      }
      onItemDone?.(currentIndex, results[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}