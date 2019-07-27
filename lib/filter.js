function filter(advisories, resolves, exceptions, packages, { production }) {
  let issues = [];

  // Filter exceptions list
  for (let key in advisories) {
    if (advisories.hasOwnProperty(key)) {
      const advisory = advisories[key];

      if (
        exceptions.indexOf(advisory.url) === -1 &&
        exceptions.indexOf(advisory.cwe) === -1 &&
        exceptions.findIndex(e => advisory.cves.indexOf(e) > -1) === -1
      ) {
        issues.push(advisory);
      }
    }
  }

  // Only production
  if (production) {
    issues = issues
      .map(i => ({
        ...i,
        findings: i.findings
          .filter(f => !f.dev)
          .map(f => ({
            ...f,
            paths: f.paths.filter(p => packages.dependencies[p.split(">")[0]])
          }))
          .filter(f => f.paths.length > 0)
      }))
      .filter(i => i.findings.length > 0);
  }

  return issues;
}

module.exports = filter;
