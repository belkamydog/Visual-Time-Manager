import { statSync, readFileSync, writeFileSync } from '@zos/fs'
import {log} from '@zos/utils'

const logger = log.getLogger('FileService')

export class FileService {
    /**
     * Reads file contents
     *
     * @param {string} path - Path to the file to read
     * @returns {string} File contents in UTF-8 format
     * @throws {Error} Throws error if file doesn't exist
     * @example
     * try {
     *   const content = fileService.readFile('/path/to/file.txt');
     *   console.log(content);
     * } catch (error) {
     *   console.error(error.message);
     * }
     */
    static readFile(path){
        let result = null
        logger.log('Reading file ' + path + '...')
        if (this.isFileAvail(path)){
            result = readFileSync({
                path: path,
                options: {
                    encoding: 'utf8',
                }
            })
            logger.log('Reading file ' + path + ' successfull')
        }
        else {
            logger.error('File  ' + path + ' is not availiable')
            throw new Error('File does not exist')
        }
        return result
    }
    /**
     * Writes data to a file
     *
     * @param {string} path - Path to the file for writing
     * @param {string} content - Content to write
     * @throws {Error} Throws error on write failure
     * @example
     * try {
     *   fileService.writeFile('/path/to/file.txt', 'Hello, World!');
     *   console.log('File written successfully');
     * } catch (error) {
     *   console.error(error.message);
     * }
     */
    static writeFile(path, content){
        logger.log('Write file to ' + path + '...')
        try{
            writeFileSync({
                path: path,
                data: JSON.stringify(content),
                options: {
                    encoding: 'utf8',
                },
            })
            logger.log('Writing file ' + path + ' successfull')
        } catch (Error){
            logger.error(Error, 'Write file to' + path + ' failed')
            throw new Error('Write file error')
        }
    }

    static isFileAvail(path){
        return statSync({
            path: path,
        }) ? true : false
    }
}