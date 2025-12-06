import { push , back} from '@zos/router'
import { widget, createWidget, prop } from '@zos/ui'
import { getText } from '@zos/i18n'
import {log} from '@zos/utils'
import { DATE_TIME_PEACKER, styleColors } from '../../../utils/Constants'

const logger = log.getLogger('end_date.js')

Page({

    attention(title){
        title.setProperty(prop.SUBTITLE, getText('Invalid date'))
    },

    getDate(currentValues){
        let endDate = new Date()
            endDate.setFullYear(currentValues.year)
            endDate.setMonth(currentValues.month)
            endDate.setDate(currentValues.day)
            endDate.setHours(currentValues.hour)
            endDate.setMinutes(currentValues.minute)
        return endDate
    },

    onInit(params) {
        logger.log('End date page init with params: ' + params)
        const current_event = JSON.parse(params)
        const startEvent = new Date(current_event.start)
        let currentValues = {
            day: startEvent.getDate(),
            month: startEvent.getMonth(),
            year: startEvent.getFullYear(),
            hour: startEvent.getHours(),
            minute: startEvent.getMinutes()
        }
        let dataArrays = {
            day: new Array(31).fill(0).map((d, index) => index + 1),
            month: new Array(12).fill(0).map((d, index) => index + 1), 
            year: new Array(3).fill(0).map((d, index) => index +  new Date().getFullYear()),
            hour: new Array(24).fill(0).map((d, index) => index),
            minute: new Array(60).fill(0).map((d, index) => index)
        }
        const picker_cb = (picker, event_type, column_index, select_index) => {
            if (event_type === 1) {
                switch(column_index) {
                    case 0:
                        currentValues.day = dataArrays.day[select_index]
                        break
                    case 1:
                        currentValues.month = dataArrays.month[select_index]
                        break
                    case 2:
                        currentValues.year = dataArrays.year[select_index]
                        break
                    case 3:
                        currentValues.hour = dataArrays.hour[select_index]
                        break
                    case 4:
                        currentValues.minute = dataArrays.minute[select_index]
                        break                       
                    }
                let endDate = this.getDate(currentValues)
                if (startEvent.getTime() > endDate.getTime()) {
                    this.attention(picker_widget)
                }
                else picker_widget.setProperty(prop.SUBTITLE, '')
            }
            if (event_type == 2){
                let endDate = this.getDate(currentValues)
                if (startEvent.getTime() > endDate.getTime()) {
                    this.attention(picker_widget)
                }
                else {
                    current_event.end = endDate.toISOString()
                    logger.log('Add end to event: ' + JSON.stringify(current_event))
                    push({
                        url: 'page/event/create/color',
                        params: JSON.stringify(current_event)
                    })
                }
            }
        }
        const picker_widget = createWidget(widget.WIDGET_PICKER, {
            title: getText('Event end'),
            subtitle: '',
            nb_of_columns: 5,
            single_wide: true,
            init_col_index: 1,
            data_config: [
                {
                    data_array: dataArrays.day,
                    init_val_index: startEvent.getDate() - 1,
                    unit: 'D',
                    support_loop: true,
                    font_size: DATE_TIME_PEACKER.font_size,
                    select_font_size: DATE_TIME_PEACKER.select_font_size,
                    connector_font_size: DATE_TIME_PEACKER.connector_font_size,
                    unit_font_size: DATE_TIME_PEACKER.unit_font_size,
                    col_width: DATE_TIME_PEACKER.col_width
                },
                {
                    data_array: dataArrays.month,
                    init_val_index: startEvent.getMonth(),
                    unit: 'M',
                    support_loop: true,
                    font_size: DATE_TIME_PEACKER.font_size,
                    select_font_size: DATE_TIME_PEACKER.select_font_size,
                    connector_font_size: DATE_TIME_PEACKER.connector_font_size,
                    unit_font_size: DATE_TIME_PEACKER.unit_font_size,
                    col_width: DATE_TIME_PEACKER.col_width
                },                
                {
                    data_array: dataArrays.year,
                    init_val_index: startEvent.getFullYear() - 1970,
                    unit: 'Y',
                    support_loop: true,
                    font_size: DATE_TIME_PEACKER.font_size,
                    select_font_size: DATE_TIME_PEACKER.select_font_size,
                    connector_font_size: DATE_TIME_PEACKER.connector_font_size,
                    unit_font_size: DATE_TIME_PEACKER.unit_font_size,
                    col_width: DATE_TIME_PEACKER.col_width
                },
                {
                    data_array: dataArrays.hour,
                    init_val_index: startEvent.getHours(),
                    unit: 'H',
                    support_loop: true,
                    font_size: DATE_TIME_PEACKER.font_size,
                    select_font_size: DATE_TIME_PEACKER.select_font_size,
                    connector_font_size: DATE_TIME_PEACKER.connector_font_size,
                    unit_font_size: DATE_TIME_PEACKER.unit_font_size,
                    col_width: DATE_TIME_PEACKER.col_width
                },
                {
                    data_array: dataArrays.minute,
                    init_val_index: startEvent.getMinutes(),
                    unit: 'M',
                    support_loop: true,
                    font_size: DATE_TIME_PEACKER.font_size,
                    select_font_size: DATE_TIME_PEACKER.select_font_size,
                    connector_font_size: DATE_TIME_PEACKER.connector_font_size,
                    unit_font_size: DATE_TIME_PEACKER.unit_font_size,
                    col_width: DATE_TIME_PEACKER.col_width
                }
            ],
            picker_cb
        })
    }
})