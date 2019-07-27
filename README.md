# audit+

## Overview

Bring back the missing features of NSP to NPM Audit

- Ignore particular advisories
- Specify depedency type you want to audit

## Installation

Install globally:
```bash
$ npm install -g audit-plus
```

or install locally:
```bash
$ npm install audit-plus
```


## Usage

Allow exceptions of vulnerabilities by using .auditrc file

```json
{
  "exceptions": ["vulnerability url", "cve id", "cwe id"]
}
```


Allow only auditing production package. This is extremely useful when there is issues in dev depedencies package, it should not block the whole pipeline

```bash
$ audit-plus --production
```


Audit whole depedencies (dev and prod)
```
$ audit-plus
```

Fix depedencies 
```
$ audit-plus --fix
```

Fix depedencies force
```
$ audit-plus --fix --force
```
