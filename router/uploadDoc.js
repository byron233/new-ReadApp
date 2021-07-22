const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const convertToPdf = require('../ourModules/myConvert');
const extractPdf = require('../ourModules/extracPdfData'); 

//configuraciones de multer
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../uploads'));
        console.log('Se subio el archivo')
    },
    filename: (req, file, cb) =>{
        //cb(null,  Date.now() + '-' + file.originalname)
        cb(null,  Date.now() + '-' + 'Document' + path.extname(file.originalname))
    }
});
var upload = multer({
    storage,
    dest: path.join(__dirname, '/uploads'),
    fileFilter: (req, file, cb)=>{
        const fileTypes = /.pdf|.doc|.docx/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }else{
            //Error
            cb('Error: Archivo no soportado');
        }

    }
}).single('docIn');

//Ruta de docs
router.post('/upload', upload, async(req, res)=>{
    var errors;
    var pdfPath = req.file.path;
    var name = req.file.originalname;
    var extencion = path.extname(req.file.filename);
    var fileName = req.file.filename;
    var info = {}; 
    if(extencion == ".doc" || extencion == ".docx"){
        //Es archivo word
        var convertInfo = await convertToPdf(pdfPath, path.join(__dirname, '../uploads'));
        //console.log(newPath.trim());
        info = await extractPdf(convertInfo.newPath.trim(),undefined);
        if(fileName.substr(fileName.length -5) == ".docx"){
            fileName = fileName.replace('.docx', '.pdf')
        }else{
            fileName = fileName.replace('.doc', '.pdf')
        }
        info.fileName = fileName;
    }else if(extencion == ".pdf"){
         //Proceso de pdf
        info = await extractPdf(pdfPath.trim() , undefined);
        info.fileName = fileName;
    }else{
        //Archivo no soportado
        info.error = "Archivo no reconocido";
    }
   
    //Sirviendo
    info.nameTitle = name;
    res.json(info);
});

//Ruta para elegir las paginas
router.post('/pages/:desde/:hasta/:name', async(req, res)=>{
    var info = {};
    var  {hasta, desde, name} = req.params;
    var options = {from: desde, to: hasta};
    var pdfPath = path.join(__dirname, `../uploads/${name}`);
    
    info = await extractPdf(pdfPath.trim(),options);

    //Sirviendo
    res.json(info);
})

//Ruta para eliminar el libro
router.delete('/:name', (req, res)=>{
    var {name} = req.params;
    var pdfPath = path.join(__dirname, `../uploads/${name}`);
    fs.remove(pdfPath, err=>{
        if(err) throw err;
        res.json({msg:'Se elimino el archivo'})
    })
})

module.exports = router;