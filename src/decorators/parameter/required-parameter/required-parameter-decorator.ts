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
