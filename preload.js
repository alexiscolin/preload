self.onmessage = function (e) {

  fetch(e.data, {
    method: 'GET'
  }).then(response=>{
    return response.text(); // on enregistre le load
  }).then((page)=>{

    //test into fragment
    // const template = document.createElement('template');
    // const html = page.trim(); // Never return a text node of whitespace as the result
    // template.innerHTML = html;


    // const parser = new DOMParser();
    // const parsed = parser.parseFromString(page, "text/html");
    //const medias = parsed.querySelectorAll('img, video');

    const elsReg = /<\s?(img|video)[^>]*src="([^"]*)"/gi;
    const medias = [];
    let captReg;
    while ((captReg = elsReg.exec(page)) !== null){
      medias.push(captReg[2]);
    }

    if(medias.length <= 0) return;

    done = medias.length,
    onload = function () {
      if (--done === 0) {
        self.postMessage(page);
        self.close();
      }
    };

    medias.forEach(function (url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = xhr.onerror = onload;
      xhr.open('GET', url, true);
      xhr.send();
    });

  });
}
