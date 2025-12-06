import { log } from "@zos/utils"
import { FileService } from "./fileService"

/**
 * Work with app settings from device side
 */
export class SettingsService {
    logger = log.getLogger('SettingsService')
    settingsFile = 'settings'
    /**
     *  Auto-delete value
     *  0 never delete, 1 day delete,  2 week delete, 3 month delete,
     */
    autoDelete = null
    /**
     * Create or update file with app settings from device side
     */
    initSettings(){
        logger.log('Init settings')
        try{
            const fileSettings = FileService.readFile(this.settingsFile)
            if (!fileSettings) throw new Error('Empty settings file')
            const settings = JSON.parse(fileSettings)
            if (!this.#validateSettings(settings)) throw new Error('Invalid settings file')
            this.autoDelete = settings.autoDelete
            logger.log('Loading settings done, autoDelete = '+ this.autoDelete)
        } catch(Error){
            logger.error('Init settings falied... Set default settings...', Error)
            const new_set = { autoDelete: 0 }
            FileService.writeFile(new_set, this.settingsFile)
        }
    }
    /**
     * Set auto-delete value
     * @param  0 never delete, 1 day delete,  2 week delete, 3 month delete,
     */
    setAutoDelete(value){
        try {
            if (!this.#checkAutoDelete(value)) throw new Error('Invalid autoDelete value')
            this.autoDelete = value
            let updatedSettings = JSON.parse(FileService.readFile(this.settingsFile))
            updatedSettings.autoDelete = value
            logger.log('Settings updated. New auto-delete value: ' +  value)
            FileService.writeFile(updatedSettings, this.settingsFile)
        } catch(Error){
            this.logger.log('Set auto-delete settings falied...', Error)
        }
    }

    getAutoDelete(){ return this.autoDelete }

    #validateSettings(settings) {
        if (!settings || typeof settings !== 'object')  return false;
        return (settings.autoDelete !== undefined 
            && this.#checkAutoDelete(settings.autoDelete))
    }

    #checkAutoDelete(value){
        const allowValues = [0,1,2,3]
        return allowValues.includes(value)
    }

}