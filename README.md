# npm-audit-plus

Bring back the missing features of NSP to NPM Audit

- Allow exceptions of vulnerabilities by using .naprc file

```json
{
  "exceptions": ["vulnerability url", "cve id", "cwe id"]
}
```

- Allow only auditing production package. This is extremely useful when there is issues in dev depedencies package, it should not block the whole pipeline

```bash
$ audit-plus --production
```
