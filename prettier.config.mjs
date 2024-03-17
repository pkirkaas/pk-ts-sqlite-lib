// Prettier configuratiom for json5

const config = {
  overrides: [
    {
      files: '*.json5',
      options: {
        parser: "json5",
        printWidth: 180,  // Wrap lines exceeding this character limit
        tabWidth: 2,     // Use 2 spaces for indentation
        singleQuote: true, // Optional: Use single quotes for strings (default: double)
        bracketSpacing: false,  // Optional: Remove spaces around object brackets
        arrayElementSpacing: false   // Elements on the same line, comma-separated
      }
    }
  ]
};


export default config;
