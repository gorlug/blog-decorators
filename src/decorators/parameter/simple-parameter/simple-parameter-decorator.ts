export function SimpleParameter(): ParameterDecorator {
    return function (classReference: object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        console.log('classReference', classReference)
        console.log('propertyKey', propertyKey)
        console.log('parameterIndex', parameterIndex)
    }
}
