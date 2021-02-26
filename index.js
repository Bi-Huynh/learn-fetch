const USER_API = "http://localhost:3000/users";
let LIST_USER = [];

function addListUser(user = {}) {
    if (user.id) {
        LIST_USER.push(user);
        return true;
    }
    return false;
}

function removeListUser(user = {}) {
    if (user.id) {
        let index = LIST_USER.indexOf(user);
        if (index !== -1) {
            LIST_USER.splice(index, 1);
            return true;
        }
    }
    return false;
}

function updateListUser(user = {}) {
    if (user.id) {
        LIST_USER.map((element) => {
            if (element.id === user.id) {
                element = { ...user };
                return true;
            }
        })
    }
    return false;
}

// functions
function getUser(callback) {

    fetch(USER_API)
        .then(response => response.json())
        .then(result => {
            LIST_USER = [...result];
            return LIST_USER;
        })
        .then(callback)
        .catch(err => new Error(`${err} - 13`));
    // làm sao để bắt lỗi nếu api bị sai, vì khi api bị sai thì lỗi không được nhảy vào catch của fetch

}

function createUser(data = {}, callback) {
    let init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(USER_API, init)
        .then(response => response.json())
        .then((data) => {
            if (!addListUser) {
                console.log(new Error('Không thể thêm user vào danh sách LIST_USER'));
            }
            return LIST_USER;
        })
        .then(callback)
        // Đây là callback tự định nghĩa, sau khi gửi lên api thì ta sẽ nhận được lại giá trị 
        // trả về là giá trị đã gửi lên, thì callback này để sau này có sử dụng giá trị trả về này làm cái gì
        // thì làm.
        .catch(err => new Error(`${err} - 33`));
}

function deleteUser(id, callback) {
    if (!id) {
        console.log(new Error("lỗi không nhận được giá trị id - 38"))
    }

    let init = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(`${USER_API}/${id}`, init)
        .then(response => response.json())
        .then((data) => {
            if (!removeListUser(data)) {
                console.log(new Error('Không thể xóa user trong danh sách LIST_USER - 86'));
            }
            return resutl;
        })
        .then(callback)
        .catch(err => new Error(`${err} - 59`));
}

function updateUser(data, callback) {
    let init = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(`${USER_API}/${data.id}`, init)
        .then(response => response.json())
        .then(resutl => {
            if (!updateListUser(resutl)) {
                console.log(new Error('Không thể update LIST_USER - 105'));
            }
            return resutl;
        })
        .then(callback)
        .catch(err => new Error(err));
}

function renderUser(users = []) {
    let listUser = document.querySelector('#data');
    if (!listUser) {
        console.log(new Error("lỗi không nhận được ul listUser - 76"));
        return;
    }

    let html = '';
    html = users.map(user => `
        <li data-type="user-${user.id}">
            <div>
                <p>ID: ${user.id}</p>
                <p>Name: ${user.name}</p>
                <p>Phone: ${user.phone}</p>
                <div id="viewUpdate-${user.id}"></div>
                <button onclick="handleDeleteUser(${user.id})">Xóa</button>
                <button onclick="showViewUpdate(${user.id})">Sửa</button>
            </div>
        </li>
    `);
    listUser.innerHTML = html.join('');
}

let count = 0;
function showViewUpdate(id) {
    if (!id) {
        console.log(new Error("lỗi không nhận được giá trị id - 99"));
        return;
    }

    let viewUpdate = document.querySelector('#viewUpdate-' + id);

    if (!viewUpdate) {
        console.log(new Error("Lỗi không tìm được viewUpdate - 106"));
        return;
    }

    if (count === 0) {
        viewUpdate.innerHTML = `
        <input id="name" type="text" name="name" placeholder="name">
        <input id="phone" type="number" name="phone" placeholder="phone">
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
        console.log(new Error("lỗi không nhận được nút create - 126"));
        return;
    }

    btnCreate.addEventListener('click', () => {
        let name = document.querySelector('input[name="name"]').value;
        let phone = document.querySelector('input[name="phone"]').value;

        if (!name) {
            console.log(new Error("lỗi không nhận được giá trị name - 135"));
            return;
        }

        if (!phone) {
            console.log(new Error("lỗi không nhận được giá trị phone - 140"));
            return;
        }

        let user = { name, phone };

        createUser(user, renderUser);
        // ở đây page sẽ tự load lại sau khi thêm sau vì do chế độ save của vs nên nó cứ tự load loại trang
        // làm không test được
    })
}

function handleDeleteUser(id) {
    // làm sao để biết nút xóa nào đang nhấn.
    // let test = document.querySelector('')

    // deleteUser(id, renderUser);
    // Thay vì render lại list user thì chỉ nên xóa dom được chọn thôi
    let user = document.querySelector(`li[data-type="user-${id}"]`);
    if (!user) {
        console.log(new Error('Không tìm được user đã được chọn để xóa'));
        return;
    }

    deleteUser(id, () => {
        user.remove();  // xóa phần tử được chọn để xóa ở trên dom
    })
}

function handleUpdateUser(id) {
    if (!id) {
        console.log(new Error('Không tồn tại id cần xóa - 211'));
        return;
    }

    let user = document.querySelector(`li[data-type="user-${id}"]`);
    if (!user) {
        console.log(new Error('Không tìm được user đã được chọn để xóa - 217'));
        return;
    }

    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;

    if (!name) {
        console.log(new Error('Không tìm được name - 220'));
        return;
    }

    if (!phone) {
        console.log(new Error('Không tìm được phone - 220'));
        return;
    }

    let obj = { id, name, phone };

    updateUser(obj, (data) => {
        user.innerHTML = `
        <li data-type="user-${data.id}">
            <div>
                <p>ID: ${data.id}</p>
                <p>Name: ${data.name}</p>
                <p>Phone: ${data.phone}</p>
                <div id="viewUpdate-${data.id}"></div>
                <button onclick="handleDeleteUser(${data.id})">Xóa</button>
                <button onclick="showViewUpdate(${data.id})">Sửa</button>
            </div>
        </li>
        `;
    })
}


function start() {
    getUser(renderUser);

    handleCreateUser();
}

start();
