import React from 'react';

function buildFilesystemStructure(files) {
    let filesystem = {};
    files.forEach(path => {
        let parts = path.split('/');
        let currentDir = filesystem;
        parts.forEach((part, index) => {
            if (!currentDir[part]) {
                currentDir[part] = {};
            }
            if (index === parts.length - 1) {
                currentDir[part] = "file";
            }
            currentDir = currentDir[part];
        });
    });
    return filesystem;
}

function Filesystem({ filesystem, indent = 0 }) {
    return (
        <div>
            {Object.entries(filesystem).map(([name, value]) => (
                <div key={name}>
                    <span style={{ marginLeft: indent * 20 }}>{'│ '.repeat(indent)}</span>
                    ├─ {name}
                    {typeof value === 'object' && (
                        <Filesystem filesystem={value} indent={indent + 1} />
                    )}
                </div>
            ))}
        </div>
    );
}

// Sample list of files and directories
const files = [
    "cobalt/.env",
    "cobalt/.eslintrc.json",
    "cobalt/.gitignore",
    "cobalt/README.md",
    "cobalt/components.json",
    "cobalt/next.config.js",
    "cobalt/package-lock.json",
    "cobalt/package.json",
    "cobalt/postcss.config.js",
    "cobalt/src/app/api/users/addsnippet/route.ts",
    "cobalt/src/app/api/users/askgeminiimage/route.ts",
    // Add more files here...
];

const filesystem = buildFilesystemStructure(files);

function App() {
    return (
        <div>
            <h1>Filesystem</h1>
            <Filesystem filesystem={filesystem} />
        </div>
    );
}

export default App;
