let socket; 
let selectedUser = null; 
const currentUser = JSON.parse(localStorage.getItem("user")); 


document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {
        window.location.href = "../login/login.html";
        return; 
    }

  
     socket = io("http://localhost:3300", {
        auth: {
            token: currentUser.token
        }
   });



    document.getElementById("currentUserName").textContent = currentUser.name;
    document.getElementById("currentUserProfilePic").src = currentUser.profilePic  
    ||'https://i.ibb.co/8tVzbYn/meritt-thomas-S3fr8-UIk3-Ek-unsplash.jpg' ;
    
    
    socket.on("connect", () => console.log("user connected")); 
    socket.on("loadUsers", (users) => display_Users_in_left_sidebar(users));// Display users in the left sidebar); 
    socket.on("load_message_history", (messages) => display_Chat_History(messages)); // Load chat history
    socket.on("newPrivateMessage", (message) => displayMessage(message)); // Display new private message
    socket.on("userOnline", ({ username }) => updateUserStatus(username, true)); // Update user status to online
    socket.on("userOffline", ({ username }) => updateUserStatus(username, false)); // Update user status to offline
    socket.on("user_search_results", (users) => { display_Users_in_left_sidebar(users)});

    document.getElementById("sendButton").addEventListener("click", () => sending_message())


// Single display_Users_in_left_sidebar function
function display_Users_in_left_sidebar(users) {
    // console.log(users)
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";
    if (!users || users.length === 0|| users.length==1 && users[0].username === currentUser.username) {
        usersList.innerHTML = `
            <div class="no-results">
                <p>No users found</p>
            </div>
        `;
        return;
    }

    //creating side card for every users...
    users.forEach((user) => {

        const userDiv = document.createElement("div");
        userDiv.className = "user-item";
        
        // Convert last_seen to a Date if it exists
        const lastSeenFormatted = user.last_seen 
            ? new Date(user.last_seen).toLocaleString("en-US", {
                month: "short", day: "numeric", //year: "numeric", 
                hour: "2-digit", minute: "2-digit", hour12: true
            }) 
            : "Recently"; // Default text

            //<strong>${user.name}</strong>
        userDiv.innerHTML = `
            <img src="${user.profilePic || 'https://www.benbushlandscapes.com/wp-content/uploads/2016/07/white-lotus.jpg'}" 
                 alt="${user.name}">
            <div>

                <div>${user.username}</div>
                <span>${lastSeenFormatted}</span>
            </div>
        `;
    
        userDiv.addEventListener("click", () => select_user_and_get_chat_History(user));
        
        // Ensure usersList exists before appending
        if (usersList) usersList.appendChild(userDiv);
    });
    
}

// Modify the debounce event listener
const userSearch = document.getElementById('userSearch')
userSearch.addEventListener("input",() => {
    const searchQuery = userSearch.value.trim();
    if (searchQuery) {

        
        socket.emit("search_user", searchQuery); 
    } else {
        // If search is empty, emit loadUsers to get all users back
        socket.emit("loadUsers");
    }
}, 2000);



function select_user_and_get_chat_History(user) {
    selectedUser = user;
    // console.log(selectedUser)
    // Update the chat header with the selected user's information
    const chatHeader = document.getElementById("chatHeader");
    chatHeader.innerHTML = `
        <img src="${user.profilePic|| 'https://www.benbushlandscapes.com/wp-content/uploads/2016/07/white-lotus.jpg'}" alt="${user.name}">
        <span>${user.username}</span>
    `;

    // Request message history from backend
    socket.emit("message_history", user.username);
}



