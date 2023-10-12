function saveExpense(event) {
    event.preventDefault();
    const token = localStorage.getItem('token')
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const userId = localStorage.getItem('userId')
    const obj = {
        amount,
        description,
        category,
        userId
    }
    axios.post("http://localhost:4500/expense/add-expense", obj, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            showExpense(response.data.addExpense);
        })
        .catch(err => console.log(err))
    event.target.reset();
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token')
    const decoded = parseJwt(token);
    document.getElementById('userName').textContent = decoded.name;
    const premium = decoded.ispremiumuser;
    if (premium) {
        document.getElementById('razor-pay').style.display = 'none';
        premiumUser()
    }
    axios.get(`http://localhost:4500/expense/get-expense?page=${page}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            for (var i = 0; i < response.data.allExpense.length; i++) {
                showExpense(response.data.allExpense[i]);
                showPagination(response.data);
            }
        })
        .catch(err => console.log(err))
})

document.getElementById("razor-pay").onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:4500/purchase/premiummembership', { headers: { "Authorization": token } })
    console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:4500/purchase/updatetranstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
                .then((res) => {
                    alert('You are a Premier User Now')
                    document.getElementById('razor-pay').style.display = 'none'
                    premiumUser()
                    localStorage.setItem('token', res.data.token)
                }).catch(err => console.log(err))
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong')
    });
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


const urlParams = new URLSearchParams(window.location.search);
const page = parseInt(urlParams.get('page')) || 1

function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.classList.add('pagination-button');
        btn2.textContent = previousPage;
        btn2.addEventListener('click', () => handlePageChange(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button');
    btn1.classList.add('pagination-button');
    btn1.textContent = currentPage;
    btn1.addEventListener('click', () => handlePageChange(currentPage))
    pagination.appendChild(btn1)
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.classList.add('pagination-button');
        btn3.textContent = nextPage;
        btn3.addEventListener('click', () => handlePageChange(nextPage))
        pagination.appendChild(btn3)
    }
}

function handlePageChange(page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    history.pushState({}, '', url);
    location.reload();
    // getExpense(page);
}

function getExpense(page) {
    const token = localStorage.getItem('token')
    axios.get(`http://localhost:4500/expense/get-expense?page=${page}`, { headers: { "Authorization": token } })
        .then(({ data: { allExpense, ...pageData } }) => {
            // con
            showExpense(allExpense);
            showPagination(pageData);
        }).catch(err => console.log(err))
}

function showExpense(obj) {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    const parentNode = document.getElementById('listofExpense');
    const childHTML = `<li id=${obj.id}> ${obj.amount}₹ - ${obj.description} - ${obj.category}
                        <button onclick=deleteExpense('${obj.id}')> Delete </button>
                        </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function deleteExpense(id) {
    axios.delete(`http://localhost:4500/expense/delete-expense/${id}`)
        .then((response) => {
            removeExpenseFromScreen(id)
        })
        .catch(err => console.log(err))
}

function removeExpenseFromScreen(id) {
    const parentNode = document.getElementById('listofExpense');
    const childNodeToBeDeleted = document.getElementById(id);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted)
    }
}

function redirectLogin() {
    window.location.href="./login.html"
}

function premiumUser() {
    premiumElem = document.getElementById('premium')
    document.getElementById('premium').style.display = 'block';
    childHTML = `<p><b>Premium Feature!</b></p>
                    <button onclick="showLeaderboard()" class="btn3">Show Leaderboard</button>
                    <button onclick="download()" class="btn3">Download File</button>
                    <button onclick="downloadUrls()" class="btn3">Show Download Urls</button>`
    premiumElem.innerHTML += childHTML
}

async function showLeaderboard() {
        const token = localStorage.getItem('token')
        const leaderboardarray = await axios.get('http://localhost:4500/premium/leaderboard', { headers: { "Authorization": token } })
        var leaderboardElem = document.getElementById('leaderboarddata')
        leaderboardElem.innerHTML = '';
        leaderboardElem.innerHTML += '<h2> Leader Board </h2>'
        leaderboardarray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li> ${userDetails.name} Total Expense - ${userDetails.totalExpenses}`
        })
}


function download() {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:4500/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 200) {
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }
        })
        .catch((err) => {
            showError(err)
        });
}

function downloadUrls() {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:4500/user/downloadurls', { headers: { "Authorization": token } })
        .then((response) => {
            const parentNode = document.getElementById('downloadUrl');
            parentNode.innerHTML = '';
            parentNode.innerHTML += '<h2> Download Urls </h2>'
            for (var i = 0; i < response.data.allUrls.length; i++) {
                showUrl(response.data.allUrls[i]);
            }
        })
        .catch(err => console.log(err))
}

function showUrl(url) {
    const parentNode = document.getElementById('downloadUrl');
    const childHTML = `<li id=${url.id}> url_id${url.id} ${url.createdAt} <a href="${url.url}"> Download </a>`;
    parentNode.innerHTML += childHTML;
}