var userNameParam = undefined;
let users = "";
let timeout;
let id;
let pub_key = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDLHM2elMflhv6vysqwT34s6wd5
zDYazXVyX4YEjhwBMhG5e/WPB8FfRZRt5o4Zw2WoMbybBcr3wTX0tjGtDGvB5y/F
Ab9GKLXQTR9r+95nIYFMm3215yan9I79vXybtd8ddM1anME0VVBVcmZSap7giyAX
JGq368VZ9k4rwyIvBwIDAQAB
-----END PUBLIC KEY-----
`

function encrypt(str) {
    var crypt = new JSEncrypt();
    crypt.setKey(pub_key)
    return crypt.encrypt(str);
}

async function resetPassword() {
    let mailAddress = document.getElementById("mailForSendPasswordInput").value;
    let email = {
        email: mailAddress
    };
    $("#resetPasswordModal").modal('hide');
    $("#myModal").modal('hide');
    waitResponse();
    let x = JSON.stringify(email);
    try {
        let res = null;
        res = await fetch('/forgotPassword', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            }
        });
        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Reset password was failed");
    } catch (error) {
        alert("error");
    }
}

async function signUpUser() {
    let password = document.getElementById("passwordUserSignUp").value;
    let user = {
        userName: document.getElementById("userNameUserSignUp").value,
        password: encrypt(password),
        firstName: document.getElementById("firstNameUserSignUp").value,
        LastName: document.getElementById("lastNameUserSignUp").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressUserSignUp").value,
        city: document.getElementById("cityAddressUserSignUp").value,
        state: document.getElementById("stateAddressUserSignUp").value,
        phoneNumber: document.getElementById("phoneNumberUserSignUp").value,
        mailAddress: document.getElementById("mailAddressUserSignUp").value,
        userCategory: "customer",
        branchNumber: "null"
    };
    let x = JSON.stringify(user);
    $("#signUpModal").modal('hide');
    $("#myModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/addUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            }
        });
        if (res.status == 200) {
            await Login(user.userName, password);
        } else if (res.status == 404)
            alert("Sign up action was failed");
    } catch (error) {
        alert("error");
    }
}

async function Login(username, pass) {
    pass = encrypt(pass);
    let user = {
        username: username,
        password: pass
    };
    console.log(user);
    let x = JSON.stringify(user);
    try {
        let res = null;
        res = await fetch('/confirmLogin', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
            recievedResponse();
        if (res.status == 200) {
            $.get("nav")
                .done(function(data) {
                    $('#navigation').html(data);
                })
                .fail(function() {
                    alert("error");
                })
            $("#myModal").modal('hide');
        } else if (res.status == 404 || res.status == 401)
            alert("User name or password are not correct");
    } catch (error) {
        alert("error");
    }
}

async function confirmLogin() {
    waitResponse();
    await Login(document.getElementById("uname").value,
        document.getElementById("psw").value);
}

async function loadUserDetails(userName) {
    let user = {
        userName: userName
    };
    let x = JSON.stringify(user);
    try {
        let res = null;
        res = await fetch('/userDetails', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            }
        });
        let userDetails = await res.json();
        $(".modal-body #userNameUpdateMe").attr("value", userDetails.username);
        $(".modal-body #passwordUpdateMe").attr("value", userDetails.password);
        $(".modal-body #firstNameUpdateMe").attr("value", userDetails.name.firstName);
        $(".modal-body #lastNameUpdateMe").attr("value", userDetails.name.lastName);
        $(".modal-body #streetAndNumberAddressUpdateMe").attr("value", userDetails.address.streetAddress);
        $(".modal-body #cityAddressUpdateMe").attr("value", userDetails.address.city);
        $(".modal-body #stateAddressUpdateMe").attr("value", userDetails.address.state);
        $(".modal-body #phoneNumberUpdateMe").attr("value", userDetails.phoneNumber);
        $(".modal-body #mailAddressUpdateMe").attr("value", userDetails.mailAddress);
    } catch (error) {
        alert("error");
    }
}

async function openUpdateModal() {
    try {
        let res = null;
        res = await fetch('/userDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        let userDetails = await res.json();
        $(".modal-body #userNameUpdateMe").attr("value", userDetails.username);
        $(".modal-body #passwordUpdateMe").attr("value", userDetails.password);
        $(".modal-body #firstNameUpdateMe").attr("value", userDetails.name.firstName);
        $(".modal-body #lastNameUpdateMe").attr("value", userDetails.name.lastName);
        $(".modal-body #streetAndNumberAddressUpdateMe").attr("value", userDetails.address.streetAddress);
        $(".modal-body #cityAddressUpdateMe").attr("value", userDetails.address.city);
        $(".modal-body #stateAddressUpdateMe").attr("value", userDetails.address.state);
        $(".modal-body #phoneNumberUpdateMe").attr("value", userDetails.phoneNumber);
        $(".modal-body #mailAddressUpdateMe").attr("value", userDetails.mailAddress);
    } catch (error) {
        alert("error");
    }
    $("#updateMeModal").modal('show');
}



async function updateMe() {
    let user = {
        userName: document.getElementById("userNameUpdateMe").value,
        password: encrypt(document.getElementById("passwordUpdateMe").value),
        firstName: document.getElementById("firstNameUpdateMe").value,
        lastName: document.getElementById("lastNameUpdateMe").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressUpdateMe").value,
        city: document.getElementById("cityAddressUpdateMe").value,
        state: document.getElementById("stateAddressUpdateMe").value,
        phoneNumber: document.getElementById("phoneNumberUpdateMe").value,
        mailAddress: document.getElementById("mailAddressUpdateMe").value
    };
    let x = JSON.stringify(user);
    $("#updateMeModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/updateUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Update user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function logout() {
    await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    });
}

async function loadAbout() {
    $.get("about")
        .done(function(data) {
            $('#content').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

async function loadContact() {
    $.get("contact")
        .done(function(data) {
            $('#content').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

async function loadStore() {
    $.get("store")
        .done(function(data) {
            $('#content').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

async function loadChat() {
    $.get("chat")
        .done(function(data) {
            $('#content').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

function addToCart(numOfProducts, name, color, price, imageContentType, imageData, imageSrc) {
	var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
	var cartItemImages = cartItems.getElementsByClassName('cart-item-image')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == name && cartItemImages[i].src == imageSrc) {
            alert('This item is already added to the cart')
            return
        }
    }
	id = cartItemNames.length;
    var cartRowContents = `
        <div class="cart-item cart-column">
			<img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${name}</span>
        </div>
        <span class="cart-price cart-column">${price}$</span>
        <div class="cart-quantity cart-column">
            <input id="input${id}${name}" class="cart-quantity-input" type="number" onchange="quantityChanged('input${id}${name}', '${name}', '${imageSrc}', '${imageContentType}', '${imageData}')" value="1">
            <button id="button${id}${name}" class="btn btn-danger" type="button" onclick="removeCartItem('button${id}${name}', '${name}', '${imageSrc}', '${imageContentType}', '${imageData}')">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
	updateCartTotal();
	addProduct(name, price, imageContentType, imageData);
}

