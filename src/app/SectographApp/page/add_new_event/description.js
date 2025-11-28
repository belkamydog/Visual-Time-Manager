import { createWidget, widget, text_style, align } from '@zos/ui'
import { createKeyboard, inputType } from '@zos/ui'
import { push, back } from '@zos/router'
import { DayEvents } from '../../utils/Globals'


Page ({
    onInit(params){
        let event = ''
        const keyboard = createKeyboard({
            inputType: inputType.JSKB,
            onComplete: (keyboardWidget, result) => {
                if (params && params !== 'undefined' && typeof params === 'string' && params.trim().length > 0) {
                    event = JSON.parse(params)
                    event.description = result.data
                    DayEvents.editEventDescription(event)
                    push({
                        url: 'page/event',
                        params: JSON.stringify(event),
                    })
                }
                else {
                    event = {description: result.data}
                    push({
                        url: 'page/add_new_event/start_date',
                        params: event,
                    })
                }
            },
            onCancel: (keyboardWidget, result) => {
                back()
            },
            text: ''
        })
    }
})
