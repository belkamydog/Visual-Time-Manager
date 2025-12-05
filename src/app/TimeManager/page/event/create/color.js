import { createWidget, widget, prop } from '@zos/ui'
import { getText } from '@zos/i18n'
import { COLORS } from '../../../utils/Constants'
import { push } from '@zos/router'
import {log} from '@zos/utils'

const logger = log.getLogger('colors.js')

Page({
    onInit(params){
        logger.log('Init color peacker page with params: ' + params)
        const title = createWidget(widget.TEXT, {
            x: 140,
            y: 50,
            text: getText('Event color'),
            text_size: 40,
            w: 480,
            h: 50,
        })
        const scrollList = createWidget(widget.VIEW_CONTAINER, {
            x: 0,
            y: 120,
            w: 480,
            h: 280,
            pos_y: -80
        })
        for (let row = 0, color_i = 0; row < COLORS.length/4; row++){
            for (let col = 0; col < 3; col++){
                const currentColor = COLORS[color_i++]
                const btn = scrollList.createWidget(widget.BUTTON, {
                    x: 80 + 100 * col + 20,
                    y: 80 + 100 * row,
                    w: 80,
                    h: 80,
                    radius: 0,
                    normal_color: currentColor,
                    press_color: 0xfeb4a8,
                    text: '',
                    click_func: (color_i) => {
                            const current_event = JSON.parse(params)
                            current_event.color = currentColor
                            logger.log('Color add to event: color: ' + JSON.stringify(current_event.color))
                            push({
                                url: 'page/event/create/repeat',
                                params: JSON.stringify(current_event)
                            })
                    }
                })
            }
        }
    }
})