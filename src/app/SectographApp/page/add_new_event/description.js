import { createWidget, widget, text_style, align } from '@zos/ui'
import { createKeyboard, inputType } from '@zos/ui'
import { px } from '@zos/utils'
import { push } from '@zos/router'


Page ({
    build(){
        const keyboard = createKeyboard({
            inputType: inputType.JSKB,
            onComplete: (keyboardWidget, result) => {
                const event = {description: result.data}
                push({
                    url: 'page/add_new_event/start_date',
                    params: event,
                })
            },
            onCancel: (keyboardWidget, result) => {
            },
            text: 'Event description'
        })
    }
})