async function addProduct(name, price, imageContentType, imageData) {
	let product = {
        name: name,
        price: price,
        imageContentType: imageContentType,
        imageData: imageData,
		quantity: 1
    };
    let x = JSON.stringify(product);
	try {
        let res = null;
        res = await fetch('/addToCart', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        }, function() {});

        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Add product action was failed");
    } catch (error) {
        alert("error");
    }
}

function quantityChanged(id, name, imageSrc, imageContentType, imageData) {
	var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
	var cartItemImages = cartItems.getElementsByClassName('cart-item-image')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == name && cartItemImages[i].src == imageSrc) {
            if (isNaN(document.getElementById(id).value) || document.getElementById(id).value <= 0) {
				document.getElementById(id).value = 1;
			}	
			updateCartTotal();
			updateQuantity(name, imageContentType, imageData, document.getElementById(id).value);
            return
        }
    }
}

async function updateQuantity(name, imageContentType, imageData, quantity) {
    let product = {
        name: name,
        imageContentType: imageContentType,
        imageData: imageData,
		quantity: quantity
    };
    let x = JSON.stringify(product);
    try {
        let res = null;
        res = await fetch('/updateProductQuantity', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Update product quantity action was failed");
    } catch (error) {
        alert("error");
    }
}

async function deleteProduct(name, imageContentType, imageData) {
    let product = {
        name: name,
        imageContentType: imageContentType,
        imageData: imageData
    };
    let x = JSON.stringify(product);
    try {
        let res = null;
        res = await fetch('/deleteProduct', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Delete product action was failed");
    } catch (error) {
        alert("error");
    }
}


function removeCartItem(id, name, imageSrc, imageContentType, imageData) {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
	var cartItemImages = cartItems.getElementsByClassName('cart-item-image');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == name && cartItemImages[i].src == imageSrc) {
            document.getElementById(id).parentElement.parentElement.remove();
			updateCartTotal();
			deleteProduct(name, imageContentType, imageData);
            return;
        }
    }
}

