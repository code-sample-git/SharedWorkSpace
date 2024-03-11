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

function checkUser(email, password) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            return users[i];
        }
    }
    return null;
    //Implement the code to check the user from the database in Phase 2
}

function addObjecttoLocalStorage(object, key) {
    try{
        //save the user to the local storage
        data = JSON.parse(localStorage.getItem(key));
        if (data === null) {
            data = [];
        }
        data.push(object);
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    }catch(e){
        return false;
    }
}