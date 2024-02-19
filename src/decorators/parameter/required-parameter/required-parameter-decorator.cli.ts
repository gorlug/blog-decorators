import {Todo} from './required-parameter-todo'

const todo = new Todo('clean dishes')
console.log('todo', todo)

todo.setName(undefined as unknown as string)
