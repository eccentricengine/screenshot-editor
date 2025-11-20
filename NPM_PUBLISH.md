# NPM Publishing Guide

## Prerequisites

1. **NPM Account**: Make sure you have an NPM account. If not, create one at [npmjs.com](https://www.npmjs.com/signup)

2. **Login to NPM**: 
   ```bash
   npm login
   ```
   Enter your username, password, and email when prompted.

3. **Verify Login**:
   ```bash
   npm whoami
   ```
   This should display your NPM username.

## Publishing Steps

### Step 1: Update Version (if needed)

The current version is `1.0.1`. If you want to publish a new version:

```bash
# For patch version (1.0.1 -> 1.0.2)
npm version patch

# For minor version (1.0.1 -> 1.1.0)
npm version minor

# For major version (1.0.1 -> 2.0.0)
npm version major
```

Or manually edit `package.json` and change the version number.

### Step 2: Build the Package

```bash
npm run build
```

This ensures all files are up to date.

### Step 3: Check What Will Be Published

```bash
npm pack --dry-run
```

This shows what files will be included in the package without actually creating the tarball.

### Step 4: Publish to NPM

#### For Public Package (Recommended):
```bash
npm publish
```

#### For Private Package (requires paid NPM account):
```bash
npm publish --access restricted
```

### Step 5: Verify Publication

After publishing, verify your package is available:

1. Visit: `https://www.npmjs.com/package/screenshot-editor`
2. Or check via CLI:
   ```bash
   npm view screenshot-editor
   ```

## Testing the Published Package

After publishing, you can test it in a new project:

```bash
# Create a test directory
mkdir test-screenshot-editor
cd test-screenshot-editor

# Install your package
npm install screenshot-editor

# Test it in your code
```

## Updating the Package

When you make changes and want to publish an update:

1. Make your changes
2. Update version: `npm version patch` (or minor/major)
3. Build: `npm run build`
4. Publish: `npm publish`

## Troubleshooting

### Error: "You do not have permission to publish"
- Make sure you're logged in: `npm login`
- Check if the package name is already taken
- If it's your package, make sure you're the owner

### Error: "Package name already exists"
- The package name `screenshot-editor` might be taken
- Change the name in `package.json` to something unique
- Or contact the owner of the existing package

### Error: "Invalid package name"
- Package names must be lowercase
- Can contain hyphens and underscores
- Cannot contain spaces or special characters

## Package Information

- **Package Name**: `screenshot-editor`
- **Current Version**: `1.0.1`
- **Author**: Ankit Prajapati
- **License**: MIT
- **Repository**: https://github.com/eccentricengine/screenshot-editor

## Files Included in Package

Based on `package.json`, the following will be published:
- `dist/` - All built files
- `loader/` - Loader files for custom elements
- `README.md` - Documentation

Files excluded (via `.npmignore`):
- `node_modules/`
- `src/`
- `www/`
- Development files

## Next Steps After Publishing

1. **Update GitHub**: Push your code to GitHub if you haven't already
2. **Create Release**: Create a GitHub release tag matching the NPM version
3. **Share**: Share your package on social media, forums, etc.
4. **Monitor**: Watch for issues and feedback from users

