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

function addUser(username, email, role, password, confirmPassword, phone) {
    let respponseMessage, result=false;
    //Validate the user input. this also required in the backend validation
    if (username.length < 3) {
        respponseMessage = "Username must be at least 3 characters long";
    } else if (email.length < 6) {
        respponseMessage = "Email must be at least 6 characters long";
    } else if (password.length < 6) {
        respponseMessage = "Password must be at least 6 characters long";
    } else if (password !== confirmPassword) {
        respponseMessage = "Passwords do not match";
    }else{
        //form the data.
        let user = {
            name: username,
            email: email,
            phone: phone, 
            password: password,
            role: role
        };
        if(callBackendApi("/users/signup", "POST", user)){
            respponseMessage = "User added successfully";
            result = true;
        }else{
            respponseMessage = "Error in adding the user";
        }
    }

    return {"result": result, "message": respponseMessage};
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
    //call the backend API to validate the user
    const token = callBackendApi("/users/login", "POST", {email: email, password: password});
    if(token){
        //Get the payload from the token
        const payload = JSON.parse(atob(token.split('.')[1]));

        //Get the information from the payload
        const user = {
            "id": payload.id,
            "username": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "role": payload.role
        };
        sessionStorage.setItem("user", JSON.stringify(user));

        //save the token in the session storage
        sessionStorage.setItem("token", token);

        return {"result": true, "message":"Login Success"}
    }else{
        return {"result": false, "message":"Login Failure"};
    }

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

function callBackendApi(path, method, data){
    console.log("Calling the backend API");
    console.log("Path: " + path);
    console.log("Method: " + method);
    console.log("Data: " + JSON.stringify(data));

    const url = "http://localhost:3000/api" + path;
    const Http = new XMLHttpRequest();
    Http.open(method, url, false);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(data));

    console.log("Response: " + Http.responseText);
    console.log("Status: " + Http.status);

    //if status is 2xx then return the response
    if(Http.status.toString().startsWith("2")){
        return Http.responseText;
    }
    return null;
}

function modelAlert(message, redirectPage){
    //create the alert element and it should have a close button to remove the alert. A listenser for ESC key to remove the alert.
    let alert = document.createElement("div");
    alert.className = "alert";
    alert.innerHTML = message;

    //Create the close button. It should be under the alert message and label should be "Close"
    let close = document.createElement("button");
    close.className = "close";
    close.innerHTML = "Close";

    //add a line break before the close button
    alert.appendChild(document.createElement("br"));
    alert.appendChild(document.createElement("br"));
    alert.appendChild(close);

    let background = document.createElement("div");
    background.className = "background";
    background.style.position = "fixed";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    background.style.zIndex = "9999";

    parent.document.body.appendChild(background);

    //The alert should be appended in the center top of the screen and the background should be darkened
    alert.style.position = "fixed";
    alert.style.top = "10%";
    alert.style.left = "50%";
    alert.style.transform = "translate(-50%, -50%)";
    alert.style.zIndex = "1000";
    alert.style.backgroundColor = "white";
    alert.style.padding = "20px";
    alert.style.border = "1px solid black";
    alert.style.borderRadius = "5px";
    alert.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    alert.style.width = "300px";
    alert.style.textAlign = "center";
    alert.style.fontFamily = "Arial, sans-serif";
    alert.style.fontSize = "16px";
    alert.style.color = "black";
    alert.style.overflow = "auto";
    alert.style.maxHeight = "300px";
    alert.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    alert.style.zIndex = "10000";
    alert.style.overflow = "auto";
    alert.style.maxHeight = "300px";
    alert.style.borderRadius = "5px";
    alert.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    parent.document.body.appendChild(alert);

    //close the alert when the close button is clicked
    alert.querySelector(".close").addEventListener("click", function(){
        alert.remove();
        background.remove();

        if(redirectPage){
            showPage(redirectPage);
        }
    });

    //close the alert when the ESC key is pressed
    document.addEventListener("keydown", function(event){
        if(event.key === "Escape"){
            alert.remove();
            background.remove();
            if(redirectPage){
                showPage(redirectPage);
            }
        }
    });
    
}