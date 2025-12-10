import { FileService } from "./file-service"
import {log} from '@zos/utils'

const logger = log.getLogger('SettingsService')

export class SettingsService {
    /**
     * Путь к файлу настроек
     * @type {string}
     */
    settingsFilePath = 'settings'
    /**
     * Устанавливает настройки по умолчанию
     * 
     * @returns {void}
     */
    setDefaultSettings(){
        this.saveSettings({autoDelete: '0', colorTheme: '0'})
    }
    /**
     * Загружает настройки из файла
     * 
     * @returns {{autoDelete: string, colorTheme: string}} Объект с настройками
     * @throws {Error} Выбрасывает ошибку при неудачной загрузке
     */
    static loadSettings(){
        try{
            logger.log('Load settings...')
            const settings = FileService.readFile(this.settingsFilePath)
            this.#validateSettings(settings)
            const {autoDelete, colorTheme} = JSON.parse(settings)
            logger.log('Load settings done')
            return {autoDelete: autoDelete, colorTheme: colorTheme}
        } catch(Error){
            logger.error(Error, 'Load settings failed')
            throw new Error('Load settings failed')
        }

    }
    /**
     * Сохраняет настройки в файл
     * 
     * @param {Object} settings Объект с настройками для сохранения
     * @param {string} settings.autoDelete Значение автоудаления
     * @param {string} settings.colorTheme Значение темы оформления
     * @returns {void}
     * @throws {Error} Выбрасывает ошибку при неудачной записи
     */
    static saveSettings(settings){
        try{
            this.#validateSettings(settings)
            logger.log('Saving settings...')
            FileService.writeFile(this.settingsFilePath, settings)
            logger.log('Save settings done')
        } catch (Error){
            logger.error(Error, 'Save settings failed')
            throw new Error('Save settings failed')
        }
    }
    /**
     * Валидирует настройки перед сохранением или загрузкой
     * 
     * @param {Object} settings Объект с настройками для проверки
     * @throws {Error} Выбрасывает ошибку при несоответствии формата
     * @private
     */
    static #validateSettings(settings) {
    if (
        typeof settings !== 'object' ||
        settings === null ||
        typeof settings.autoDelete !== 'boolean' ||
        typeof settings.colorTheme !== 'string' ||
        !settings.hasOwnProperty('autoDelete') ||
        !settings.hasOwnProperty('colorTheme')
    ) {
        throw new Error('Invalid settings');
    }
    }

}