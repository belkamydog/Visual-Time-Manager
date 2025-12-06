import { readFileSync, writeFileSync } from '@zos/fs'
import { log } from "@zos/utils"

/**
 * Work with fileSync
 */
export class FileService {
    logger = log.getLogger('FileService')
    /**
     * @param {*} path Path to file
     * @returns Contents of the file or null if file not exist
     * @type return type String 
     */
    static readFile(path){
        try{
           return readFileSync({
                path: path,
                options: {
                    encoding: 'utf8',
                }
            })
        } catch (Error){
            logger.error('Error reading file', Error)
            return null
        }
    }
    /**
     * @param {*} data Data to writing, it will be stringfy in this function
     * @param {*} path Path to file
     */
    static writeFile(data, path){
        try{
            writeFileSync({
                path: path,
                data: JSON.stringify(data),
                options: {
                    encoding: 'utf8',
                }
            })
        } catch (Error) {
            logger.error('Error writing file', Error)
        }

    }

}