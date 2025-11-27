import { EventsManager } from "./EventsManager"
import { WatchFace } from "./WatchFace"
import {log} from '@zos/utils'

export const DayEvents = new EventsManager()
export const wfNumbers = new WatchFace() 
export const Logger = log.getLogger()