import { Queue } from 'bullmq';

import { Logger } from '@nestjs/common';

import { sleep } from './sleep';

<<<<<<< HEAD
/**
 * Throttle a BullMQ queue until there are no active workers
 * or the maximum number of attempts is reached. While throttling,
 * the queue is repeatedly paused, and the active worker count checked.
 *
 * @param {Queue} queue - The BullMQ queue to throttle.
 * @param {Logger} logger - Logger instance to log progress and status.
 * @returns {Promise<() => Promise<void>>} - Returns an async function that, when called, resumes the queue.
 * @throws {Error} If the queue still has active workers after 10 attempts.
 */
export async function throttleQueue(
    queue: Queue,
    logger: Logger,
    maxAttempts = 10,
): Promise<() => Promise<void>> {
    await queue.pause();

    let haveActiveWorkers = await queue.getActiveCount();
    let attempts = 0;

    logger.log(`Paused ${queue.name} queue. ${haveActiveWorkers} active workers.`);

    while (haveActiveWorkers > 0 && attempts < maxAttempts) {
        await sleep(1_400);
        haveActiveWorkers = await queue.getActiveCount();
        attempts++;
    }

    if (haveActiveWorkers > 0) {
        logger.warn(`${queue.name} queue is not empty after ${maxAttempts} attempts.`);
    }

    return async (): Promise<void> => {
        logger.log(`Resuming ${queue.name} queue after throttling.`);
        await queue.resume();
=======
export async function throttleQueues(
    queues: Queue[],
    logger: Logger,
    maxAttempts = 10,
): Promise<() => Promise<void>> {
    await Promise.all(queues.map((q) => q.pause()));

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const activeCounts = await Promise.all(
            queues.map(async (q) => ({ name: q.name, active: await q.getActiveCount() })),
        );

        const busy = activeCounts.filter((q) => q.active > 0);

        if (busy.length === 0) break;

        for (const q of busy) {
            logger.log(
                `${q.name} has ${q.active} active workers (attempt ${attempt + 1}/${maxAttempts})`,
            );
        }

        await sleep(1_400);
    }

    const remaining = await Promise.all(
        queues.map(async (q) => ({ name: q.name, active: await q.getActiveCount() })),
    );
    for (const q of remaining.filter((q) => q.active > 0)) {
        logger.warn(
            `${q.name} still has ${q.active} active workers after ${maxAttempts} attempts.`,
        );
    }

    return async () => {
        await Promise.all(
            queues.map((q) => {
                logger.log(`Resuming ${q.name} queue after throttling.`);
                return q.resume();
            }),
        );
>>>>>>> upstream/main
    };
}
