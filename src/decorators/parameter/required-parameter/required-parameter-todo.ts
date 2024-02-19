import {RequiredParameterMethod} from './required-parameter-method-decorator'
import {Required} from './required-parameter-decorator'

export class Todo {
    constructor(public name: string) {
    }

    @RequiredParameterMethod()
    setName(@Required() name: string) {
        this.name = name
    }
}
