
//LECTOR DE IMÁGENES Y VIDEOS

//about fileReader: https://es.javascript.info/file

const dropArea= document.querySelector(".drop-area");
const message= dropArea.querySelector(".message");
const or= dropArea.querySelector(".or");
const button= dropArea.querySelector("button");
const inputFile= dropArea.querySelector("#input-file");
const loadBar= document.querySelector(".loading");
const previewArea= document.querySelector(".preview");

dropArea.addEventListener("dragenter", e=>{
  e.preventDefault();
  dropArea.classList.add("area-dragover");
  or.removeAttribute("hidden");
  loadBar.setAttribute("hidden", true);
});

dropArea.addEventListener("dragover", e=>{
  e.preventDefault();
  message.textContent= "Drop your files here";
});

dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("area-dragover");
  message.textContent= "Drag and drop your image or video file";
});

button.addEventListener("click", ()=> inputFile.click());
//al usar el .click() en inputFile.click() mando a llamar inputFile al dar click al botón

inputFile.addEventListener("change",()=>checkFiles(inputFile.files));
//Recuerde que el argumento de entrada cuando se ejecuta la función loadFile es inputFile.files[0])
//porque es el archivo "que ha recibido" el input, diferente a como se recibe con drag and drop

dropArea.addEventListener("drop", e=>{
  e.preventDefault();
  dropArea.classList.remove("area-dragover");
  checkFiles(e.dataTransfer.files);  
  //Invocamos la función checkFiles con argumento de entrada el archivo recibido, que se puede tomar
  //mediante la propiedad dataTransfer del evento (e)
});

function checkFiles(files){
  //Ejecuto primero la función checkFiles, que verificará si la extensión es corecta y
  //recorrerá para cada archivo los eventos para cargarlos en la página

  for(file of files){

    let filenType= file.type; //Obtenemos la extensión del archivo
    const imgValidExtensions= ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const videoValidExtensions= ["video/mp4", "video/webm", "video/ogg"];

    if(imgValidExtensions.includes(filenType)){ //! ARCHIVOS DE IMAGEN
      //Verificamos si la extensión del archivo se encuentra entre las listadas en el arreglo,
      //Si es true, continúa con el código, sino se va al else

      let reader= new FileReader();
      reader.readAsDataURL(file);

      reader.onload= ()=>{
        let img= document.createElement("img");
        img.setAttribute("src", reader.result);
        //El resultado de reader.result es el mismo de e.currentTarget.result
        previewArea.appendChild(img);
        message.textContent= "File loaded succesfully";
        or.setAttribute("hidden", true);
      }
      //Si quire colocar una url dinámica, trabajar con file, no con reader.result

    }

    else if(videoValidExtensions.includes(filenType)){ //! ARCHIVOS DE VIDEO
      //Verificamos si la extensión del archivo se encuentra entre las listadas en el arreglo,
      //Si es true, continúa con el código, sino se va al else

      let reader= new FileReader();
      reader.readAsArrayBuffer(file);

      reader.addEventListener("progress", e=>{ //Para colocarle el % de carga en el contenedor "loading"
        let load= Math.round(e.loaded / file.size *100);
        //Con esto obtengo el % de carga dinámico
        loadBar.removeAttribute("hidden");
        loadBar.textContent= `Loading... ${load}%`;
        loadBar.style.width= load+"px";
      })

      reader.onload= ()=>{
        let video= new Blob([new Uint8Array(reader.result)],{filenType});
        let url= URL.createObjectURL(video);
        let videoFile= document.createElement("video");
        videoFile.setAttribute("src", url);
        videoFile.setAttribute("controls", true);
        previewArea.appendChild(videoFile);
        //Si quiero que el video se ejecute automático al cargar: videoFile.play(); 
        message.textContent= "File loaded succesfully";
        or.setAttribute("hidden", true);
      }

    }
    
    else alert("Invalid file extension, please try again");

    
  }
}