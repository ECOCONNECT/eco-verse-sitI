function showSection(id){
document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}

async function loadPosts(){
let res=await fetch("/posts");
let data=await res.json();

let container=document.getElementById("posts");
container.innerHTML="";

data.forEach(p=>{
let div=document.createElement("div");
div.className="post";
div.innerHTML=`
<h3>${p.title}</h3>
<p>${p.desc}</p>
${p.media?`<img src="${p.media}" width="200">`:""}
<br><input placeholder="comment..." id="c${p.id}">
<button onclick="comment(${p.id})">Comment</button>
<div>${p.comments.map(c=>"<p>💬 "+c+"</p>").join("")}</div>
`;
container.appendChild(div);
});
}

async function postReport(){
let title=document.getElementById("title").value;
let desc=document.getElementById("desc").value;
let file=document.getElementById("media").files[0];

let form=new FormData();
form.append("title",title);
form.append("desc",desc);
if(file) form.append("media",file);

await fetch("/post",{method:"POST",body:form});
loadPosts();
}

async function comment(id){
let text=document.getElementById("c"+id).value;
await fetch("/comment",{method:"POST",headers:{'Content-Type':'application/json'},
body:JSON.stringify({id,text})});
loadPosts();
}

loadPosts();