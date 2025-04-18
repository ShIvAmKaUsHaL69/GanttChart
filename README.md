## Additional Notes

### ES Module Syntax
This project uses ES Module syntax. All JavaScript files use `import`/`export` statements rather than `require`/`module.exports`.

When adding new files to the server directory, make sure to:
1. Use the `.js` extension in import paths (e.g., `import User from './User.js'`)
2. Use `export default` or named exports instead of `module.exports`

### Custom CSS for Gantt Chart
Instead of using the built-in CSS from frappe-gantt (which causes issues in Vite), this project uses a custom CSS file located at `src/styles/gantt.css`. If you need to customize the appearance of the Gantt chart, edit this file.

### Running the Fix-Imports Script
If you encounter issues with CommonJS vs ES Modules:

```bash
node fix-imports.js
```

This script will automatically convert any remaining CommonJS syntax to ES Module syntax in the server files. 