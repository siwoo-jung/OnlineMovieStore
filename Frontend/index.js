"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const inquirer = require('inquirer');
let currentUsername; // To store username in the global variable
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter your username:',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your password:',
            },
        ]);
        try {
            const url = 'http://localhost:3000/login'; // Adjust the URL accordingly
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const user = yield response.json();
            if (response.status === 200 && user.length !== 0) {
                // Successful login, return the response
                currentUsername = credentials.username;
                return response;
            }
            else {
                // Invalid credentials, display an error message
                currentUsername = null;
                const msg = `
						******************** ERROR ********************
						Invalid username or password. Please try again
						***********************************************
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log(`\n${msg}\n`);
                return null; // Return null to indicate login failure
            }
        }
        catch (error) {
            currentUsername = null;
            console.error('An error occurred:', error.message);
            return null; // Return null to indicate login failure
        }
    });
}
function signup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Construct the request data
            const user = yield inquirer.prompt([
                {
                    type: 'input',
                    name: 'username',
                    message: 'Enter your username:',
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'Enter your password:',
                },
            ]);
            const requestData = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            };
            // Make the HTTP POST request using the fetch API
            const response = yield fetch('http://localhost:3000/signup', requestData)
                .then(response => {
                // Handling error by having:
                //	1. Username and/or password not properly input
                //	2. Duplicated username
                if (response.status === 400) {
                    return response.json().then(err => {
                        console.log('\n*************** ERROR ****************');
                        console.log(err.error);
                        console.log('**************************************');
                    });
                }
                else {
                    const msg = `
						============= MESSAGE ============
						Account created successfully!
						==================================
						`
                        .replace(/^[^\S\r\n]+/gm, '').trim();
                    console.log('\n' + msg + '\n');
                }
            });
            return response;
        }
        catch (error) {
            console.error('An error occurred:', error.message);
        }
    });
}
function BrowseMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestData = {
                method: 'GET'
            };
            const response = yield fetch('http://localhost:3000/movies', requestData)
                .then(response => {
                if (response.status === 200) {
                    return response.json().then(info => {
                        if (info.length === 0) {
                            const msg = `
						************** ERROR **************
						There is no movie in the database
						***********************************
						`
                                .replace(/^[^\S\r\n]+/gm, '').trim();
                            console.log('\n' + msg + '\n');
                        }
                        else {
                            console.log("\n=========== Movie List ==========");
                            info.forEach((element, index) => {
                                console.log(`#${index + 1} - ${element.title}`);
                            });
                            console.log("=================================\n");
                        }
                    });
                }
                else {
                    return response.json().then(err => {
                        console.log('\n*************** ERROR ****************');
                        console.log(err.error);
                        console.log('**************************************\n');
                    });
                }
            });
        }
        catch (error) {
            console.error('An error occurred:', error.message);
        }
    });
}
function searchMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter Movie Name',
            },
        ]);
        const movieTitle = yield userInfo.movieTitle;
        try {
            const requestData = {
                method: 'GET'
            };
            if (movieTitle === '') {
                const msg = `
						************** ERROR **************
						Invalid title input. Try again.
						***********************************
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
                return null;
            }
            const url = `http://localhost:3000/movie/${movieTitle}`;
            const response = yield fetch(url, requestData)
                .then(response => {
                if (response.status === 200) {
                    return response.json().then(info => {
                        const msg = `
						====== DETAILED INFORMATION =====
						Title:   ${info.title} 
						Year:    ${info.year}
						Runtime: ${info.runtime} mins
						Rating:  ${info.rating}/10
						==================================
					`.replace(/^[^\S\r\n]+/gm, '').trim();
                        console.log(`\n${msg}\n`);
                    });
                }
                else {
                    return response.json().then(err => {
                        console.log('\n*************** ERROR ****************');
                        console.log(err.error);
                        console.log('**************************************\n');
                    });
                }
            });
        }
        catch (error) {
            console.error('An error occurred:', error.message);
        }
    });
}
// Check if a user is admin
function checkAdmin(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAdmin = false;
        if (username === null) {
            console.log("YOU ARE NOT ADMIN!");
            isAdmin = false;
        }
        else {
            const requestData = {
                method: 'GET'
            };
            const url = `http://localhost:3000/user/${username}`;
            const data = yield (yield fetch(url, requestData)).json();
            if (data.admin === 'YES') {
                isAdmin = true;
            }
        }
        return isAdmin;
    });
}
// Function to add movies by admin 
function addMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter title'
            },
            {
                type: 'input',
                name: 'movieYear',
                message: 'Enter release year:',
            },
            {
                type: 'input',
                name: 'movieRuntime',
                message: 'Enter running time (mins):',
            },
            {
                type: 'input',
                name: 'movieRating',
                message: 'Enter rating (out of 10):',
            },
        ]);
        const url = `http://localhost:3000/movieadd`;
        yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Updated Movie Info!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.error(err.message));
    });
}
// Function to delete movie data by admin
function deleteMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter title'
            },
            {
                type: 'input',
                name: 'movieYear',
                message: 'Enter release year:',
            },
            {
                type: 'input',
                name: 'movieRuntime',
                message: 'Enter running time (mins):',
            },
            {
                type: 'input',
                name: 'movieRating',
                message: 'Enter rating (out of 10):',
            },
        ]);
        const url = `http://localhost:3000/moviedelete`;
        yield fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Deleted Movie Info!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
                ;
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to update movie data by admin
function updateMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter title'
            },
            {
                type: 'input',
                name: 'movieYear',
                message: 'Enter release year:',
            },
            {
                type: 'input',
                name: 'movieRuntime',
                message: 'Enter running time (mins):',
            },
            {
                type: 'input',
                name: 'movieRating',
                message: 'Enter rating (out of 10):',
            },
        ]);
        const url = `http://localhost:3000/movieupdate`;
        yield fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Updated Movie Info!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to view watchlist by a user
