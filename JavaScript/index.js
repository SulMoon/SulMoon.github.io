// var filepath = "/datas/md/file.md";
// var fullPath = location.origin + filepath;
// var rawFile = new XMLHttpRequest();
// rawFile.open("GET", fullPath, false);
// rawFile.onreadystatechange = function () {
//     if (rawFile.readyState === 4) {
//         if (rawFile.status === 200 || rawFile.status == 0) {
//             var allText = rawFile.responseText;
//             console.log(allText);
//             document.getElementById("markdown").innerHTML = marked(allText);
//             // document.getElementById("markdown").innerHTML = marked.parse(rawtext);
//         }
//     }
// }

fetch('./datas/md/file.md')
.then(res => res.text())
.then(md => { 
    const html = marked.parse(md); 
    console.log(html);
    document.getElementById('markdown-content').innerHTML = html; 
    hljs.highlightAll();
});