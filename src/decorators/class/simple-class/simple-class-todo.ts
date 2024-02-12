import {SimpleClass} from './simple-class-decorator'

@SimpleClass()
export class Todo {

    constructor(public name: string) {
    }
}