function viewWatchlist() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:3000/viewwatchlist/${currentUsername}`;
        yield fetch(url, {
            method: 'GET'
        })
            .then(response => {
            if (response.status === 200) {
                return response.json().then(info => {
                    console.log("=========== Watch List ==========");
                    info.forEach((element, index) => {
                        console.log(`#${index + 1} - ${element.title}`);
                    });
                    console.log("=================================");
                });
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to add a movie to watchlist by a user
function addWatchlist() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter Movie Title',
            },
        ]);
        const url = `http://localhost:3000/addwatchlist/${currentUsername}`;
        yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Added to watchlist!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to delete a movie from watchlist by a user
function deleteWatchlist() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfo = yield inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: 'Enter Movie title'
            }
        ]);
        const url = `http://localhost:3000/deletewatchlist/${currentUsername}`;
        yield fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Movie deleted from watchlist!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to change password 
function changePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        let passwordMatched = false;
        // Double-check current password
        const currentPassword = yield inquirer.prompt([
            {
                type: 'password',
                name: 'currentPassword',
                message: 'Enter current password'
            }
        ]);
        const url = `http://localhost:3000/checkpassword/${currentUsername}`;
        yield fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentPassword),
        })
            .then(response => {
            // If password matches
            if (response.status === 200) {
                passwordMatched = true;
            }
            else {
                // If password does not match
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
        // If double-checking password is successful
        if (passwordMatched) {
            const newPassword = yield inquirer.prompt([
                {
                    type: 'password',
                    name: 'newPassword',
                    message: 'Enter new password'
                }
            ]);
            if (!newPassword.newPassword.replace(/^[^\S\r\n]+/gm, '').trim()) {
                const msg = `
						************** ERROR **************
						Password cannot be empty
						***********************************
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log(`\n${msg}\n`);
                return;
            }
            const url2 = `http://localhost:3000/changepassword/${currentUsername}`;
            yield fetch(url2, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPassword),
            })
                .then(response => {
                // If successful
                if (response.status === 200) {
                    const msg = `
						============= MESSAGE ============
						Changed Password!
						==================================
						`
                        .replace(/^[^\S\r\n]+/gm, '').trim();
                    console.log('\n' + msg + '\n');
                }
                else {
                    return response.json().then(err => {
                        console.log('\n*************** ERROR ****************');
                        console.log(err.error);
                        console.log('**************************************\n');
                    });
                }
            })
                .catch(err => console.log(err.message));
        }
    });
}
// Function to choose actions related to movies (only for admin)
function manageMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const choices = ['Browse Movies', 'Search Movies',
            'Add    Movies', 'Delete Movies',
            'Update Movies'];
        const { action } = yield inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices,
            },
        ]);
        switch (action) {
            case 'Browse Movies':
                yield BrowseMovies();
                break;
            case 'Search Movies':
                yield searchMovies();
                break;
            case 'Add    Movies':
                yield addMovies();
                break;
            case 'Delete Movies':
                yield deleteMovies();
                break;
            case 'Update Movies':
                yield updateMovies();
                break;
        }
    });
}
// Function for admin to manage users
function manageUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const choices = ['Browse Users', 'Delete User', 'Change Authorization'];
        const { action } = yield inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices,
            },
        ]);
        switch (action) {
            case 'Browse Users':
                yield browseUsers();
                break;
            case 'Delete User':
                yield deleteUser();
                break;
            case 'Change Authorization':
                yield changeAuthorization();
                break;
        }
    });
}
// Function to browse users for admin
function browseUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:3000/browseusers`;
        yield fetch(url, {
            method: 'GET'
        })
            .then(response => {
            if (response.status === 200) {
                return response.json().then(info => {
                    console.log('\n================== USER LIST ===============');
                    info.forEach((element, index) => {
                        console.log(`#${index + 1}
					- Username : ${element.username} 
					- ID       : ${element.id} 
					- Admin?   : ${element.admin}`.replace(/^[^\S\r\n]+/gm, '').trim());
                    });
                    console.log('============================================\n');
                });
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Function to delete user by admin
function deleteUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const targetUser = yield inquirer.prompt([
            {
                type: 'input',
                name: 'targetUser',
                message: 'Enter username to be deleted'
            }
        ]);
        if (!targetUser.targetUser) {
            const msg = `
						*************** ERROR ****************
						Invalid input. Try again.
						**************************************
						`
                .replace(/^[^\S\r\n]+/gm, '').trim();
            console.log('\n' + msg + '\n');
            return;
        }
        const url = `http://localhost:3000/deleteuser`;
        yield fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(targetUser),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						User Deleted!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
