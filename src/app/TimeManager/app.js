import { BaseApp } from '@zeppos/zml/base-app'

App(
    BaseApp({
        globalData: {},
        onCreate(options) {
            // Вызываем функцию инициализации сервиса
            console.log('app on create invoke');
        },

        onDestroy(options) {
            console.log('app on destroy invoke');
        }
    })
)
