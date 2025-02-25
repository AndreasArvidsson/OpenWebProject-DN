import assert from "node:assert";
import DN, { RDN } from "..";

describe("DN", () => {
    const dnString =
        "cn=Andreas\\, Arvidsson,ou=Karlstad,o=Repill Linpro,c=Sverige";
    const dn = new DN(dnString);

    const assertEquals = (title: string, expected: unknown, actual: unknown) =>
        it(title, () => assert.equal(actual, expected));

    const assertThrows = (title: string, fn: () => void) =>
        it(title, () => assert.throws(fn));

    assertEquals("length", 4, dn.length());

    assertEquals("equals", true, dn.equals(new DN(dnString)));
    assertEquals("equals", true, dn.equals(dnString));

    assertEquals("getRDN", "c=Sverige", dn.getRDN(0)?.toString());
    assertEquals("getRDN", "o=Repill Linpro", dn.getRDN(1)?.toString());
    assertEquals("getRDN", "ou=Karlstad", dn.getRDN(2)?.toString());

    assertEquals(
        "getLastRDN",
        "cn=Andreas\\, Arvidsson",
        dn.getLastRDN().toString()
    );

    assertEquals(
        "getFirstRDN",
        "o=Repill Linpro",
        dn.getFirstRDN("o")?.toString()
    );

    assertEquals("getFirstIndex", 1, dn.getFirstIndex("o"));

    assertEquals(
        "getParent",
        "ou=Karlstad,o=Repill Linpro,c=Sverige",
        dn.getParent()?.toString()
    );
    const parents = dn.getParents();
    assertEquals("getParents", 3, parents.length);
    assertEquals(
        "getParents",
        "ou=Karlstad,o=Repill Linpro,c=Sverige",
        parents[0].toString()
    );
    assertEquals(
        "getParents",
        "o=Repill Linpro,c=Sverige",
        parents[1].toString()
    );
    assertEquals("getParents", "c=Sverige", parents[2].toString());

    const dn2 = dn.append("ou", ' # , # + " \\ < > ; u0x0Ah u0x0Di = / ');
    assertEquals("append", 5, dn2.length());

    const dn3 = dn.append("cn", "A, B, C");
    assertEquals(
        "append escape",
        "cn=A\\, B\\, C",
        dn3.getLastRDN().toString()
    );

    assertEquals("toString", dn.value, dn.toString());

    const dns = [
        new DN("c=D,b=A,a=C"),
        new DN("c=A,b=D,a=B"),
        new DN("c=G,b=H,a=A"),
        new DN("d=F,c=C,b=C,a=D"),
        new DN("c=C,b=C,a=D"),
    ];
    dns.sort((a, b) => a.compareTo(b));
    const getStr = (dn: DN) => {
        return dn.rdns.map((rdn) => rdn.value).join();
    };
    assertEquals("compareTo", "A,H,G", getStr(dns[0]));
    assertEquals("compareTo", "B,D,A", getStr(dns[1]));
    assertEquals("compareTo", "C,A,D", getStr(dns[2]));
    assertEquals("compareTo", "D,C,C", getStr(dns[3]));
    assertEquals("compareTo", "D,C,C,F", getStr(dns[4]));

    const rdn1 = dn2.getLastRDN();
    const rdn2 = new RDN(rdn1.attribute, rdn1.value);
    const rdn3 = new RDN(rdn1.attribute, rdn1.valueEscaped, true);
    assertEquals(
        "RDN",
        '\\# \\, # \\+ \\" \\\\ \\< \\> \\; \\u0x0Ah \\u0x0Di \\= \\/',
        rdn1.valueEscaped
    );
    [rdn2, rdn3].forEach((rdn, i) => {
        ["attribute", "value", "valueEscaped"].forEach((field) => {
            assertEquals(
                "RDN" + (i + 2) + "." + field,
                rdn1[field],
                rdn[field]
            );
        });
    });

    assertThrows("Throws: empty", () => new DN(""));
    assertThrows("Throws: missing prefix", () => new DN("Sverige"));
    assertThrows("Throws: missing value", () => new DN("c="));
});