async function emptyCart() {
    try {
        let res = null;
        res = await fetch('/emptyCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            recievedResponse();
        } else if (res.status == 404)
            alert("Delete product action was failed");
    } catch (error) {
        alert("error");
    }
}

function purchaseClicked(productsArray) {
    alert('Thank you for your purchase');
    var cartItems = document.getElementsByClassName('cart-items')[0];
	var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
	var cartItemImages = cartItems.getElementsByClassName('cart-item-image');

    emptyCart();
	while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = total + '$';
}

async function loadUsers() {
    $.get("users")
        .done(function(data) {
            $('#content').html(data);
            $('#content').ready(
                function() {
                    updateBranchNumberSelect();
                    updateBranchNumberSelectChangeStatus();
                    $(document).on("click", ".card-link", function() {
                        var userNameId = $(this).data('username-id');
                        $(".modal-body #userNameUserUpdate").attr("value", userNameId);
                        var passwordId = $(this).data('password-id');
                        $(".modal-body #passwordUserUpdate").attr("value", passwordId);
                        var firstNameId = $(this).data('first-id');
                        $(".modal-body #firstNameUserUpdate").attr("value", firstNameId);
                        var lastNameId = $(this).data('last-id');
                        $(".modal-body #lastNameUserUpdate").attr("value", lastNameId);
                        var streetId = $(this).data('street-id');
                        $(".modal-body #streetAndNumberAddressUserUpdate").attr("value", streetId);
                        var cityId = $(this).data('city-id');
                        $(".modal-body #cityAddressUserUpdate").attr("value", cityId);
                        var stateId = $(this).data('state-id');
                        $(".modal-body #stateAddressUserUpdate").attr("value", stateId);
                        var phoneId = $(this).data('phone-id');
                        $(".modal-body #phoneNumberUserUpdate").attr("value", phoneId);
                        var mailId = $(this).data('mail-id');
                        $(".modal-body #mailAddressUserUpdate").attr("value", mailId);

                        var userNameCId = $(this).data('username-id');
                        $(".modal-body #userNameCustomerUpdate").attr("value", userNameCId);
                        var passwordCId = $(this).data('password-id');
                        $(".modal-body #passwordCustomerUpdate").attr("value", passwordCId);
                        var firstNameCId = $(this).data('first-id');
                        $(".modal-body #firstNameCustomerUpdate").attr("value", firstNameCId);
                        var lastNameCId = $(this).data('last-id');
                        $(".modal-body #lastNameCustomerUpdate").attr("value", lastNameCId);
                        var streetCId = $(this).data('street-id');
                        $(".modal-body #streetAndNumberAddressCustomerUpdate").attr("value", streetCId);
                        var cityCId = $(this).data('city-id');
                        $(".modal-body #cityAddressCustomerUpdate").attr("value", cityCId);
                        var stateCId = $(this).data('state-id');
                        $(".modal-body #stateAddressCustomerUpdate").attr("value", stateCId);
                        var phoneCId = $(this).data('phone-id');
                        $(".modal-body #phoneNumberCustomerUpdate").attr("value", phoneCId);
                        var mailCId = $(this).data('mail-id');
                        $(".modal-body #mailAddressCustomerUpdate").attr("value", mailCId);
                    });
                }
            )
        })
        .fail(function() {
            alert("error");
        })
}

async function loadBranches() {
    $.get("branches")
        .done(function(data) {
            $('#content').html(data);
            $('#content').ready(
                function() {
                    updateBranchNumberSelectForBranches();
                }
            )
        })
        .fail(function() {
            alert("error");
        })
}

