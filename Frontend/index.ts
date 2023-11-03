const inquirer = require('inquirer')

let currentUsername:string | null; // To store username in the global variable

interface titleData {
	title: string
}

interface userData {
	id: number,
	username: string,
	admin: string,
}

async function login() {
	const credentials = await inquirer.prompt([
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
	])

	try {
		const url = 'http://localhost:3000/login' // Adjust the URL accordingly

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		const user = await response.json()
		if (response.status === 200 && user.length !== 0) {
			// Successful login, return the response
			currentUsername = credentials.username;
			return response
		} else {
			// Invalid credentials, display an error message
			currentUsername = null;
			const msg = `
						******************** ERROR ********************
						Invalid username or password. Please try again
						***********************************************
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
			console.log(`\n${msg}\n`)
			return null // Return null to indicate login failure
		}
	} catch (error: any) {
		currentUsername = null;
		console.error('An error occurred:', error.message)
		return null // Return null to indicate login failure
	}
}

async function signup() {
	try {
		// Construct the request data
		const user = await inquirer.prompt([
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
		])

		const requestData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		}

		// Make the HTTP POST request using the fetch API
		const response = await fetch('http://localhost:3000/signup', requestData)
		.then(response => {
			// Handling error by having:
			//	1. Username and/or password not properly input
			//	2. Duplicated username
			if (response.status === 400) {
				return response.json().then(err => {
					console.log('\n*************** ERROR ****************');
					console.log(err.error);
					console.log('**************************************');
				})
			} else {
				const msg = `
						============= MESSAGE ============
						Account created successfully!
						==================================
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
				console.log('\n'+msg+'\n');
			}
		})
		return response;
	} catch (error: any) {
		console.error('An error occurred:', error.message)
	}
}

async function BrowseMovies() {
	try {
		const requestData = {
			method: 'GET'
		}
		const response = await fetch('http://localhost:3000/movies', requestData)
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
						console.log('\n'+msg+'\n');
					} else {
						console.log("\n=========== Movie List ==========")
						info.forEach((element:titleData, index:number) => {
							console.log(`#${index + 1} - ${element.title}`)
						})
						console.log("=================================\n")
					}
			})} else {
				return response.json().then(err => {
					console.log('\n*************** ERROR ****************');
					console.log(err.error);
					console.log('**************************************\n');
				});
			}
		})
	} catch (error: any) {
		console.error('An error occurred:', error.message)
	}
}

async function searchMovies() {
	const userInfo = await inquirer.prompt([
		{
			type: 'input',
			name: 'movieTitle',
			message: 'Enter Movie Name',
		},
	])
	const movieTitle = await userInfo.movieTitle
	try {
		const requestData = {
			method: 'GET'
		}

		if (movieTitle === '') {
			const msg = `
						************** ERROR **************
						Invalid title input. Try again.
						***********************************
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
			console.log('\n'+msg+'\n');
			return null
		}

		const url = `http://localhost:3000/movie/${movieTitle}` ;
		const response = await fetch(url, requestData)
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
			} else {
				return response.json().then(err => {
					console.log('\n*************** ERROR ****************');
					console.log(err.error);
					console.log('**************************************\n');
				});
			}
		})
	} catch (error: any) {
		console.error('An error occurred:', error.message)
	}
}

// Check if a user is admin
async function checkAdmin(username:string | null):Promise<boolean> {
	let isAdmin:boolean = false;
	if (username === null) {
		console.log("YOU ARE NOT ADMIN!");
		isAdmin = false;
	} else {
		const requestData = {
			method: 'GET'
		}
		const url = `http://localhost:3000/user/${username}`;
		const data = await (await fetch(url, requestData)).json();
		if (data.admin === 'YES') {
			isAdmin = true;
		}
	}
	return isAdmin;
}

