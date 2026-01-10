import { readSync, openSync, O_RDONLY, closeSync} from '@zos/fs'
import { getText } from '@zos/i18n'

export class Manager{

    static getNextState(listOfEvents) {
        const now = new Date().getTime();
        let result = null;
        
        for (let element  of listOfEvents ) {
            const start = new Date(element.start).getTime();
            const end = new Date(element.end).getTime();
            if (now >= start && now <= end) {
                result = { ...element };
                return result;
            }
            else if (now < start) {
                if (!result || start < new Date(result.start).getTime()) {
                    result = { ...element };
                    return result
                }
            }
        }
        return { 
            description: getText('Open app to create new events'), 
            status: '➕' 
        };
    }

    static #decodeBuffer(buffer) {
        const uint8Array = new Uint8Array(buffer);
        let str = '';
        let i = 0;
        while (i < uint8Array.length) {
            const byte = uint8Array[i];
            if (byte === 0) {
                break; // Прекращаем обработку при нулевом байте
            }
            // Определяем количество байтов в символе
            if ((byte & 0x80) === 0) { // 1-байтовый символ (ASCII)
                str += String.fromCharCode(byte);
                i++;
            } else if ((byte & 0xE0) === 0xC0) { // 2-байтовый символ
                if (i + 1 >= uint8Array.length) break;
                const nextByte = uint8Array[i + 1];
                const charCode = ((byte & 0x1F) << 6) | (nextByte & 0x3F);
                str += String.fromCharCode(charCode);
                i += 2;
            } else if ((byte & 0xF0) === 0xE0) { // 3-байтовый символ
                if (i + 2 >= uint8Array.length) break;
                const nextByte1 = uint8Array[i + 1];
                const nextByte2 = uint8Array[i + 2];
                const charCode = ((byte & 0x0F) << 12) | 
                                ((nextByte1 & 0x3F) << 6) | 
                                (nextByte2 & 0x3F);
                str += String.fromCharCode(charCode);
                i += 3;
            } else if ((byte & 0xF8) === 0xF0) { // 4-байтовый символ
                if (i + 3 >= uint8Array.length) break;
                const nextByte1 = uint8Array[i + 1];
                const nextByte2 = uint8Array[i + 2];
                const nextByte3 = uint8Array[i + 3];
                const charCode = ((byte & 0x07) << 18) | 
                                ((nextByte1 & 0x3F) << 12) | 
                                ((nextByte2 & 0x3F) << 6) | 
                                (nextByte3 & 0x3F);
                str += String.fromCharCode(charCode);
                i += 4;
            } else {
                i++;
            }
        }
        
        return str;
    }

    static uploadActualEvents(){
        const fd = openSync({
            path: 'actual_events',
            flag: O_RDONLY,
            options:{
            appId: 1099579,
            }
        })
        if (fd >= 0){
            const buffer = new ArrayBuffer(500)
            readSync({
                fd,
                buffer,
            })
            closeSync({ fd })
            let text = this.#decodeBuffer(buffer)
            const t = JSON.parse(text)      
            try {
                return  JSON.parse(text)
            } catch (error) {
                return []
            }
        }
        else return []
    }
}