
window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();

    const PSURL = "http://localhost:3000/";
    const http = require("http");
    const url = require("url");
    
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);

    const toPs = document.getElementById("toPs");
    const openDoc = document.getElementById("openDoc");
    
    const server = http.createServer((req,res)=>{
        const url_parts = url.parse(req.url);
        switch(url_parts.pathname){
            case "/":
                if(req.method == "GET"){
                    res.writeHead(200,{"Content-Type":"text/plain"});
                    res.write("Illustrator server is running");
                    res.end();
                }else if(req.method == "POST"){
                    (async ()=>{
                        const received = await receivingBody(req);
                        openOnAi(received);
                        res.end();
                    })();
                }else{
                    alert("error");
                    res.end();
                }
            break;
                
            case "/save":
                if(req.method == "POST"){
                    (async ()=>{
                        const received = await receivingBody(req);
                        openAndSave(received);
                        res.end();
                    })();
                }else{
                    res.writeHead(200,{"Content-Type":"text/plain"});
                    res.end("no page.....");
                }
                break;
            
            default:
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.end("no page.....");
                break;
        }
    });
    
    function receivingBody(req){
        return new Promise(resolve=>{
            let body = "";
            req.on("data",chunk=>{
                body += chunk;
            });
            req.on("end",received=>{
                resolve(body);
            });
        });    
    }
    
    server.listen(8000);
    

    class ConnectPhotoshop{
        constructor(btn,url){
            this.btn = btn;
            this.url = url;
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const images = await this.getPlacedItem().catch(error => alert(error));
            console.log(images);
            if(!images){
                return;
            }
            const res = await fetch(this.url,{
                method:"POST",
                body:JSON.stringify(images)
            }).catch(err => alert(err));
            console.log(res);
        }
        
        getPlacedItem(){
            return new Promise((resolve,reject)=>{
                csInterface.evalScript(`$.evalFile("${extensionRoot}getPlacedImage.jsx")`,(o)=>{
                    if(o === "false"){
                        reject("the image is invalid");
                    }
                    const images = JSON.parse(o);
                    resolve(images);
                });
            });
        }
    }
    
    
    
    const ps = new ConnectPhotoshop(toPs,PSURL);
    
    openDoc.addEventListener("click",()=>{
        csInterface.evalScript(`savePDF(${JSON.stringify(["~/Desktop/sampledata/A/export_images.pdf"])})`);
    });
    
    function openOnAi(file){
        csInterface.evalScript(`justOpen(${JSON.stringify([file])})`);//string型だとjsxに送れないのでJSONで送信
    }
    
    function openAndSave(file){
        csInterface.evalScript(`savePDF(${JSON.stringify([file])})`);//string型だとjsxに送れないのでJSONで送信
    }
}
    
    