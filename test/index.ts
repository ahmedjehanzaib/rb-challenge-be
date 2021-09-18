
import browserify = require('browserify');
import tsify = require('tsify');
//////////////////////////////////////////////////////////////////////////////////////////////////
// test.js requirements
//////////////////////////////////////////////////////////////////////////////////////////////////
import {createWriteStream} from 'fs';
import { log } from '../src/log';

//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Build test.js file from tests.
 */
const stream = createWriteStream(`${__dirname}/../docs/tests/assets/js/tests.js`, {flags: 'w'}).on('error', function(error: Error): void {log.error(error)})
browserify()
	.add(`${__dirname}/documentation/bin.test.doc.ts`)
	.add(`${__dirname}/documentation/collection.test.doc.ts`)
	.plugin(tsify, {module: 'commonjs', forceConsistentCasingInFileNames: false, allowJs: true, lib: ['es6', 'dom'], typeRoots: ['./node_modules'], types: ['@types/mocha'], exclude: [ 'node_modules', '**/*.spec.ts'] , skipLibCheck: true})
	.bundle()
	.pipe(stream)