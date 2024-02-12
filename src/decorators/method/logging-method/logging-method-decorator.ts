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
