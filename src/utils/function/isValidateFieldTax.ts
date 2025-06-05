export function isValidateFieldTax(val: unknown): val is { passed?: boolean, value?: unknown } {
    return (
        val !== null &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        'passed' in val
    );
}
