export function SimpleClass(): ClassDecorator {
    return function (classFunction: Function) {
        console.log('class function', classFunction)
    }
}
