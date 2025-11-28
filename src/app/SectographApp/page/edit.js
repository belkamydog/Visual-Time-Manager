import { createWidget, widget } from '@zos/ui'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'

Page({
    onInit(){
        const editableFields = ['Description', 'Start event', 'End event', 'Color']

        createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: px(0),
            y: px(150),
            w: px(480),
            h: px(200),
            data_array: editableFields,
            data_size: editableFields.length,
            item_text_size: 50,
            item_height: px(180),
            item_bg_color: 0x333333,
            item_click_func: (list, index) => {
                if (index == 0){

                }
                else if (index == 1){

                }
                else if (index == 2){

                }
                else if (index == 3){
                    
                }
            }
        })
    }
})