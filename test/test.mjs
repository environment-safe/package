/* global describe:false */
import { it } from '@open-automaton/moka';
import { chai } from 'environment-safe-chai';
import { getPackage } from '../src/index.mjs';

const semverRegex = /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/g;
const validSemver = (value='')=>{
    return  (
        value
    ).match(semverRegex) && value;
};
const should = chai.should();

describe('environment-safe-package.json', ()=>{
    describe('performs a simple test suite', ()=>{
        it('load it\'s own package.json', async ()=>{
            let pkg = null;
            let errMessage = null;
            try{
                pkg = await getPackage();
            }catch(ex){ errMessage = ex.message; }
            if(pkg){
                pkg.name.should.equal('@environment-safe/package');
                (typeof validSemver(pkg.version) === 'string').should.equal(true);
                should.exist(pkg.dependencies);
                should.exist(pkg.devDependencies);
            }else throw new Error(`could not fetch package:${errMessage}`);
            
        });
        
        it('load another package.json', async ()=>{
            let pkg = null;
            let errMessage = null;
            try{
                pkg = await getPackage('../node_modules/mocha/');
            }catch(ex){ console.log(ex); errMessage = ex.message; }
            if(pkg){
                pkg.name.should.equal('mocha');
                (typeof validSemver(pkg.version) === 'string').should.equal(true);
                should.exist(pkg.dependencies);
                should.exist(pkg.devDependencies);
            }else throw new Error(`could not fetch package:${errMessage}`);
            
        });
    });
});
