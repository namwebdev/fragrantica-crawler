/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class Validation {
    static checkDOMSelector(target: any) {
        if (!target) return false;
        if (target.$) return true;
        return false;
    }

    static checkDOMSelectorAll(target: any) {
        if (!target) return false;
        if (target.$$) return true;
        return false;
    }

    static checkDOMCanEvaluate(target: any) {
        if (!target) return false;
        if (target.evaluate) return true;
        return false;
    }
}
