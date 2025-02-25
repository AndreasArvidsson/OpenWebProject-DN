# OpenWebProject DN

**Working with Distinguished Name(DN) strings in JavaScript**    

## Installation
`npm install owp.dn --save`

## Usage
```javascript
import DN from "owp.dn";

const dn = new DN("cn=Andreas Arvidsson,ou=Karlstad,o=Repill Linpro,c=Sweden");
```

### DN Class 
Represents the entire DN string.

**Members**
* value: String containing the entire DN.
* rdns: Array containing instances of RDN in reverse order from the DN string.

```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro,c=Sweden");
dn.value -> "cn=Andreas,o=Repill Linpro,c=Sweden"
dn.rdns -> [ RDN("c=Sweden"), RDN("o=Repill Linpro"), RDN("cn=Andreas") ]
```

### RDN Class
Represents a single Relative DN.

**Members**
* attribute: String containing the entire DN.
* value: String containing the value in raw/unescaped format. 
* valueEscaped: String containing the value in escaped format. 

```javascript
import { RDN } from "owp.dn";
const rdn = new RDN("cn", "Arvidsson, Andreas");
rdn.attribute -> "cn"
rdn.value -> "Arvidsson, Andreas"
rdn.valueEscaped -> "Arvidsson\, Andreas"
```

### length
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro,c=Sweden");
dn.length() -> 3
```

### equals
```javascript
const dn = new DN("cn=Andreas");
dn.equals(new DN("cn=Andreas")) -> true
dn.equals("cn=Andreas") -> true
```

### getRDN
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.getRDN(1) -> RDN("cn=Andreas")
```

### getLastRDN
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.getLastRDN() -> RDN("cn=Andreas")
```

### getFirstRDN
Find first RDN with the given attribute
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.getFirstRDN("cn") -> RDN("cn=Andreas")
```

### getFirstIndex
Find index of first RDN with the given attribute
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.getFirstIndex("cn") -> 1
```

### getParent
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.getParent() -> DN("o=Repill Linpro")
```

### getParents
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro,c=Sweden");
dn.getParents() -> [ DN("o=Repill Linpro,c=Sweden"), DN("c=Sweden") ]
```

### append
```javascript
const dn = new DN("o=Repill Linpro,c=Sweden");
dn.append("cn", "Andreas") -> DN("cn=Andreas,o=Repill Linpro,c=Sweden")
```

### toString
```javascript
const dn = new DN("cn=Andreas,o=Repill Linpro");
dn.toString() -> "cn=Andreas,o=Repill Linpro"
```

### compareTo
* Used to sort a list of DNs by RDN.value
* Returns -1, 0, +1 
```javascript
const dns = [
    new DN("cn=Andreas,c=Sweden"),
    new DN("cn=Andreas,o=Repill Linpro"),
    new DN("cn=Arvidsson,o=Repill Linpro")
];
dns.sort((a, b) => a.compareTo(b));
dns -> [
    DN("cn=Andreas,o=Repill Linpro"),
    DN("cn=Arvidsson,o=Repill Linpro"),
    DN("cn=Andreas,c=Sweden")
]
```

