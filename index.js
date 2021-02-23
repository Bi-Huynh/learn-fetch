let api = "http://localhost:3000/user";

fetch(api)
    .then(response => response.json())
    .then(data => {
        let html = "";
        html = data.map(user => `<li>${user.name}</li>`);
        document.getElementById("showData").innerHTML = html.join('');
    })
    .catch(err => new Error(err));