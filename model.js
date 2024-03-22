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

function addUser(username, email, role, password, confirmPassword) {
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
        password: password,
        role: role
    };

    if(addObjecttoLocalStorage(user, "users")){
        return "User added successfully";
    }else{
        return "Error in adding the user";
    }
    //Implement the code to save the user in the database in Phase 2
}

function addProperty(name, description, photos, streetAddr, city, state, zip, country){
    //define response format
    let response = {
        result: false,
        message: ""
    };

    //Validate the user input. this also required in the backend validation
    if (name.length < 3) {
        response.message = "Name must be at least 3 characters long";
        return response;
    } else if (description.length < 6) {
        response.message = "Description must be at least 6 characters long";
        return response;
    }else if (!streetAddr.length) {
        response.message = "Street Address is required";
        return response;
    }else if (!city.length) {
        response.message = "City is required";
        return response;
    }else if (!state.length) {
        response.message = "State is required";
        return response;
    }else if (!zip.length) {
        response.message = "Zip is required";
        return response;
    }else if (!country.length) {
        response.message = "Country is required";
        return response;
    }
       
    //Get the user from the session
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user === null){
        response.message = "User not logged in";
        return response;
    }

    //form the data.
    let property = {
        id: getGUID(),
        name: name,
        description: description,
        photos: photos,
        streetAddr: streetAddr,
        city: city,
        state: state,
        zip: zip,
        country: country,
        owner: user.username
    };

    if(addObjecttoLocalStorage(property, "properties")){
        response.result = true;
        response.message = "Property added successfully";
    }else{
        response.message = "Error in adding the property";
    }
    return response;
    //Implement the code to save the property in the database in Phase 2
}

function addWorkspace(name, description, photos, size, price, propertyId){
    //define response format
    let response = {
        result: false,
        message: ""
    };

    //Validate the user input. this also required in the backend validation
    if (name.length < 3) {
        response.message = "Name must be at least 3 characters long";
        return response;
    } else if (description.length < 6) {
        response.message = "Description must be at least 6 characters long";
        return response;
    }else if (!size.length) {
        response.message = "Size is required";
        return response;
    }else if (!price.length) {
        response.message = "Price is required";
        return response;
    }
       
    //Get the user from the session
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user === null){
        response.message = "User not logged in";
        return response;
    }

    //form the data.
    let workspace = {
        id: getGUID(),
        propertyId: propertyId,
        name: name,
        description: description,
        photos: photos,
        size: size,
        price: price,
        owner: user.username
    };

    if(addObjecttoLocalStorage(workspace, "workspaces")){
        response.result = true;
        response.message = "Workspace added successfully";
    }else{
        response.message = "Error in adding the workspace";
    }
    return response;
    //Implement the code to save the workspace in the database in Phase 2


}

function loginUser(email, password) {
    //Query the local storage to get the user and validate the password
    let users = getObjectFromLocalStorage("users", {email: email, password: password});
    if(users.length === 0){
        return {"result": false, "message":"User not found"};
    }else{
        //Login Success and save the user to the session
        sessionStorage.setItem("user", JSON.stringify(users[0]));
        
        return {"result": true, "message":"Login Success"}
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


function getGUID(){
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function bookWorkspace(wid, date, time, duration){
    //define response format
    let response = {
        result: false,
        message: ""
    };

    //Validate the user input. this also required in the backend validation
    if (!date.length) {
        response.message = "Date is required";
        return response;
    }else if (!time.length) {
        response.message = "Time is required";
        return response;
    }else if (!duration.length) {
        response.message = "Duration is required";
        return response;
    }
       
    //Get the user from the session
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user === null){
        response.message = "User not logged in";
        return response;
    }

    //form the data.
    let booking = {
        id: getGUID(),
        wid: wid,
        date: date,
        time: time,
        duration: duration,
        user: user.username
    };

    if(addObjecttoLocalStorage(booking, "bookings")){
        response.result = true;
        response.message = "Workspace booked successfully";
    }else{
        response.message = "Error in booking the workspace";
    }
    return response;
    //Implement the code to save the booking in the database in Phase 2
}

function rateBooking(wid, rating, comment){
    //define response format
    let response = {
        result: false,
        message: ""
    };

    //Validate the user input. this also required in the backend validation
    if (!rating.length) {
        response.message = "Rating is required";
        return response;
    }
       
    //Get the user from the session
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user === null){
        response.message = "User not logged in";
        return response;
    }

    //form the data.
    let booking = {
        wid: wid,
        rating: rating,
        comment: comment,
        user: user.username
    };

    if(addObjecttoLocalStorage(booking, "ratings")){
        response.result = true;
        response.message = "Rating added successfully";
    }else{
        response.message = "Error in adding the rating";
    }
    return response;
    //Implement the code to save the rating in the database in Phase 2
}

function getRating(wid){
    let ratings = getObjectFromLocalStorage("ratings", {wid: wid});
    //Calculate the average rating
    let total = 0;
    ratings.forEach(function (item, index) {
        total += parseInt(item.rating);
    });
    let avgRating = total/ratings.length;
    return avgRating;
}