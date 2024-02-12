import {Todo} from './description-class-todo'
import {classDescriptionMap} from './description-class-decorator'
import {TimeTracked} from './description-class-time-tracked'

console.log(classDescriptionMap)

const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)

