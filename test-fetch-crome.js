// GET
{
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://localhost:4522/api/ppkinfo/version", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

// POST
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "companyId": 123456,
        "start_time": "2022-02-17T05:37:08.397Z",
        "end_time": "2022-02-17T08:37:08.397Z"
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:4522/api/ppkinfo/39", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

// GET XML
{
    let req=new XMLHttpRequest();  
    req.open("GET",'http://localhost:4522/api/ppkinfo/version',true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Access-Control-Allow-Origin', '*');   
    req.send();
    req.onload=function(){
        console.log(JSON.parse(req.responseText));    
    };
}