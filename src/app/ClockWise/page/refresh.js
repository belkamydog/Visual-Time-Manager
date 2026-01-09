import { eventServise } from '../utils/Globals';
import { widget, createWidget, align } from '@zos/ui'
import { exit } from '@zos/router'

/**
 * Update Data Page - Refreshes event data and returns to watch face.
 * 
 * This page is called from the watch face to refresh event data from the storage,
 * then immediately returns back to the watch face with updated data.
 * It displays a brief confirmation message during the update process.
 * 
 * @class Page
 * @memberof module:update-page
 * 
 * @example
 * // Call from watch face to refresh event data:
 * // hmApp.startApp({ appid: APP_ID_OF_UPDATE_PAGE });
 * 
 * @description
 * This page is designed to be triggered when the user wants to manually refresh
 * event data on the watch face. It ensures the most current events are displayed
 * without requiring a full watch face restart.
 */
Page({
    /**
     * Initializes the update page, triggers data refresh, and exits.
     * 
     * This method is called automatically when the page is opened.
     * It performs the following actions:
     * 1. Calls the event service to load and refresh actual events
     * 2. Displays a confirmation message
     * 3. Immediately exits back to the calling watch face
     * 
     * @method onInit
     * @memberof module:update-page.Page
     * @returns {void}
     * 
     * @see eventServise.getActualEvents - Loads and processes current events
     * @see createWidget - Creates the temporary UI element
     * @see exit - Returns to previous screen (watch face)
     */
    onInit() {
        // Refresh event data from storage
        eventServise.getActualEvents();
        
        // Display update confirmation message
        createWidget(widget.TEXT, {
            text: 'Update events data',
            text_size: 40,
            color: 0xffffff,
            x: 0,
            align_h: align.CENTER_H,
            y: 230,
            w: 480,
        });
        
        // Immediately return to watch face
        exit();
    }
});