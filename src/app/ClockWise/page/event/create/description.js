import { createKeyboard, inputType } from '@zos/ui'
import { push, back } from '@zos/router'
import {log} from '@zos/utils'

const logger = log.getLogger('description.js')

Page ({
    onInit(){
        logger.log('Keyboard init')
        const keyboard = createKeyboard({
            inputType: inputType.JSKB,
            onComplete: (keyboardWidget, result) => {
                let event =  {description: result.data}
                logger.log('Create description done: ' + JSON.stringify(event))
                push({
                    url: 'page/event/create/start_date',
                    params: JSON.stringify(event),
                })
            },
            onCancel: (keyboardWidget, result) => {
                logger.log('Cancel keyboard input')
                back()
            },
            text: 'Event description'
        })
    }
})
