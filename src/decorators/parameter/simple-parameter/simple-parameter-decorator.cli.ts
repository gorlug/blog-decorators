import {Todo} from './simple-paremeter-todo'

const todo = new Todo('clean dishes')
todo.setName('clean all dishes')
console.log('todo', todo)

const secondTodo = new Todo('empty bin')
console.log('second todo', secondTodo)
