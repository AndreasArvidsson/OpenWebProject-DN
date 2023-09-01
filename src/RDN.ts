/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-DN
 * https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names
 */

export default class RDN {
    readonly attribute: string;
    readonly value: string;
    readonly valueEscaped: string;

    constructor(attribute: string, value: string, isValueEscaped?: boolean) {
        this.attribute = attribute;
        if (isValueEscaped) {
            this.value = unEscapeValue(value);
            this.valueEscaped = value;
        } else {
            this.value = value.trim();
            this.valueEscaped = escapeValue(value.trim());
        }
    }

    toString(): string {
        return this.attribute + "=" + this.valueEscaped;
    }

    compareTo(rdn: RDN): number {
        return this.value.localeCompare(rdn.value);
    }
}

function escapeValue(value: string): string {
    return value.replace(
        /^(#)|(,|\+|"|\\|<|>|;|\u0x0A|\u0x0D|=|\/)/gm,
        (match) => "\\" + match
    );
}

function unEscapeValue(value: string): string {
    return value.replace(/(?:\\(.))/g, "$1");
}
