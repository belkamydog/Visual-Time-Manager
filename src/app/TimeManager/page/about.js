import { createWidget, widget, align } from '@zos/ui'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { styleColors } from '../utils/Constants'

Page({
    onInit() {
    createWidget(widget.TEXT, {
      text: getText('About'),
      x: 0,
      y: 50,
      w: 480,
      h: 50,
      text_size: 40,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: styleColors.white
    })
    createWidget(widget.TEXT, {
      text: getText('App name') + ': Visual time planner',
      x: 50,
      y: 120,
      w: 440,
      h: 40,
      text_size: 24,
      align_h: align.LEFT,
      color: styleColors.white_smoke
    })

    createWidget(widget.TEXT, {
      text: getText('Version') + ': 1.0.0',
      x: 50,
      y: 170,
      w: 440,
      h: 40,
      text_size: 24,
      align_h: align.LEFT,
      color: styleColors.white_smoke
    })

    createWidget(widget.TEXT, {
      text: getText('Developer') + ': belkamydog',
      x: 50,
      y: 220,
      w: 440,
      h: 40,
      text_size: 24,
      align_h: align.LEFT,
      color: styleColors.white_smoke
    })

    createWidget(widget.TEXT, {
      text: getText('Contact ') + ': belkamydog22@gmail.com',
      x: 50,
      y: 270,
      w: 480,
      h: 30,
      text_size: 24,
      align_h: align.LEFT,
      color: styleColors.white_smoke
    })

    createWidget(widget.BUTTON, {
      x: 40,
      y: 350,
      w: 400,
      h: 60,
      radius: 30,
      normal_color: styleColors.dark_gray,
      press_color: styleColors.blue_violet,
      text: getText('Back'),
      text_size: 24,
      click_func: () => {
        push({ url: 'page/menu' })
      }
    })
  }
})