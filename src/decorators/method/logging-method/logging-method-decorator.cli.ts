import {Todo} from './logging-method-todo'
import {TimeTracked} from './logging-method-tracked'

const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)

todo.setName('clean all dishes')
timeTracked.addTime(30)