function display_Chat_History(messages) {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    messages.forEach(data => {
        let content = data.text ? `<p>${data.text}</p>`:"" ;
        if (data.image) {
            content += `<img src="${data.image}" alt="Shared image">`;
        }
        const timestamp = new Date(data.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        content += `<p class="timestamp">${timestamp}</p>`;

        const messageElem = document.createElement("div");
        messageElem.className = `message ${data.reciver_username === currentUser.username ? 'received': 'sent'}`;
        messageElem.innerHTML = content;
        chatMessages.appendChild(messageElem);

        chatMessages.scrollTop = chatMessages.scrollHeight;//auto scrolling 

        const backButton = document.getElementById('backButton');
        backButton.style.display = "block"; // Use quotes around "block"
        
    });
};

//back_button
        // Event listener for back button
        backButton.addEventListener('click', () => {
            // Clear chat header
            document.getElementById('chatHeader').innerHTML = '';
            
            // Clear chat messages
            document.getElementById('chatMessages').innerHTML = '';
            backButton.style.display = "none";
        });





// Client Side: Sending a message when the send button is clicked
function sending_message() {
        const messageInput = document.getElementById("messageInput");
        if(!messageInput.value) {return}
        const messageData = {
            sender_username:currentUser.username,
            reciver_username: selectedUser.username,
            text: messageInput.value,
            image:messageInput.image ||''
        };
        // Emit a message to the server using a distinct event name
        socket.emit("sendPrivateMessage", messageData);
        messageInput.value = ""; // Clear the input field
    };

    //Client Side: Listening for new messages from the server
    socket.on("newPrivateMessage", (data) => {
        // Only display if the message is part of the active conversation
        if (selectedUser && (data.from === currentUser.username || data.to === selectedUser.username)) {
            displayMessage(data);
        }
    });


    // Function to display  single live  message***
    function displayMessage(data) {
        let content = data.text ? `<p>${data.text}</p>`:"" ;
        if (data.image) {
            content += `<img src="${data.image}" alt="Shared image">`;
        }
        const timestamp = new Date(data.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        content += `<p class="timestamp">${timestamp}</p>`;

        const messageElem = document.createElement("div");
        messageElem.className = `message ${data.reciver_username === currentUser.username ? 'received': 'sent'}`;
        messageElem.innerHTML = content;
        chatMessages.appendChild(messageElem);

        chatMessages.scrollTop = chatMessages.scrollHeight;//auto scrolling
    }
 

function updateUserStatus(username, isOnline) {
    // Function to update user status (online/offline)
    const userItems = document.querySelectorAll(".user-item"); // Get all user items
    userItems.forEach(item => {
        // Loop through each user item
        if (item.textContent.includes(username)) {
            // If the item contains the username
            item.classList.toggle("online", isOnline); // Toggle the online class
        }
    });
}






//sending files

const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
let selectedFiles = new Set();

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (!selectedFiles.has(file)) {
            selectedFiles.add(file);
            displayFilePreview(file);
        }
    });
});

function displayFilePreview(file) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = () => {
        selectedFiles.delete(file);
        previewItem.remove();
    };

    // Create preview content
    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        previewItem.appendChild(img);
    } else {
        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-icon';
        fileIcon.innerHTML = `<i class="fas ${getFileIcon(file.type)}"></i>`;
        previewItem.appendChild(fileIcon);
    }

    // Add file name
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    previewItem.appendChild(removeBtn);
    previewItem.appendChild(fileName);
    filePreview.appendChild(previewItem);
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType.startsWith('video/')) return 'fa-video';
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('doc')) return 'fa-file-word';
    return 'fa-file';
}

// Update your existing sending_message function to handle selected files
function sending_message() {
    const messageInput = document.getElementById("messageInput");
    if (!messageInput.value && selectedFiles.size === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('files', file);
    });

    // First upload files if any
    if (selectedFiles.size > 0) {
        fetch('http://localhost:3300/upload/upload-multiple', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Send message with file URLs
            const messageData = {
                sender_username: currentUser.username,
                reciver_username: selectedUser.username,
                text: messageInput.value,
                files: data.urls
            };
            socket.emit("sendPrivateMessage", messageData);
            
            // Clear previews and selected files
            selectedFiles.clear();
            filePreview.innerHTML = '';
            messageInput.value = '';
        })
        .catch(error => console.error('Error uploading files:', error));
    } else {
        // Send text message only
        const messageData = {
            sender_username: currentUser.username,
            reciver_username: selectedUser.username,
            text: messageInput.value
        };
        socket.emit("sendPrivateMessage", messageData);
        messageInput.value = '';
    }
}

});


