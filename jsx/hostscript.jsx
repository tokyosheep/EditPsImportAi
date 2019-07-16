
function savePDF(file){
    var fileObj = new File(file[0]);
    app.open(fileObj);
    PDF(fileObj);
    
    function PDF(path){
        var savePath = new File(path);
        var option = new PDFSaveOptions();
        option.compatibility = PDFCompatibility.ACROBAT8;//acrobat8形式で保存
        activeDocument.saveAs(savePath,option);
    }
}

function justOpen(file){
    var fileObj = new File(file[0]);
    app.open(fileObj);
}
