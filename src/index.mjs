import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
/**
 * A JSON object
 * @typedef { object } JSON
 */

/**
  * set the baseDir
  * @function setBaseDir
  * @param {string} newBaseDir The basedir for fetching the package (defaults to '..').
  */
let baseDir = '..';
 
export const setBaseDir = (value)=>{
    baseDir = value;
};

/**
 * This function fetches the package in a uniform way
 * @async
 * @function getPackage
 * @returns { JSON } packageData
 */
export const getPackage = async (incomingPath, allowErrors)=>{
    let thisPath;
    try{
        if(isBrowser || isJsDom){
            thisPath =  incomingPath;
            if((!thisPath) || thisPath.indexOf('/package.json') === -1){
                thisPath = incomingPath?
                    (
                        incomingPath[incomingPath.length-1] === '/'?
                            incomingPath+'package.json':
                            incomingPath+'/package.json'
                    ):
                    'package.json';
            }
            const url = `${baseDir}/${thisPath}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }else{
            thisPath =  incomingPath;
            if((!thisPath) || thisPath.indexOf('/package.json') === -1){
                thisPath = (
                    incomingPath?
                        path.join(incomingPath, 'package.json'):
                        path.join(process.cwd(), 'package.json')
                );
            }
            ensureRequire();
            if(incomingPath === '.'){
                thisPath = path.join(process.cwd(), thisPath);
            }
            return internalRequire(thisPath);
        }
    }catch(ex){
        if(allowErrors) throw new Error('Error loading package:'+incomingPath);
    }
};