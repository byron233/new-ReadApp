const { exec } = require("child_process");
const fs = require('fs-extra')

//Esta funcion se encarga de convertir una entrada a pdf
function wordConvert(input, output){
    return new Promise(resolve =>{
        exec(`soffice --headless --convert-to pdf ${input} --outdir  ${output}`, (error, stdout, stderr) => {
            var info = {};
            info.newPath = stdout.replace("convert " + input + " -> " , "").replace(" using filter : writer_pdf_Export", "");
            if (error) {
                console.log(`error: ${error.message}`);
                return "Hubo un error" ;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            
            fs.remove(input, err=>{
                if(err){
                    throw err;
                }else{
                    resolve(info);
                    console.log('Se convirtio el documento y elimino el archivo original');
                }
                
            })
        });
    })
}

//Esta funcion crea el llamado
module.exports = async function convertCall(input, output){
    return await wordConvert(input, output);
    
}