// Change a user's authorization by admin
function changeAuthorization() {
    return __awaiter(this, void 0, void 0, function* () {
        const targetUser = yield inquirer.prompt([
            {
                type: 'input',
                name: 'targetUser',
                message: 'Enter username to be changed'
            }
        ]);
        if (!targetUser.targetUser || targetUser.targetuser === currentUsername) {
            const msg = `
						*************** ERROR ****************
						Invalid input. Try again.
						**************************************
						`
                .replace(/^[^\S\r\n]+/gm, '').trim();
            console.log('\n' + msg + '\n');
            return;
        }
        const url = 'http://localhost:3000/authorization';
        yield fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(targetUser),
        })
            .then(response => {
            if (response.status === 200) {
                const msg = `
						============= MESSAGE ============
						Changed Authorization!
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
            }
            else {
                return response.json().then(err => {
                    console.log('\n*************** ERROR ****************');
                    console.log(err.error);
                    console.log('**************************************\n');
                });
            }
        })
            .catch(err => console.log(err.message));
    });
}
function displayOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        let isAdmin = false;
        while (true) {
            // If user is admin
            if (yield checkAdmin(currentUsername)) {
                const choices = ['Manage Movies', 'Manage Users',
                    'Change Password', 'Logout'];
                const { action } = yield inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices,
                    },
                ]);
                switch (action) {
                    case 'Manage Movies':
                        yield manageMovies();
                        break;
                    case 'Manage Users':
                        yield manageUsers();
                        break;
                    case 'Change Password':
                        yield changePassword();
                        break;
                    case 'Logout':
                        const msg = `
						============= MESSAGE ============
						Logout successful!
						==================================
						`
                            .replace(/^[^\S\r\n]+/gm, '').trim();
                        console.log('\n' + msg + '\n'); // Provide feedback to the user
                        return; // Exit the function, effectively ending the movie options
                }
            }
            else {
                // If user is not admin
                const choices = ['Browse Movies', 'Search Movies',
                    'View   Watchlist', 'Add    Watchlist',
                    'Delete Watchlist', 'Change Password', 'Logout'];
                const { action } = yield inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices,
                    },
                ]);
                switch (action) {
                    case 'Browse Movies':
                        yield BrowseMovies();
                        break;
                    case 'Search Movies':
                        yield searchMovies();
                        break;
                    case 'View   Watchlist':
                        yield viewWatchlist();
                        break;
                    case 'Add    Watchlist':
                        yield addWatchlist();
                        break;
                    case 'Delete Watchlist':
                        yield deleteWatchlist();
                        break;
                    case 'Change Password':
                        yield changePassword();
                        break;
                    case 'Logout':
                        const msg = `
						============= MESSAGE ============
						Logout successful!
						==================================
						`
                            .replace(/^[^\S\r\n]+/gm, '').trim();
                        console.log('\n' + msg + '\n'); // Provide feedback to the user
                        return; // Exit the function, effectively ending the movie options
                }
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let user = null;
        console.log('\nWelcome to the Online Movie Store!\n');
        while (true) {
            if (!user) {
                const msg = `
						============= MESSAGE ============
						Please log in or sign up:
						==================================
						`
                    .replace(/^[^\S\r\n]+/gm, '').trim();
                console.log('\n' + msg + '\n');
                const loginOrSignup = yield inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choice',
                        message: 'Choose an option:',
                        choices: ['Login', 'Signup', 'Exit'],
                    },
                ]);
                if (loginOrSignup.choice === 'Login') {
                    user = yield login();
                }
                else if (loginOrSignup.choice === 'Signup') {
                    user = yield signup();
                }
                else if (loginOrSignup.choice === 'Exit') {
                    const msg = `
						============= MESSAGE ============
						Goodbye!
						==================================
						`
                        .replace(/^[^\S\r\n]+/gm, '').trim();
                    console.log('\n' + msg + '\n');
                    process.exit(0);
                }
            }
            else {
                // User is logged in, display options
                yield displayOptions();
                // After logging out from movie options, reset the user variable
                user = null;
            }
        }
    });
}
main();
