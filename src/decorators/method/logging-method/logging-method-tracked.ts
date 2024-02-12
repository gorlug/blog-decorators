import {Todo} from './logging-method-todo'
import {LoggingMethod} from './logging-method-decorator'

export class TimeTracked {
    constructor(public todo: Todo, public timeTracked: number) {
    }

    @LoggingMethod()
    addTime(time: number) {
        this.timeTracked += time
        return this.timeTracked
    }
}
