/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-DN
 * https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names
 */
import RDN from "./RDN";

//Split on , but not \,
const DN_REGEXP = new RegExp(/(\\.|[^,])+/g);
//Split on = but not \=
const RDN_REGEXP = new RegExp(/(\\.|[^=])+/g);

class DN {

    constructor(value) {
        if (typeof value === "string") {
            this.value = value;
            this.rdns = stringToRdns(value);
        }
        else if (Array.isArray(value)) {
            this.value = rdnsToString(value);
            this.rdns = value;
        }
        else {
            this.value = "";
            this.rdns = [];
        }
    }

    length() {
        return this.rdns.length;
    }

    equals(o) {
        if (o instanceof DN) {
            return o.value === this.value;
        }
        if (typeof o === "string") {
            return o === this.value;
        }
        return false;
    }

    getRDN(index) {
        return this.rdns[index];
    }

    getLastRDN() {
        return this.rdns[this.rdns.length - 1];
    }

    getLastValue() {
        return this.getLastRDN().value;
    }

    getFirstRDN(attribute) {
        for (let rdn of this.rdns) {
            if (rdn.attribute === attribute) {
                return rdn;
            }
        }
        return null;
    }

    getFirstIndex(attribute) {
        for (let i = 0; i < this.rdns.length; ++i) {
            if (this.rdns[i].attribute == attribute) {
                return i;
            }
        }
        return -1;
    }

    getParent() {
        if (this.length() < 2) {
            return null;
        }
        return this.subDn(this.length() - 1);
    }

    getParents() {
        const res = [];
        for (let i = this.length() - 1; i > 0; --i) {
            res.push(this.subDn(i));
        }
        return res;
    }

    append(attribute, value) {
        return new DN([...this.rdns, new RDN(attribute, value)]);
    }

    subDn(length) {
        return new DN(this.rdns.slice(0, length));
    }

    toString() {
        return this.value;
    }

    compareTo(dn) {
        const size = Math.min(this.length(), dn.length());
        for (let i = 0; i < size; ++i) {
            const compare = this.rdns[i].compareTo(dn.rdns[i]);
            if (compare > 0) { return 1; }
            if (compare < 0) { return -1; }
        }
        if (this.length() > dn.length()) { return 1; }
        if (this.length() < dn.length()) { return -1; }
        return 0;
    }

}
export default DN;
export { RDN };

function stringToRdns(dnString) {
    const dnParts = dnString.match(DN_REGEXP);
    const res = [];
    for (let i = dnParts.length - 1; i > -1; --i) {
        const rdnParts = dnParts[i].match(RDN_REGEXP);
        res.push(new RDN(
            rdnParts[0],
            rdnParts[1],
            true
        ));
    }
    return res;
}

function rdnsToString(rdns) {
    const parts = [];
    for (let i = rdns.length - 1; i > -1; --i) {
        parts.push(rdns[i].toString());
    }
    return parts.join(",");
}