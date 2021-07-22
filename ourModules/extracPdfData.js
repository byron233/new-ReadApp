const pdfUtils = require('pdf-to-text');

//Esta funcion crea una promesa para ejecutar la extraccion de informacion y texto de un pdf
function extractPdfp(p, options){
    return new Promise(resolve =>{
        var info = {};
        pdfUtils.info(p, (err, infor)=>{
            if (err){
                throw err;
            }else{
                info.pdfInfo = infor;
                if(options != undefined){
                    pdfUtils.pdfToText(p, options,(err, data)=> {
                        if (err){
                            throw(err);
                        }else{
                            info.data = data;
                            resolve(info);
                        }
                    });
                }else{
                    pdfUtils.pdfToText(p, (err, data)=> {
                        if (err){
                            throw(err);
                        }else{
                            info.data = data;
                            resolve(info);
                        }
                    });
                }
            }
        });
    });
}

//Esta funcion crea un llamado de espera pa la funcion que extrae el pdf
module.exports = async function extracCall(x,options){
    console.log('Llamando');
    const result = await extractPdfp(x,options);
    console.log('Se envio');
    return result;
}