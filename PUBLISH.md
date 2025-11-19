# 📤 Publishing to NPM

## Prerequisites

1. Create an npm account: https://www.npmjs.com/signup
2. Login via CLI: `npm login`

## Before Publishing

1. **Update package.json:**
   - Set your name in `author` field
   - Update `repository.url` with your GitHub repo
   - Update `homepage` and `bugs.url` if you have a repo

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Test locally:**
   ```bash
   npm pack
   # This creates a .tgz file you can test
   ```

## Publishing

1. **Check package name availability:**
   ```bash
   npm view screenshot-editor
   ```
   If it exists, you may need to use a scoped package: `@yourusername/screenshot-editor`

2. **Publish:**
   ```bash
   npm publish
   ```

3. **For scoped packages (if name is taken):**
   ```bash
   # Update package.json name to: "@yourusername/screenshot-editor"
   npm publish --access public
   ```

## After Publishing

Your package will be available at:
- `https://www.npmjs.com/package/screenshot-editor`
- Install with: `npm install screenshot-editor`

## Version Updates

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch
npm publish

# Minor version (1.0.0 -> 1.1.0)
npm version minor
npm publish

# Major version (1.0.0 -> 2.0.0)
npm version major
npm publish
```

## Important Notes

- Make sure `.npmignore` excludes unnecessary files
- Only files listed in `package.json` "files" array will be published
- Test the package after publishing: `npm install screenshot-editor` in a test project

