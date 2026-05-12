const fs = require('fs');
const assert = require('assert');
const path = require('path');
const { describe, it, before, after } = require('node:test');

describe('Project Build and Sync Scripts', () => {
    
    describe('sync-version.js', () => {
        const scriptPath = 'script.js';
        const indexPath = 'index.html';
        let originalScript;
        let originalIndex;

        before(() => {
            originalScript = fs.readFileSync(scriptPath, 'utf8');
            originalIndex = fs.readFileSync(indexPath, 'utf8');
        });

        after(() => {
            fs.writeFileSync(scriptPath, originalScript);
            fs.writeFileSync(indexPath, originalIndex);
        });

        it('should update version in script.js and index.html', () => {
            // Run the sync script
            require('./sync-version.js');

            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const newScript = fs.readFileSync(scriptPath, 'utf8');
            const newIndex = fs.readFileSync(indexPath, 'utf8');

            assert.match(newScript, new RegExp(`const VERSION = '${pkg.version}'`));
            assert.match(newIndex, new RegExp(`data-version="short">${pkg.version}<`));
        });
    });

    describe('build.js', () => {
        it('should run without error', () => {
            // Note: This is a basic smoke test as build.js performs file operations
            // We ensure it executes and exits with success (0)
            const { spawnSync } = require('child_process');
            const result = spawnSync('node', ['build.js']);
            
            assert.strictEqual(result.status, 0, `Build script failed: ${result.stderr.toString()}`);
        });
    });
});
