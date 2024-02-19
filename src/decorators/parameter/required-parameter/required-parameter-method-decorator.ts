import {parameterDescriptionMap, RequiredParametersPerClass} from './required-parameter-decorator'

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
}
