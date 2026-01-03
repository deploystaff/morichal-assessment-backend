# Discoveries & Technical Notes

Important findings, gotchas, and technical decisions.

---

## 2026-01-03

### Image Optimization

**Finding**: Original images were too large for web delivery.

- PNG format unnecessary for photos - JPG with quality 75-80 is sufficient
- Images over 1400px width provide no visual benefit on web
- Python PIL with LANCZOS resampling provides good quality resize

**Command used**:
```python
from PIL import Image
img = Image.open('image.png')
img = img.resize((1400, height), Image.LANCZOS)
img.save('image.jpg', 'JPEG', quality=75, optimize=True)
```

### Deployment

**Finding**: No git remote configured for this project.

- Project uses Netlify CLI for direct deployment
- Command: `netlify deploy --prod`
- Site ID stored in `.netlify/state.json`
- No git push needed - deploy directly from local

### Project Structure

**Finding**: This is a static report site, not the main MorichalAI platform.

- `morichal-assessment/` - Sprint assessment reports (this project)
- Main platform is at `dev.morichalai.com` (separate codebase)
- Proposal document at `morichal-proposal.deploystaff.com`

### Password Protection

**Finding**: Site uses client-side password protection.

- Password overlay in `index.html`
- JavaScript-based decryption
- Password: referenced in CLAUDE.md for assessment site

---

## Architecture Notes

### File Structure
```
morichal-assessment/
├── index.html          # Main report (single-page, ~2000 lines)
├── CLAUDE.md           # Project instructions + context
├── DOCS/               # Documentation
│   ├── PROJECT-CONTEXT.md  # Full project knowledge base
│   ├── STATUS.md           # Current status
│   ├── CHANGELOG.md        # Change history
│   └── DISCOVERIES.md      # This file
├── assets/
│   └── images/
│       └── roadmap.jpg     # Project roadmap visual
├── screenshots/            # Timeline & feature screenshots
└── .netlify/              # Netlify deployment config
```

### CSS Architecture
- All styles inline in `<style>` tag
- CSS custom properties (variables) for theming
- Primary color: `#0f766e` (teal)
- Font: Inter (Google Fonts)
