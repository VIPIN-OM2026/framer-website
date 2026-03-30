/**
 * utils/raf.js — requestAnimationFrame scheduler
 *
 * Provides a managed RAF loop that multiple consumers can attach to,
 * avoiding N separate RAF loops fighting each other.
 *
 * Rules:
 *  - No DOM queries
 *  - No business logic
 *  - Pure scheduling infrastructure
 */

/** @typedef {(time: number, delta: number) => void} TickFn */

const createRAFScheduler = () => {
    /** @type {Map<symbol, TickFn>} */
    const callbacks = new Map()

    let rafId = 0
    let lastTime = 0
    let isRunning = false

    const tick = (time) => {
        const delta = lastTime ? time - lastTime : 0
        lastTime = time

        callbacks.forEach((fn) => fn(time, delta))

        if (callbacks.size > 0) {
            rafId = requestAnimationFrame(tick)
        } else {
            isRunning = false
        }
    }

    const start = () => {
        if (!isRunning && callbacks.size > 0) {
            isRunning = true
            rafId = requestAnimationFrame(tick)
        }
    }

    const stop = () => {
        cancelAnimationFrame(rafId)
        isRunning = false
        lastTime = 0
    }

    /**
     * Add a callback to the RAF loop.
     * Returns an unsubscribe function.
     * @param {TickFn} fn
     * @returns {() => void}
     */
    const add = (fn) => {
        const id = Symbol()
        callbacks.set(id, fn)
        start()

        return () => {
            callbacks.delete(id)
            if (callbacks.size === 0) stop()
        }
    }

    /**
     * Run a function on the next animation frame (one-shot).
     * @param {TickFn} fn
     */
    const next = (fn) => {
        requestAnimationFrame((time) => fn(time, 0))
    }

    return { add, next, stop }
}

export const raf = createRAFScheduler()

/**
 * Utility: lerp a value toward a target each frame.
 * @param {number} current
 * @param {number} target
 * @param {number} ease — 0 to 1 (lower = smoother)
 * @returns {number}
 */
export const lerp = (current, target, ease) =>
    current + (target - current) * ease

/**
 * Utility: map a value from one range to another.
 * @param {number} value
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @returns {number}
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
    ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin

/**
 * Utility: clamp a value between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)