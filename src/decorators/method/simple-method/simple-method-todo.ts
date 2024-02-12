import {SimpleMethod} from './simple-method-decorator'

export class Todo {

    constructor(public name: string) {
    }

    @SimpleMethod()
    public setName(name: string) {
        this.name = name
    }
}
