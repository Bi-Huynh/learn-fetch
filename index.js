const USER_API = "http://localhost:3000/users";
let LIST_USER = [];


// functions
function getUser(callback) {
    fetch(USER_API)
        .then(response => response.json())
        .then(data => LIST_USER = [...data])
        .then(callback)
        .catch(err => new Error(err));
}

function createUser(data = {}, callback) {
    let init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(USER_API, init)
        .then(response => response.json())
        .then(data => {
            LIST_USER.push(data);
            return LIST_USER;
        })
        .then(callback) // Đây là callback tự định nghĩa, sau khi gửi lên api thì ta sẽ nhận được lại giá trị 
        //trả về là giá trị đã gửi lên, thì callback này để sau này có sử dụng giá trị trả về này làm cái gì
        // thì làm.
        .catch(err => new Error(err));
}

function renderUser(users = []) {
    let _listUser = document.querySelector('#data');
    if (!_listUser) {
        console.log(new Error("lỗi không nhận được ul listUser"));
        return;
    }

    let html = '';
    html = users.map(user => `
    <li>${user.name}: ${user.phone}</li>
    `);
    _listUser.innerHTML = html.join('');
}

function handleCreateUser() {
    let btnCreate = document.querySelector('#create');
    if (!btnCreate) {
        console.log(new Error("lỗi không nhận được nút create"));
        return;
    }

    btnCreate.addEventListener('click', () => {
        let name = document.querySelector('input[name="name"]').value;
        let phone = document.querySelector('input[name="phone"]').value;

        if (!name) {
            console.log(new Error("lỗi không nhận được giá trị name"));
            return;
        }

        if (!phone) {
            console.log(new Error("lỗi không nhận được giá trị phone"));
            return;
        }

        let user = { name, phone };

        createUser(user, () => {
            renderUser;    // dùng để render lại danh sách hiển thị
        });;
    })
}

function start() {
    getUser(renderUser);

    handleCreateUser();
}

start();