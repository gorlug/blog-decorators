import {ClassPropertyDescription, propertyDescriptionMap} from './description-property-decorator'

export const classWitMethodDescriptionsMap = new Map<string, ClassPropertyDescription[]>()

export function DescriptionClass(): ClassDecorator {
    return function (classFunction: Function) {
        const properties = propertyDescriptionMap.get(classFunction.prototype) || []
        classWitMethodDescriptionsMap.set(classFunction.name, properties)
    }
}
