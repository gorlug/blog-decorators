import {DescriptionClass} from './description-class-decorator'
import {Todo} from './description-property-todo'
import {DescriptionProperty} from './description-property-decorator'

@DescriptionClass()
export class TimeTracked {
    @DescriptionProperty('The todo that is referenced by this time tracked object')
    todo: Todo

    @DescriptionProperty('The time tracked for the todo')
    timeTracked: number

    constructor(todo: Todo, timeTracked: number) {
        this.todo = todo
        this.timeTracked = timeTracked
    }

}
