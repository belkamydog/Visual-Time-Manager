import { eventServise} from '../utils/Globals';
import {widget, createWidget, align} from '@zos/ui'

import { exit } from '@zos/router'

Page({
    onInit(){
        eventServise.getActualEvents()
        createWidget(widget.TEXT, {
            text: 'Update events data',
            text_size: 40,
            color: 0xffffff,
            x: 0,
            align_h: align.CENTER_H,
            y: 230,
            w: 480,
        })
        exit()
    }
})