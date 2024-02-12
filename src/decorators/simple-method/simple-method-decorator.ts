export function SimpleMethod(): MethodDecorator {
    return function (classPropertiesObject: object, propertyKey: string | symbol, descriptor: PropertyDescriptor,
    ) {
        console.log('classPropertiesObject', classPropertiesObject)
        console.log('propertyKey', propertyKey)
        console.log('descriptor', descriptor)
    }
}
