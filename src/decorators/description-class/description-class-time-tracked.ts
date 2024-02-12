import {Todo} from './description-class-todo'
import {DescriptionClass} from './description-class-decorator'

@DescriptionClass('Tracks the time of a Todo')
export class TimeTracked {
    constructor(public todo: Todo, public timeTracked: number) {
    }
}
