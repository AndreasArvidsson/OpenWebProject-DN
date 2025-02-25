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

export { RDN };

export default class DN {
    readonly value: string;
    readonly rdns: RDN[];

    constructor(value?: string | RDN[]) {
        if (typeof value === "string") {
            this.value = value;
            this.rdns = stringToRdns(value);
        } else if (Array.isArray(value)) {
            this.value = rdnsToString(value);
            this.rdns = value;
        } else {
            this.value = "";
            this.rdns = [];
        }
    }

    length(): number {
        return this.rdns.length;
    }

    equals(o: unknown): boolean {
        if (o instanceof DN) {
            return o.value === this.value;
        }
        if (typeof o === "string") {
            return o === this.value;
        }
        return false;
    }

    getRDN(index: number): RDN | undefined {
        return this.rdns[index];
    }

    getLastRDN(): RDN {
        return this.rdns[this.rdns.length - 1];
    }

    getLastValue(): string {
        return this.getLastRDN().value;
    }

    getFirstRDN(attribute: string): RDN | undefined {
        return this.rdns.find((rdn) => rdn.attribute === attribute);
    }

    getFirstIndex(attribute: string): number {
        return this.rdns.findIndex((rdn) => rdn.attribute === attribute);
    }

    getParent(): DN | undefined {
        if (this.length() < 2) {
            return undefined;
        }
        return this.subDn(this.length() - 1);
    }

    getParents(): DN[] {
        const res: DN[] = [];
        for (let i = this.length() - 1; i > 0; --i) {
            res.push(this.subDn(i));
        }
        return res;
    }

    append(attribute: string, value: string): DN {
        return new DN([...this.rdns, new RDN(attribute, value)]);
    }

    subDn(length: number): DN {
        return new DN(this.rdns.slice(0, length));
    }

    toString(): string {
        return this.value;
    }

    compareTo(dn: DN): number {
        const size = Math.min(this.length(), dn.length());
        for (let i = 0; i < size; ++i) {
            const compare = this.rdns[i].compareTo(dn.rdns[i]);
            if (compare > 0) {
                return 1;
            }
            if (compare < 0) {
                return -1;
            }
        }
        if (this.length() > dn.length()) {
            return 1;
        }
        if (this.length() < dn.length()) {
            return -1;
        }
        return 0;
    }
}

function stringToRdns(dnString: string): RDN[] {
    const dnParts = dnString.match(DN_REGEXP);

    if (dnParts == null) {
        throw Error(`Malformed DN '${dnString}'`);
    }

    const res: RDN[] = [];

    for (let i = dnParts.length - 1; i > -1; --i) {
        const rdnParts = dnParts[i].match(RDN_REGEXP);
        if (rdnParts?.length !== 2) {
            throw Error(`Malformed DN '${dnString}'`);
        }
        res.push(new RDN(rdnParts[0], rdnParts[1], true));
    }

    return res;
}

function rdnsToString(rdns: RDN[]): string {
    const parts: string[] = [];
    for (let i = rdns.length - 1; i > -1; --i) {
        parts.push(rdns[i].toString());
    }
    return parts.join(",");
}
