# Example Code

This is the example code for the blog
post [A quick TypeScript decorators overview](https://blog.achim-rohn.de/6f15b20008b5)

# Getting started

## Install pnpm

`npm install -g pnpm`

## Install dependencies

`pnpm i`

# Blog post: A quick TypeScript decorators overview

All code examples can be found in this repository: <https://github.com/gorlug/blog-decorators>

TypeScript decorators are a nice way to add metadata information to TypeScript classes, methods, properties and parameters. In other languages this also might be called an annotation for example.

This post will show the different decorators (class, method, etc.) together with an example of what you could do with them.

Before you can use decorators you must activate them in your _tsconfig.json:_

```json
"experimentalDecorators": true, /* Enable experimental support for legacy experimental decorators. */
"emitDecoratorMetadata": true, /* Emit design-type metadata for decorated declarations in source files. */
```

#  Class decorator

Creating a decorator is fairly simple. You create a function that returns another function.

As an example here is a class decorator:

```typescript
export function SimpleClass(): ClassDecorator {
    return function (classFunction: Function) {
        console.log('class function', classFunction)
    }
}
```

And this is how you apply it to a class:

```typescript
@SimpleClass()
export class Todo {

    constructor(public name: string) {
    }
}
```

When you now initialise a new Todo object the SimpleClass decorator is called before initialisation. Decorators are only called once per class, so creating a second Todo object will not trigger the decorator again.

For example running this:

```typescript
const todo = new Todo('clean dishes')
console.log('todo', todo)

const secondTodo = new Todo('empty bin')
console.log('second todo', secondTodo)
```

Results in this output:

```
class constructor [class Todo]
todo Todo { name: 'clean dishes' }
second todo Todo { name: 'empty bin' }
```

## What can you do with it?

You can collect meta information about your class during startup. [NestJS](https://nestjs.com/) uses this to for example create HTTP Endpoints based on the information provided in such decorators.

To illustrate, here is an example of a decorator that gathers the description of classes:

```typescript
export const classDescriptionMap = new Map<string, string>()

export function DescriptionClass(description: string): ClassDecorator {
    return function (classFunction: Function) {
        classDescriptionMap.set(classFunction.name, description)
    }
}
```

This descriptor has the description of the class as the first parameter. That info is saved as the value and the name of the class as the key in a map.

This is how classes can use it:

```typescript
@DescriptionClass('This is a class for creating todos')
export class Todo {

    constructor(public name: string) {
    }
}

@DescriptionClass('Tracks the time of a Todo')
export class TimeTracked {
    constructor(public todo: Todo, public timeTracked: number) {
    }
}
```

And a simple run:

```typescript
console.log(classDescriptionMap)

const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)
```

Which results in this output:

```
Map(2) {
  'Todo' => 'This is a class for creating todos',
  'TimeTracked' => 'Tracks the time of a Todo'
}
todo Todo { name: 'clean dishes' }
time tracked TimeTracked { todo: Todo { name: 'clean dishes' }, timeTracked: 20 }
```

As you can see, the descriptions of these classes are available before instances of them are instantiated.

#  Method decorator

These work similar to the class decorator but take more arguments:

```typescript
export function SimpleMethod(): MethodDecorator {
    return function (classReference: object, propertyKey: string | symbol, descriptor: PropertyDescriptor,
    ) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
        console.log('descriptor', descriptor)
    }
}
```

The first parameter _classReference_ is a reference to the enclosing class. _propertyKey_ is the name of the method. descriptor is a reference to the _method_ which can be used to overwrite the implementation.

This is how it can be used:

```typescript
export class Todo {

    constructor(public name: string) {
    }

    @SimpleMethod()
    public setName(name: string) {
        this.name = name
    }
}
```

Running

```typescript
const todo = new Todo('clean dishes')
console.log('todo', todo)

const secondTodo = new Todo('empty bin')
console.log('second todo', secondTodo)
```

Results in

```
target {}
propertyKey setName
descriptor {
  value: [Function: setName],
  writable: true,
  enumerable: false,
  configurable: true
}
todo Todo { name: 'clean dishes' }
second todo Todo { name: 'empty bin' }
```

## Method decorator logging example

One thing you can do with this is to overwrite or extend the functionality of the method. One use for this is automatic logging. The example decorator for that:

```typescript
export function LoggingMethod(): MethodDecorator {
    return function (classReference: object, propertyKey: string | symbol, descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value
        descriptor.value = function (...args: any[]) {
            console.log(`The method ${String(propertyKey)} was called with the arguments ${args.join(', ')}`)
            const result = originalMethod.apply(this, args)
            console.log(`The method ${String(propertyKey)} returned ${result}`)
            return result
        }
    }
}
```

And the classes implementing it

```typescript
export class Todo {

    constructor(public name: string) {
    }

    @LoggingMethod()
    public setName(name: string) {
        this.name = name
    }
}

export class TimeTracked {
    constructor(public todo: Todo, public timeTracked: number) {
    }

    @LoggingMethod()
    addTime(time: number) {
        this.timeTracked += time
        return this.timeTracked
    }
}
```

A runtime example:

```typescript
const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)

todo.setName('clean all dishes')
timeTracked.addTime(30)
```

Which results in:

```
todo Todo { name: 'clean dishes' }
time tracked TimeTracked { todo: Todo { name: 'clean dishes' }, timeTracked: 20 }
The method setName was called with the arguments clean all dishes
The method setName returned undefined
The method addTime was called with the arguments 30
The method addTime returned 50
```

#  Property decorator

Property decorators work the same as method decorators except that there is no PropertyDescriptor because there is no functionality. A simple example:

```typescript
export function SimpleProperty(): PropertyDecorator {
    return function (classReference: object, propertyKey: string | symbol) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
    }
}
```

And the usage:

```typescript
export class Todo {
    @SimpleProperty()
    name: string

    constructor(name: string) {
        this.name = name
    }
}
```

A runtime example:

```typescript
const todo = new Todo('clean dishes')
console.log('todo', todo)

const secondTodo = new Todo('empty bin')
console.log('second todo', secondTodo)
```

The output:

```
classReference {}
propertyKey name
todo Todo { name: 'clean dishes' }
second todo Todo { name: 'empty bin' }
```

## Example of adding descriptions to properties of a class at runtime

This example will combine a property decorator together with a class decorator. The first thing to know is that property decorators are executed before the class decorator. Here is the property decorator:

```typescript
export interface ClassPropertyDescription {
    propertyName: string
    description: string
}

export const propertyDescriptionMap = new Map<object, ClassPropertyDescription[]>()

export function DescriptionProperty(description: string): PropertyDecorator {
    return function (classReference: object, propertyKey: string | symbol) {
        const properties = propertyDescriptionMap.get(classReference) || []
        properties.push({
            propertyName: propertyKey as string,
            description: description
        })
        propertyDescriptionMap.set(classReference, properties)
    }
}
```

It collects the properties and their descriptions in an array. That array is stored in a map with the _classReference_ as the key. This _classReference_ will then be used by the class decorator to combine this information with the name of the class into a new map:

```typescript
import {ClassPropertyDescription, propertyDescriptionMap} from './description-property-decorator'

export const classWitMethodDescriptionsMap = new Map<string, ClassPropertyDescription[]>()

export function DescriptionClass(): ClassDecorator {
    return function (classFunction: Function) {
        const properties = propertyDescriptionMap.get(classFunction.prototype) || []
        classWitMethodDescriptionsMap.set(classFunction.name, properties)
    }
}
```

As you can see the _classReference_ of the property decorator is the _prototype_ of the_classFunction_ parameter.

Here are again example classes implementing it:

```typescript
@DescriptionClass()
export class Todo {
    @DescriptionProperty('The name of the todo')
    name: string

    constructor(name: string) {
        this.name = name
    }
}

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
```

Runtime:

```typescript
console.log(classWitMethodDescriptionsMap)
const todo = new Todo('clean dishes')
console.log('todo', todo)

const timeTracked = new TimeTracked(todo, 20)
console.log('time tracked', timeTracked)
```

Result:

```
Map(2) {
  'Todo' => [ { propertyName: 'name', description: 'The name of the todo' } ],
  'TimeTracked' => [
    {
      propertyName: 'todo',
      description: 'The todo that is referenced by this time tracked object'
    },
    {
      propertyName: 'timeTracked',
      description: 'The time tracked for the todo'
    }
  ]
}
todo Todo { name: 'clean dishes' }
time tracked TimeTracked { todo: Todo { name: 'clean dishes' }, timeTracked: 20 }
```

#  Parameter decorator

Similarly to the method decorator you get the reference to the class and the name of the method to which the parameter belongs. Additionally you get the index of this parameter in the method.

Simple example:

```typescript
export function SimpleParameter(): ParameterDecorator {
    return function (classReference: object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
        console.log('parameterIndex', parameterIndex)
    }
}
```

The usage:

```typescript
export class Todo {
    name: string

    constructor(name: string) {
        this.name = name
    }

    setName(@SimpleParameter() name: string) {
        this.name = name
    }
}
```

Runtime:

```typescript
const todo = new Todo('clean dishes')
todo.setName('clean all dishes')
console.log('todo', todo)

const secondTodo = new Todo('empty bin')
console.log('second todo', secondTodo)
```

Output:

```
classReference {}
propertyKey setName
parameterIndex 0
todo Todo { name: 'clean all dishes' }
second todo Todo { name: 'empty bin' }
```

## Example of a required parameter decorator

In this example will create a _Required_ parameter decorator that works together with a method decorator. This is the parameter decorator:

```typescript
export class RequiredParametersPerClass {
    methodsWithRequiredParameters: Map<string, number[]> = new Map()

    addRequiredParameterToMethod(methodName: string, parameter: number) {
        const parameterIndexes = this.methodsWithRequiredParameters.get(methodName) || []
        parameterIndexes.push(parameter)
        this.methodsWithRequiredParameters.set(methodName, parameterIndexes)
    }

    doesMethodHaveRequiredParameters(methodName: string) {
        return this.methodsWithRequiredParameters.has(methodName)
    }

    getMethodRequiredParameters(methodName: string): number[] {
        return this.methodsWithRequiredParameters.get(methodName) || []
    }
}

export const parameterDescriptionMap = new Map<object, RequiredParametersPerClass>()

export function Required(): ParameterDecorator {
    return function (classReference: object, propertyKey: string | symbol | undefined, parameterIndex) {
        const requiredParametersPerClass = parameterDescriptionMap.get(classReference) || new RequiredParametersPerClass()
        requiredParametersPerClass.addRequiredParameterToMethod(String(propertyKey), parameterIndex)
        parameterDescriptionMap.set(classReference, requiredParametersPerClass)
    }
}
```

It essentially holds a map inside another map. The _RequiredParametersPerClass_ class holds all the methods of that class that have parameters. This is then stored in a map with the class reference as the key.

This map is then used by the method decorator:

```typescript
export function RequiredParameterMethod(): MethodDecorator {
    return function (classReference: object, propertyKey: string | symbol, descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value
        descriptor.value = function (...args: any[]) {
            const requiredParametersPerClass = parameterDescriptionMap.get(classReference) ?? new RequiredParametersPerClass()
            if (requiredParametersPerClass.doesMethodHaveRequiredParameters(String(propertyKey))) {
                const requiredParameters = requiredParametersPerClass.getMethodRequiredParameters(String(propertyKey))
                for (const parameterIndex of requiredParameters) {
                    if (args.length < parameterIndex || args[parameterIndex] === undefined) {
                        throw new Error(`The parameter at index ${parameterIndex} is required`)
                    }
                }
            }
            return originalMethod.apply(this, args)
        }
    }
```

It wraps the original method implementation. During runtime it gets the _RequiredParametersPerClass_ of the class of this method and looks up if this method has any required parameters. If it has it checks if the parameter at that index in the args array is defined. If not it throws an error.

Here is the decorators being used by a class:

```typescript
export class Todo {
    constructor(public name: string) {
    }

    @RequiredParameterMethod()
    setName(@Required() name: string) {
        this.name = name
    }
}
```

A runtime example:

```typescript
const todo = new Todo('clean dishes')
console.log('todo', todo)

todo.setName(undefined as unknown as string)
```

This just forces setName to be called with an undefined name. You wouldn’t write this in the code directly normally. This is just for example purposes. But during actual execution of the program it can potentially happen that the name parameter is set to undefined, since it is all JavaScript under the hood.

The output:

```
todo Todo { name: 'clean dishes' }
decorators/src/decorators/parameter/required-parameter/required-parameter-method-decorator.ts:13
                        throw new Error(`The parameter at index ${parameterIndex} is required`)
                              ^
Error: The parameter at index 0 is required
```

This concludes the quick overview of TypeScript decorators. Quick in this case relates more to the fact that the description and examples are kept to a minimum.

As mentioned in the beginning, all code examples can be found in this repository: <https://github.com/gorlug/blog-decorators>
