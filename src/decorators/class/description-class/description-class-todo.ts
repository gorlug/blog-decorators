import {DescriptionClass} from './description-class-decorator'

@DescriptionClass('This is a class for creating todos')
export class Todo {

    constructor(public name: string) {
    }
}
