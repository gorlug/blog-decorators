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
