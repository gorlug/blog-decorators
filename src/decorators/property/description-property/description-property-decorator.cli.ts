import {Todo} from './description-property-todo'
import {classWitMethodDescriptionsMap} from './description-class-decorator'
import {TimeTracked} from './description-property-time-tracked'

console.log(classWitMethodDescriptionsMap)
const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)
