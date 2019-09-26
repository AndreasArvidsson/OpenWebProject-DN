/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-DN
 * https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names
 */

class RDN {

    constructor(attribute, value, isValueEscaped) {
        this.attribute = attribute;
        if (isValueEscaped) {
            this.value = unEscapeValue(value);
            this.valueEscaped = value;
        }
        else {
            this.value = value.trim();
            this.valueEscaped = escapeValue(value.trim());
        }
    }

    toString() {
        return this.attribute + "=" + this.valueEscaped;
    }

    compareTo(rdn) {
        return this.value.localeCompare(rdn.value);
    }

}
export default RDN;

function escapeValue(value) {
    return value.
    replace(/^(#)|(,|\+|"|\\|<|>|;|\u0x0A|\u0x0D|=|\/)/gm,
        match => "\\" + match
    )
}

function unEscapeValue(value) {
    return value.replace(/(?:\\(.))/g, "$1");
}