// Function to add movies by admin 
async function addMovies() {
	const movieInfo = await inquirer.prompt([
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
	])
	const url = `http://localhost:3000/movieadd`;
	await fetch(url, {
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.error(err.message))
}

// Function to delete movie data by admin
async function deleteMovies() {
	const movieInfo = await inquirer.prompt([
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
	])
	const url = `http://localhost:3000/moviedelete`;
	await fetch(url, {
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
			console.log('\n'+msg+'\n');;
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to update movie data by admin
async function updateMovies() {
	const movieInfo = await inquirer.prompt([
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
	])
	const url = `http://localhost:3000/movieupdate`;
	await fetch(url, {
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to view watchlist by a user
async function viewWatchlist() {
	const url = `http://localhost:3000/viewwatchlist/${currentUsername}`;
	await fetch(url, {
		method: 'GET'
	})
	.then(response => {
		if (response.status === 200) {
			return response.json().then(info => {
				console.log("=========== Watch List ==========")
				info.forEach((element:titleData, index:number) => {
					console.log(`#${index+1} - ${element.title}`)
				})
				console.log("=================================")
			})
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to add a movie to watchlist by a user
async function addWatchlist() {
	const movieInfo = await inquirer.prompt([
		{
			type: 'input',
			name: 'movieTitle',
			message: 'Enter Movie Title',
		},
	])

	const url = `http://localhost:3000/addwatchlist/${currentUsername}`
	await fetch(url, {
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to delete a movie from watchlist by a user
async function deleteWatchlist() {
	const movieInfo = await inquirer.prompt([
		{
			type: 'input',
			name: 'movieTitle',
			message: 'Enter Movie title'
		}
	])
	const url = `http://localhost:3000/deletewatchlist/${currentUsername}`;
	await fetch(url, {
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to change password 
async function changePassword() {
	let passwordMatched:boolean = false;

	// Double-check current password
	const currentPassword = await inquirer.prompt([
		{
			type: 'password',
			name: 'currentPassword',
			message: 'Enter current password'
		}
	])
	const url = `http://localhost:3000/checkpassword/${currentUsername}`;
	await fetch(url, {
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
		} else {
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
		const newPassword = await inquirer.prompt([
			{
				type: 'password',
				name: 'newPassword',
				message: 'Enter new password'
			}
		])

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
		await fetch(url2, {
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
				console.log('\n'+msg+'\n');
			} else {
				return response.json().then(err => {
					console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
				});
			}
		})
		.catch(err => console.log(err.message));
	}
}

// Function to choose actions related to movies (only for admin)
async function manageMovies() {
	const choices = ['Browse Movies', 'Search Movies', 
						'Add    Movies', 'Delete Movies', 
						'Update Movies']
	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices,
		},
	])

	switch (action) {
		case 'Browse Movies':
			await BrowseMovies()
			break
		case 'Search Movies':
			await searchMovies();
			break
		case 'Add    Movies':
			await addMovies();
			break
		case 'Delete Movies':
			await deleteMovies();
			break
		case 'Update Movies':
			await updateMovies();
			break
	}
}	

// Function for admin to manage users
async function manageUsers() {
	const choices = ['Browse Users', 'Delete User', 'Change Authorization']
	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices,
		},
	])

	switch (action) {
		case 'Browse Users':
			await browseUsers()
			break
		case 'Delete User':
			await deleteUser();
			break
		case 'Change Authorization':
			await changeAuthorization();
			break
	}
}

// Function to browse users for admin
async function browseUsers() {
	const url = `http://localhost:3000/browseusers`;
	await fetch(url, {
		method: 'GET'
	})
	.then(response => {
		if (response.status === 200) {
			return response.json().then(info => {
				console.log('\n================== USER LIST ===============');
				info.forEach((element:userData, index:number) => {
					console.log(`#${index+1}
					- Username : ${element.username} 
					- ID       : ${element.id} 
					- Admin?   : ${element.admin}`.replace(/^[^\S\r\n]+/gm, '').trim());
				});
				console.log('============================================\n');
			});
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Function to delete user by admin
async function deleteUser() {
	const targetUser = await inquirer.prompt([
		{
			type: 'input',
			name: 'targetUser',
			message: 'Enter username to be deleted'
		}
	])

	if (!targetUser.targetUser) {
		const msg = `
						*************** ERROR ****************
						Invalid input. Try again.
						**************************************
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
		console.log('\n'+msg+'\n');
		return;
	}
	const url = `http://localhost:3000/deleteuser`;
	await fetch(url, {
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

// Change a user's authorization by admin
async function changeAuthorization() {
	const targetUser = await inquirer.prompt([
		{
			type: 'input',
			name: 'targetUser',
			message: 'Enter username to be changed'
		}
	])

	if (!targetUser.targetUser || targetUser.targetuser === currentUsername) {
		const msg = `
						*************** ERROR ****************
						Invalid input. Try again.
						**************************************
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
		console.log('\n'+msg+'\n');
		return;
	}
	
	const url = 'http://localhost:3000/authorization';
	await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type' : 'application/json',
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
			console.log('\n'+msg+'\n');
		} else {
			return response.json().then(err => {
				console.log('\n*************** ERROR ****************');
				console.log(err.error);
				console.log('**************************************\n');
			});
		}
	})
	.catch(err => console.log(err.message));
}

async function displayOptions() {
	let isAdmin:boolean|null = false;
	while (true) {
		// If user is admin
		if (await checkAdmin(currentUsername)) {
			const choices = ['Manage Movies', 'Manage Users', 
							'Change Password', 'Logout']
			const { action } = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: 'What would you like to do?',
					choices,
				},
			])
	
			switch (action) {
				case 'Manage Movies':
					await manageMovies()
					break
				case 'Manage Users':
					await manageUsers()
					break
				case 'Change Password':
					await changePassword()
					break
				case 'Logout':
					const msg = `
						============= MESSAGE ============
						Logout successful!
						==================================
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
					console.log('\n'+msg+'\n'); // Provide feedback to the user
					return // Exit the function, effectively ending the movie options
			}
		} else {
			// If user is not admin
			const choices = ['Browse Movies', 'Search Movies', 
							'View   Watchlist', 'Add    Watchlist',
							'Delete Watchlist', 'Change Password', 'Logout']
			const { action } = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: 'What would you like to do?',
					choices,
				},
			])
	
			switch (action) {
				case 'Browse Movies':
					await BrowseMovies()
					break
				case 'Search Movies':
					await searchMovies()
					break
				case 'View   Watchlist':
					await viewWatchlist()
					break
				case 'Add    Watchlist':
					await addWatchlist()
					break
				case 'Delete Watchlist':
					await deleteWatchlist()
					break
				case 'Change Password':
					await changePassword()
					break
				case 'Logout':
					const msg = `
						============= MESSAGE ============
						Logout successful!
						==================================
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
					console.log('\n'+msg+'\n'); // Provide feedback to the user
					return // Exit the function, effectively ending the movie options
			}
		}
	}
}

async function main() {
	let user = null
	console.log('\nWelcome to the Online Movie Store!\n');
	while (true) {
		if (!user) {
			const msg = `
						============= MESSAGE ============
						Please log in or sign up:
						==================================
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
			console.log('\n'+msg+'\n');
			const loginOrSignup = await inquirer.prompt([
				{
					type: 'list',
					name: 'choice',
					message: 'Choose an option:',
					choices: ['Login', 'Signup', 'Exit'],
				},
			])

			if (loginOrSignup.choice === 'Login') {
				user = await login()
			} else if (loginOrSignup.choice === 'Signup') {
				user = await signup()
			} else if (loginOrSignup.choice === 'Exit') {
				const msg = `
						============= MESSAGE ============
						Goodbye!
						==================================
						`
						.replace(/^[^\S\r\n]+/gm, '').trim();
				console.log('\n'+msg+'\n');
				process.exit(0)
			}
		} else {
			// User is logged in, display options
			await displayOptions()

			// After logging out from movie options, reset the user variable
			user = null
		}
	}
}

main()
