import { readFileSync, statSync } from 'fs';
import crypto from 'crypto';
import path from 'path';

//
// Created by Guilherme Deconto on 10/26/21.
// Copyright © 2021 Guilherme Deconto. All rights reserved.
//
// Dado um arquivo de video (mp4) passado por parâmetro para a aplicação,
// divida-o em partes de tamanho máximo de 1MB e calcule o hash do arquivo e imprima na tela o valor do hash H0.
// Para calcular o hash do arquivo, utiliza-se a função SHA-256 do módulo crypto.
//

function main() {
    //Get file path
    let filePath = getFilePath();
    
    //Read file
    let file = readFile(filePath);

    //Add chunks to array
    let inverse = addToChunksArray(file, filePath);
    
    //Calculate hash
    let hashes = calculateHash(inverse);

    //Print everything
    console.log("T2 Segurança de Sistemas");
    console.log("----=----=----=----=----")
    console.log("Aluno: Guilherme Dall'Agnol Deconto");
    console.log("----=----=----=----=----")
    console.log("H0 do arquivo informado é: " + hashes[0].toString('hex'));
    
}

function getFilePath(){
    // Retrieve directory path
    const __dirname = path.resolve();
    // Return path to file
    return process.argv[2] ? process.argv[2] : path.join(__dirname, "./FuncoesResumo-HashFunctions.mp4");
    //return process.argv[2] ? process.argv[2] : path.join(__dirname, "./FuncoesResumo-SHA1.mp4");
}

function getChunksQuantity(CHUNK_SIZE, filePath) {
    //Get file size
    let fileSizeInBytes = getFilesizeInBytes(filePath);
    //Return chunks quantity
    return Math.abs(fileSizeInBytes / CHUNK_SIZE);
}

function getFilesizeInBytes(filename) {
    //Get file stats
    const stats = statSync(filename);
    //Return file size in bytes using stats
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

function readFile(filePath){
    //Read file
    return readFileSync(filePath, (err, data) => {
        if (err) throw err;
    });
}

function addToChunksArray(file, filePath) {
    const CHUNK_SIZE = 1024;
    //Get chunks quantity
    let chunksQuantity = getChunksQuantity(CHUNK_SIZE, filePath);
    //Initialize variables
    var offset = 0;
    var data = [];

    //Push chunks to array
    for (var i = 0; i < chunksQuantity; i++) {
        if (offset < file.length) {
            //Push chunk to array
            data.push(file.slice(offset, offset + CHUNK_SIZE));
            //Update offset
            offset += CHUNK_SIZE;
        }
    }

    //Return reversed array
    return data.reverse();
}

function calculateHash(inverse) {
    var finalData = [];
    var count = 0;

    //Calculate hash for each chunk and append the result to the final array
    inverse.forEach(element => {
        //Create hash
        const hash = crypto.createHash('sha256');
        var calculatedHash;
        if (finalData.length == 0){
            //First chunk, calculate hash
            calculatedHash = hash.update(element).digest();
        }else{
            //Other chunks, append previous hash to the chunk
            calculatedHash = hash.update(Buffer.concat([element, finalData[count - 1]])).digest();
        }
        //Append hash to final array
        finalData.push(calculatedHash);
        count ++;
    });

    //Return reversed final array
    return finalData.reverse();
}

main();