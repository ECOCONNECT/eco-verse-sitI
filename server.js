const express=require("express");
const multer=require("multer");
const fs=require("fs");

const app=express();
const upload=multer({dest:"uploads/"});

app.use(express.static("."));
app.use(express.json());
app.use("/uploads",express.static("uploads"));

let db="db.json";
if(!fs.existsSync(db)) fs.writeFileSync(db,"[]");

app.get("/posts",(req,res)=>{
res.sendFile(__dirname+"/"+db);
});

app.post("/post",upload.single("media"),(req,res)=>{
let data=JSON.parse(fs.readFileSync(db));

data.push({
id:Date.now(),
title:req.body.title,
desc:req.body.desc,
media:req.file?"/uploads/"+req.file.filename:null,
comments:[]
});

fs.writeFileSync(db,JSON.stringify(data,null,2));
res.sendStatus(200);
});

app.post("/comment",(req,res)=>{
let data=JSON.parse(fs.readFileSync(db));
let post=data.find(p=>p.id==req.body.id);
post.comments.push(req.body.text);
fs.writeFileSync(db,JSON.stringify(data,null,2));
res.sendStatus(200);
});

app.listen(3000,()=>console.log("Running"));