export const classDescriptionMap = new Map<string, string>()

export function DescriptionClass(description: string): ClassDecorator {
    return function (classFunction: Function) {
        classDescriptionMap.set(classFunction.name, description)
    }
}
