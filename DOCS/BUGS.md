# Known Bugs & Issues

Track known issues and their resolution status.

---

## Open Issues

*No open issues at this time.*

---

## Resolved Issues

### 2026-01-03

#### Heavy Image Loading
- **Severity**: Medium
- **Status**: ✅ Fixed
- **Description**: Page loaded slowly due to large unoptimized images (~1.8MB total)
- **Resolution**: Resized and compressed all images, reduced total to ~900KB
- **Files**: `assets/images/roadmap.jpg`, `screenshots/*.jpg`

---

## Issue Template

When adding new bugs, use this format:

```markdown
#### [Brief Title]
- **Severity**: Critical/High/Medium/Low
- **Status**: Open/In Progress/Fixed
- **Description**: What's happening
- **Steps to Reproduce**: (if applicable)
- **Expected**: What should happen
- **Actual**: What happens instead
- **Workaround**: (if any)
- **Files**: Related files
```
