import {SimpleProperty} from './simple-property-decorator'

export class Todo {
    @SimpleProperty()
    name: string

    constructor(name: string) {
        this.name = name
    }
}
