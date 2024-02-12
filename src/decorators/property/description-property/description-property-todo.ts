import {DescriptionProperty} from './description-property-decorator'
import {DescriptionClass} from './description-class-decorator'

@DescriptionClass()
export class Todo {
    @DescriptionProperty('The name of the todo')
    name: string

    constructor(name: string) {
        this.name = name
    }
}
