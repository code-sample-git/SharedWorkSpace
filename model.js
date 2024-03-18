const showPage = (page) => {
    // Create the object element
    let obj = document.createElement('object');
    obj.type = 'text/html';
    obj.data = `view/${page}.html`;
    obj.width = '100%';
    obj.height = '1000px'; // Initial height

    // Adjust the height of the object when its content loads
    obj.onload = function () {
        // Set the height to the scrollHeight of the object's contentDocument body
        this.style.height = this.contentDocument.body.scrollHeight + 'px';
    };

    // Clear the content and append the object
    let content = parent.document.querySelector(".content");
    content.innerHTML = '';
    content.appendChild(obj);
}

function addUser(username, email, password, confirmPassword) {
    //Validate the user input. this also required in the backend validation
    if (username.length < 3) {
        return "Username must be at least 3 characters long";
    } else if (email.length < 6) {
        return "Email must be at least 6 characters long";
    } else if (password.length < 6) {
        return "Password must be at least 6 characters long";
    } else if (password !== confirmPassword) {
        return "Passwords do not match";
    }

    //form the data.
    let user = {
        username: username,
        email: email,
        password: password
    };

    if(addObjecttoLocalStorage(user, "users")){
        return "User added successfully";
    }else{
        return "Error in adding the user";
    }
    //Implement the code to save the user in the database in Phase 2
}

function addProperty(name, description, price, photos) {
    //Validate the user input. this also required in the backend validation
    if (name.length < 3) {
        return "Name must be at least 3 characters long";
    } else if (description.length < 6) {
        return "Description must be at least 6 characters long";
    } else if (price < 0) {
        return "Price must be a positive number";
    }

    //Get the user from the session
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user === null){
        return "User not logged in";
    }
    //form the data.
    let property = {
        name: name,
        description: description,
        price: price,
        photos: photos,
        owner: user.username
    };

    if(addObjecttoLocalStorage(property, "properties")){
        return "Property added successfully";
    }else{
        return "Error in adding the property";
    }
    //Implement the code to save the property in the database in Phase 2
}

function loginUser(email, password) {
    //Query the local storage to get the user and validate the password
    let users = getObjectFromLocalStorage("users", {email: email, password: password});
    if(users.length === 0){
        return "User not found";
    }else{
        //Login Success and save the user to the session
        sessionStorage.setItem("user", JSON.stringify(users[0]));
        
        return "Login successful with the user: " + users[0].username + " and email: " + users[0].email;
    }
    //Implement the code to check the user from the database in Phase 2
}

function addObjecttoLocalStorage(object, storageKey) {
    try{
        //save the user to the local storage
        var data = JSON.parse(localStorage.getItem(storageKey));
        if (data === null) {
            data = [];
        }
        data.push(object);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    }catch(e){
        return false;
    }
}

function getObjectFromLocalStorage(storageKey, objectKeysJson) {
    var data = JSON.parse(localStorage.getItem(storageKey));
    if (data === null) {
        return [];
    }
    //Find the objects that has all the keys and values in the objectKeysJson
    
    var resultset = [];
    data.forEach(function (item, index) {
        var found = true;
        objectKeysLoop:
        for (var key in objectKeysJson) {
            if (item[key] !== objectKeysJson[key]) {
                found = false;
                break objectKeysLoop;
            }
        }
        if (found) {
            resultset.push(item);
        }
    });

    return resultset;
}