async function loadCatalog() {
    $.get("catalog")
        .done(function(data) {
            $('#content').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

async function onLoad() {
    if (window.location.href.includes('#')) {
        let x = window.location.href.substr(window.location.href.indexOf('#') + 1);
        switch (x) {
            case "about":
                loadAbout();
                break;
            case "catalog":
                loadCatalog();
                break;
			case "store":
				loadStore();
				break;
            case "contact":
                loadContact();
                break;
            case "users":
                loadUsers();
                break;
            case "branches":
                loadBranches();
                break;
            case "chat":
                loadChat();
                break;
            default:
                loadAbout();
                break;
        }
    } else {
        loadAbout();
    }
    loadNav();
}

async function loadNav() {
    $.get("nav")
        .done(function(data) {
            $('#navigation').html(data);
        })
        .fail(function() {
            alert("error");
        })
}

async function updateBranchNumberSelect() {
    var x = document.getElementById("branchNumberSelect");
    try {
        let response = await fetch("/branchNumbersForU");
        let branchNumbersRes = await response.json();
        branchNumbersRes.forEach(function(branchNumberRes, index) {
            var option = document.createElement("option");
            option.text = branchNumberRes;
            x.add(option);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function updateBranchNumberSelectChangeStatus() {
    var x = document.getElementById("branchNumberSelectChangeStatus");
    try {
        let response = await fetch("/branchNumbersForU");
        let branchNumbersRes = await response.json();
        branchNumbersRes.forEach(function(branchNumberRes, index) {
            var option = document.createElement("option");
            option.text = branchNumberRes;
            x.add(option);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function updateBranchNumberSelectForBranches() {
    var x = document.getElementById("branchNumberSelectForBranches");
    try {
        let response = await fetch("/branchNumbersForB");
        let branchNumbersRes = await response.json();
        let size = branchNumbersRes.length;
        if (size == 0) {
            var option = document.createElement("option");
            option.text = "1";
            x.add(option);
        }
        branchNumbersRes.forEach(function(branchNumberRes, index) {
            branchNumberRes = parseInt(branchNumberRes) + size;
            var option = document.createElement("option");
            option.text = branchNumberRes;
            x.add(option);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function showBranchNumberSelect(event) {
    let x = this.options[this.selectedIndex].text;
    switch (x) {
        case "Customer":
            $("#branchNumberSelect").hide();
            break;
        case "Worker":
            $("#branchNumberSelect").show();
            break;
        case "Manager":
            $("#branchNumberSelect").show();
            break;
        case "Supplier":
            $("#branchNumberSelect").hide();
            break;
    }
}

async function showBranchNumberSelectUpdate(event) {
    let x = this.options[this.selectedIndex].text;
    switch (x) {
        case "Customer":
            $("#branchNumberSelectUpdate").hide();
            break;
        case "Worker":
            $("#branchNumberSelectUpdate").show();
            break;
        case "Manager":
            $("#branchNumberSelectUpdate").show();
            break;
        case "Supplier":
            $("#branchNumberSelectUpdate").hide();
            break;
    }
}

async function showBranchNumberSelectChangeStatus(event) {
    let x = this.options[this.selectedIndex].text;
    switch (x) {
        case "Customer":
            $("#branchNumberSelectChangeStatus").hide();
            break;
        case "Worker":
            $("#branchNumberSelectChangeStatus").show();
            break;
        case "Manager":
            $("#branchNumberSelectChangeStatus").show();
            break;
        case "Supplier":
            $("#branchNumberSelectChangeStatus").hide();
            break;
    }
}

async function addBranch() {
    let branch = {
        street: document.getElementById("streetAddress").value,
        number: document.getElementById("numberAddress").value,
        city: document.getElementById("cityAddress").value,
        state: document.getElementById("stateAddress").value,
        branchNumber: document.getElementById("branchNumberSelectForBranches").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        active: document.getElementById("activeBranch").checked
    };
    let x = JSON.stringify(branch);
    $("#addBranchModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/addBranch', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        }, function() {});

        if (res.status == 200) {
            loadBranches();
            recievedResponse();
        } else if (res.status == 404)
            alert("Add branch action was failed");
    } catch (error) {
        alert("error");
    }
}

async function addUser() {
    var bn = "null";
    var selectorUC = document.getElementById("userCategory");
    var uc = selectorUC.options[selectorUC.selectedIndex].value;
    if (uc == "Worker" || uc == "Manager") {
        var selectorBN = document.getElementById("branchNumberSelect");
        bn = selectorBN.options[selectorBN.selectedIndex].value;
    }
    let user = {
        userName: document.getElementById("userNameUser").value,
        password: encrypt(document.getElementById("passwordUser").value),
        firstName: document.getElementById("firstNameUser").value,
        LastName: document.getElementById("lastNameUser").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressUser").value,
        city: document.getElementById("cityAddressUser").value,
        state: document.getElementById("stateAddressUser").value,
        phoneNumber: document.getElementById("phoneNumberUser").value,
        mailAddress: document.getElementById("mailAddressUser").value,
        userCategory: uc,
        branchNumber: bn
    };
    let x = JSON.stringify(user);
    $("#addUserModal").modal('hide');
    waitResponse();

    try {
        let res = null;
        res = await fetch('/addUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });

        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Add user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function addCustomer() {
    let user = {
        userName: document.getElementById("userNameCustomer").value,
        password: encrypt(document.getElementById("passwordCustomer").value),
        firstName: document.getElementById("firstNameCustomer").value,
        LastName: document.getElementById("lastNameCustomer").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressCustomer").value,
        city: document.getElementById("cityAddressCustomer").value,
        state: document.getElementById("stateAddressCustomer").value,
        phoneNumber: document.getElementById("phoneNumberCustomer").value,
        mailAddress: document.getElementById("mailAddressCustomer").value,
        userCategory: "customer",
        branchNumber: "null"
    };
    let x = JSON.stringify(user);
    $("#addCustomerModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/addUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Add user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function updateUser() {
    let user = {
        userName: document.getElementById("userNameUserUpdate").value,
        password: encrypt(document.getElementById("passwordUserUpdate").value),
        firstName: document.getElementById("firstNameUserUpdate").value,
        lastName: document.getElementById("lastNameUserUpdate").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressUserUpdate").value,
        city: document.getElementById("cityAddressUserUpdate").value,
        state: document.getElementById("stateAddressUserUpdate").value,
        phoneNumber: document.getElementById("phoneNumberUserUpdate").value,
        mailAddress: document.getElementById("mailAddressUserUpdate").value
    };
    let x = JSON.stringify(user);
    $("#updateUserModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/updateUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Update user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function deleteUser() {
    let user = {
        firstName: document.getElementById("firstNameUserUpdate").value,
        lastName: document.getElementById("lastNameUserUpdate").value
    };
    let x = JSON.stringify(user);
    $("#deleteUserModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/deleteUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Delete user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function changeStatusUser() {
    let user = {
        userName: document.getElementById("userNameUserUpdate").value,
        password: encrypt(document.getElementById("passwordUserUpdate").value),
        firstName: document.getElementById("firstNameUserUpdate").value,
        lastName: document.getElementById("lastNameUserUpdate").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressUserUpdate").value,
        city: document.getElementById("cityAddressUserUpdate").value,
        state: document.getElementById("stateAddressUserUpdate").value,
        phoneNumber: document.getElementById("phoneNumberUserUpdate").value,
        mailAddress: document.getElementById("mailAddressUserUpdate").value,
        userCategory: document.getElementById("userCategoryChangeStatus").value,
        branchNumber: document.getElementById("branchNumberSelectChangeStatus").value
    };
    let x = JSON.stringify(user);
    $("#ChangeStatusUserModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/changeStatusUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Change status user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function updateCustomer() {
    let user = {
        userName: document.getElementById("userNameCustomerUpdate").value,
        password: encrypt(document.getElementById("passwordCustomerUpdate").value),
        firstName: document.getElementById("firstNameCustomerUpdate").value,
        lastName: document.getElementById("lastNameCustomerUpdate").value,
        streetAndNumber: document.getElementById("streetAndNumberAddressCustomerUpdate").value,
        city: document.getElementById("cityAddressCustomerUpdate").value,
        state: document.getElementById("stateAddressCustomerUpdate").value,
        phoneNumber: document.getElementById("phoneNumberCustomerUpdate").value,
        mailAddress: document.getElementById("mailAddressCustomerUpdate").value
    };
    let x = JSON.stringify(user);
    $("#updateCustomerModall").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/updateUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Update user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function deleteCustomer() {
    let user = {
        firstName: document.getElementById("firstNameCustomerUpdate").value,
        lastName: document.getElementById("lastNameCustomerUpdate").value
    };
    let x = JSON.stringify(user);
    $("#deleteCustomerModal").modal('hide');
    waitResponse();
    try {
        let res = null;
        res = await fetch('/deleteUser', {
            method: 'POST',
            body: x,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (res.status == 200) {
            loadUsers();
            recievedResponse();
        } else if (res.status == 404)
            alert("Delete user action was failed");
    } catch (error) {
        alert("error");
    }
}

async function addFlower() {
    $("#addFlowerModal").modal('hide');
    waitResponse();

    var fd = new FormData($('#addFlowerForm').get(0));

    $.ajax({
            url: '/addFlower',
            data: fd,
            type: 'POST',
            processData: false,
            contentType: false,
            credentials: 'include'
        }).done(function(data) {
            recievedResponse();
            loadCatalog();
        })
        .fail(function() {
            alert("Add flower action was failed");
        })
    event.preventDefault();
}



function waitResponse() {
    $("#statusModal").modal('show');

    timeout = setTimeout(() => {
        $("#timeoutErrorModal").modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });

        clearTimeout(timeout)
    }, 5000);
}

function recievedResponse() {
    $("#statusModal").modal('hide');

    clearTimeout(timeout);
}

function fileOrUrl(value) {
    if (value == "file") {
        document.getElementById("imageFlower").disabled = false;
        document.getElementById("imageLinkFlower").disabled = true;
    } else if (value == "url") {
        document.getElementById("imageFlower").disabled = true;
        document.getElementById("imageLinkFlower").disabled = false;
    }
}
	