export function SimpleMethod(): MethodDecorator {
    return function (classReference: object, propertyKey: string | symbol, descriptor: PropertyDescriptor,
    ) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
        console.log('descriptor', descriptor)
    }
}
