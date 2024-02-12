export function SimpleProperty(): PropertyDecorator {
    return function (classReference: object, propertyKey: string | symbol) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
    }
}
