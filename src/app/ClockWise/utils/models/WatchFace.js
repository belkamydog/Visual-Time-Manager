/**
 * WatchFace class manages the display of hour digits on a watch face interface.
 * It maintains a circular buffer of hour values for display around the watch dial.
 * 
 * @class WatchFace
 */
export class WatchFace {
    /**
     * Array representing hour digits displayed at 12 positions around the watch face.
     * Contains 12 elements for the main positions plus a special 13th element for 23-hour notation.
     * @type {Array<number>}
     */
    timePointDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23]

    /**
     * Creates a new WatchFace instance
     * @constructor
     */
    constructor() { }

    /**
     * Initializes the watch face display based on the current hour.
     * Distributes hour values around the 12-hour dial with proper wraparound.
     * 
     * @param {number} hours - Current hour in 24-hour format (0-23)
     * @returns {void}
     * 
     * @example
     * // Initialize watch face for 14:00 (2 PM)
     * watchFace.initWatchFace(14);
     * // Result: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 23]
     */
    initWatchFace(hours) {
        // Ensure hours are within 0-23 range
        if (hours >= 24) hours %= 24

        // Calculate position for current hour in 12-hour format
        let currentHourIndex = 0
        if (hours < 12) currentHourIndex = hours
        else currentHourIndex = hours - 12

        // Set previous hour (wrapping around midnight)
        this.timePointDigits[(((currentHourIndex - 1) % 12) + 12) % 12] = hours - 1 >= 0 ? hours - 1 : 24 + (hours - 1)

        // Fill 11 positions starting from current hour
        for (let i = 0; i < 11; i++) {
            this.timePointDigits[(currentHourIndex + i) % 12] = hours
            hours = hours == 23 ? 0 : hours += 1
        }
    }

    /**
     * Updates a specific digit on the watch face when the hour changes.
     * This method handles the transition when moving forward two hours.
     * 
     * @param {number} hours - Current hour in 24-hour format (0-23)
     * @returns {void}
     * 
     * @example
     * // Update watch face when hour changes from 14 to 16
     * watchFace.updateWatchFaceDigit(16);
     */
    updateWatchFaceDigit(hours) {
        // Calculate which position needs updating (two hours ago)
        const changed = hours <= 0 ? 24 - 2 : hours - 2
        
        // Convert to 12-hour format index
        let currentHourIndex = 0
        if (changed < 12) currentHourIndex = changed
        else currentHourIndex = changed - 12
        
        // Update the corresponding position
        this.timePointDigits[currentHourIndex] = hours + 10
    }

    /**
     * Returns the current array of time point digits.
     * This array represents the hour values displayed at each position around the watch face.
     * 
     * @returns {Array<number>} Array of hour values for the 12 positions plus special 13th value
     * 
     * @example
     * const digits = watchFace.getTimePointDigits();
     * // digits = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 23]
     */
    getTimePointDigits() {
        return this.timePointDigits
    }
}