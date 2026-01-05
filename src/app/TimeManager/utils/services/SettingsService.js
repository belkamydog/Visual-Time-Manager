import { FileService } from "./FileService"
import {log} from '@zos/utils'

const logger = log.getLogger('SettingsService')

export class SettingsService {
    /**
     * Path to settings file
     * @type {string}
     */
    static #settingsFilePath = 'settings'
    /**
     * Set default settings
     * 
     * @returns {void}
     */
    static #setDefaultSettings(){
        logger.log('Set Default Settings')
        const defaultSet = {autoDelete: 'never', colorTheme: 'standard'}
        this.saveSettings(defaultSet)
        return defaultSet
    }
    /**
     * Load application settings from configuration file
     * 
     * Method performs sequence of actions:
     * 1. Attempts to read settings file
     * 2. Validates received data
     * 3. Parses JSON
     * 4. Returns settings object
     * 
     * If error occurs:
     * - Logs error
     * - Sets default settings
     * 
     * @returns {{autoDelete: string, colorTheme: string}} Application settings object
     * @throws {Error} In case of critical loading error
     * 
     * @example
     * const settings = SettingsManager.loadSettings();
     * // settings = { autoDelete: 'never', colorTheme: 'light' }
     */
    static loadSettings() {
        try {
            logger.log('Load settings...');
            const settings = JSON.parse(FileService.readFile(this.#settingsFilePath));
            this.#validateSettings(settings);
            logger.log('Load settings done');
            return { autoDelete:settings.autoDelete, colorTheme: settings.colorTheme };
        } catch (Error) {
            logger.error(Error, 'Load settings failed');
            return this.#setDefaultSettings();
        }
    }

    /**
     * Save settings to file
     * 
     * @param {Object} settings Settings object to save
     * @param {string} settings.autoDelete Auto-delete value
     * @param {string} settings.colorTheme Theme value
     * @returns {void}
     * @throws {Error} Throws error on failed write
     */
    static saveSettings(settings){
        try{
            this.#validateSettings(settings)
            logger.log('Saving settings...')
            FileService.writeFile(this.#settingsFilePath, settings)
            logger.log('Save settings done')
        } catch (Error){
            logger.error(Error, 'Save settings failed')
            throw new Error('Save settings failed')
        }
    }
    /**
     * Validate settings before saving or loading
     * 
     * @param {Object} settings Settings object to validate
     * @throws {Error} Throws error on format mismatch
     * @private
     */
    static #validateSettings(settings) {
        if (
            typeof settings !== 'object' ||
            settings == null || 
            typeof settings.autoDelete !== 'string' ||
            typeof settings.colorTheme !== 'string'||
            !settings.hasOwnProperty('autoDelete') ||
            !settings.hasOwnProperty('colorTheme')
        ) {
            throw new Error('Invalid settings');
        }
    }
}