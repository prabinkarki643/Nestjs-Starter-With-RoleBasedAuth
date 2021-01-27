import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as makeDir from 'make-dir';
import * as rimraf from 'rimraf';
@Injectable()
export class FileHandlerService {

    deleteFileAtPath(pathFromRoot:string){
        fs.unlink(pathFromRoot,(err=>{
            if(err){
                console.log(`error deleting file at path ${pathFromRoot}`,err); 
            }
            
        }))
    }

    deleteDirectoryAtPath(pathFromRoot:string){
        rimraf.sync(pathFromRoot)
    }

    makeDirectoryAt(pathFromRoot:string){
        return makeDir(pathFromRoot)
    }

    listAllDirectoryInsideDirectory(directoryPath:string):Promise<string[]>{
        return new Promise((resolve,reject)=>{
       var directories = fs.readdirSync(directoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            
        resolve(directories)
        })
    } 

    listFilesForDirectory(directoryPath:string):Promise<{files:string[],path:string}>{
        return new Promise((resolve,reject)=>{
                fs.readdir(directoryPath, function (err, files) {
                    if (err) {
                        reject(err)
                    } 
                    resolve({files:files,path:directoryPath})
                });
        })
    }

    fileExistsAtPath(path:string):Promise<boolean>{
        return new Promise((resolve,reject)=>{
        fs.access(path, function(error) {
            if (error) {
            resolve(false)
            } else {
            resolve(true)
            }
        })
        })
    }

    downloadFileFromPath(pathFromRoot: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const stream = fs.createReadStream(pathFromRoot)
            resolve(stream);
        });
    }
    
}
