import {LoggingMethod} from './logging-method-decorator'

export class Todo {

    constructor(public name: string) {
    }

    @LoggingMethod()
    public setName(name: string) {
        this.name = name
    }
}
