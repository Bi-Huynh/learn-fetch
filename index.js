const USER_API = "http://localhost:3000/users";
let LIST_USER = [];

// functions
function getUser(callback) {
    fetch(USER_API)
        .then(response => response.json())
        .then(result => {
            LIST_USER = [...result];
            return LIST_USER;
        })
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
        .then(resutl => {
            LIST_USER.push(resutl);
            return LIST_USER;
        })
        .then(callback)
        // Đây là callback tự định nghĩa, sau khi gửi lên api thì ta sẽ nhận được lại giá trị 
        // trả về là giá trị đã gửi lên, thì callback này để sau này có sử dụng giá trị trả về này làm cái gì
        // thì làm.
        .catch(err => new Error(err));
}

function deleteUser(id) {
    let init = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(`${USER_API}/${id}`, init)
        .then(response => response.json())
        .then(resutl => {
            LIST_USER.splice(LIST_USER.indexOf(resutl), 1);
            return LIST_USER;
        })
        .then(renderUser)
        .catch(err => new Error(err));
}

function updateUser(id, callback) {

}

function renderUser(users = []) {
    let listUser = document.querySelector('#data');
    if (!listUser) {
        console.log(new Error("lỗi không nhận được ul listUser"));
        return;
    }

    let html = '';
    html = users.map(user => `
        <li>
            <div>
                <p>ID: ${user.id}</p>
                <p>Name: ${user.name}</p>
                <p>Phone: ${user.phone}</p>
                <div id="viewUpdate"></div>
                <button onclick="deleteUser(${user.id})">Xóa</button>
                <button onclick="showViewUpdate(${user.id})">Sửa</button>
            </div>
        </li>
    `);
    listUser.innerHTML = html.join('');
}

let count = 0;
function showViewUpdate(id) {
    if (!id) {
        console.log(new Error("lỗi không nhận được giá trị id"));
        return;
    }

    let viewUpdate = document.querySelector('#viewUpdate');

    if (!viewUpdate) {
        console.log(new Error("Lỗi không tìm được viewUpdate"));
        return;
    }

    if (count === 0) {
        viewUpdate.innerHTML = `
        <input type="text" name="name" placeholder="name">
        <input type="number" name="phone" placeholder="phone">
        <button onclick="handleUpdateUser(${id})">Update</button>
        `;
        count = 1;
        return;
    }
    viewUpdate.innerHTML = ``;
    count = 0;
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

        createUser(user, renderUser);
        // ở đây page sẽ tự load lại sau khi thêm sau vì do chế độ save của vs nên nó cứ tự load loại trang
        // làm không test được
    })
}

function handleDeleteUser() {
    // làm sao để biết nút xóa nào đang nhấn.
    // let test = document.querySelector('')
}

function handleUpdateUser(id) {
    // làm sao để biết nút xóa nào đang nhấn.
    // let test = document.querySelector('')
}


function start() {
    getUser(renderUser);

    handleCreateUser();
}

start();
