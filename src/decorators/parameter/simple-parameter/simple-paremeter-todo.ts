import {SimpleParameter} from './simple-parameter-decorator'

export class Todo {
    name: string

    constructor(name: string) {
        this.name = name
    }

    setName(@SimpleParameter() name: string) {
        this.name = name
    }
}
