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
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const sql = require('mssql/msnodesqlv8');
const config = {
    user: 'sa',
    password: 'ABCdefgh@',
    database: 'TAFEDB',
    server: 'localhost',
    driver: 'msnodesqlv8'
};
// Run the server
app.listen(3000, () => {
    console.log('BE servering running');
});
// Store user data in the database, UserInfo
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Ensure that both username and password are provided in the request body
        if (!username || !password) {
            console.log("Invalid user info");
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        // Create a query to validate user credentials and return response
        sql.connect(config, () => {
            var validRequest = new sql.Request();
            const validQuery = `SELECT username, password FROM UserInfo WHERE username='${username}'`;
            validRequest.query(validQuery, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (rows.recordset[0]) {
                        // If both username and password match the database
                        if (rows.recordset[0].username === `${username}` &&
                            rows.recordset[0].password === `${password}`) {
                            console.log("Login Successful!");
                            res.json(rows);
                        }
                        else {
                            console.log("Invalid user info");
                            return res.status(400).json({ error: 'Invalid user info' });
                        }
                    }
                    else {
                        // If either username or password does not match
                        console.log("Invalid user info");
                        return res.status(400).json({ error: 'Invalid user info' });
                    }
                }
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}));
// Define the signup API endpoint
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check whether username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        else {
            sql.connect(config, () => {
                var request = new sql.Request();
                const query = `SELECT DISTINCT username FROM UserInfo WHERE username='${username}'`;
                request.query(query, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // If username is already taken
                        if (rows.recordset[0]) {
                            console.log('Duplicated username attempted');
                            return res.status(400).json({ error: "This username is already taken" });
                        }
                        else {
                            // Insert user information on DB
                            var userDbUpdateRequest = new sql.Request();
                            const userDbUpdateQuery = `INSERT INTO UserInfo (username, password) VALUES ('${username}', '${password}')`;
                            userDbUpdateRequest.query(userDbUpdateQuery, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("Data updated in DB");
                                }
                            });
                            // Create a watchlist table for a user
                            var userWatchlistRequest = new sql.Request();
                            const userWatchlistQuery = `CREATE TABLE ${username} (title varchar(255))`;
                            userWatchlistRequest.query(userWatchlistQuery, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("User watchlist table created");
                                }
                            });
                            res.send('done');
                        }
                    }
                });
            });
        }
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}));
// Check whether a user is admin
app.get('/user/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uesrname = req.params.username;
        sql.connect(config, () => {
            const query = `SELECT DISTINCT admin FROM UserInfo WHERE username='${uesrname}'`;
            var request = new sql.Request();
            request.query(query, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // res.status(200).json(rows.recordset[0]);
                    res.status(200).json(rows.recordset[0]);
                }
            });
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}));
// Get a movie list for BrowseMovies() from the front end
app.get('/movies', ({ req, res }) => {
    try {
        sql.connect(config, () => {
            var request = new sql.Request();
            const query = 'SELECT title FROM MovieInfo';
            request.query(query, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Browse successful');
                    res.status(200).json(rows.recordset);
                }
            });
        });
    }
    catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// Search for individual movie for searchMovies() from the front end
app.get('/movie/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieTitle = req.params.name;
        sql.connect(config, () => {
            const query = `SELECT DISTINCT title, year, runtime, rating FROM MovieInfo WHERE title='${movieTitle}'`;
            var request = new sql.Request();
            request.query(query, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (rows.recordset[0]) {
                        console.log('Movie found');
                        res.status(200).json(rows.recordset[0]);
                    }
                    else {
                        console.log('Movie not found');
                        res.status(400).json({ error: 'Movie not found!' });
                    }
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}));
// Adds movie data to the database
app.post('/movieadd', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('asdfasfadsf');
    sql.connect(config, () => {
        const movieTitle = req.body.movieTitle;
        const movieYear = req.body.movieYear;
        const movieRuntime = req.body.movieRuntime;
        const movieRating = req.body.movieRating;
        console.log(`${movieTitle}`);
        if (!movieTitle || !movieYear || !movieRuntime || !movieRating) {
            console.log("Invalid movie info");
            return res.status(400).json({ error: 'Appropriate movie info required' });
        }
        const query = `SELECT * FROM MovieInfo WHERE title='${movieTitle}' and 
                        year='${movieYear}' and runtime='${movieRuntime}' and 
                        rating='${movieRating}'`;
        var request = new sql.Request();
        request.query(query, (err, rows) => {
            if (err) {
                return res.status(500).send('Server Error');
            }
            else {
                // If movie already exists in the database
                console.log(rows.recordset[0]);
                if (rows.recordset[0]) {
                    return res.status(400).json({ error: "Movie already exists in the database" });
                }
                else {
                    const query = `INSERT INTO MovieInfo (title, year, runtime, rating) VALUES 
                                    ('${movieTitle}', ${movieYear}, ${movieRuntime}, ${movieRating})`;
                    var request = new sql.Request();
                    request.query(query, (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                            return res.status(500).json({ error: 'Server Error' });
                        }
                        else {
                            console.log("Data updated in DB");
                            return res.status(200).json(rows2);
                        }
                    });
                }
            }
        });
    });
}));
// Delete movie data from the database
app.delete('/moviedelete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const movieTitle = req.body.movieTitle;
        const movieYear = req.body.movieYear;
        const movieRuntime = req.body.movieRuntime;
        const movieRating = req.body.movieRating;
        if (!movieTitle || !movieYear || !movieRuntime || !movieRating) {
            console.log("Invalid movie info");
            return res.status(400).json({ error: 'Appropriate movie info required' });
        }
        const query = `SELECT * FROM MovieInfo WHERE title='${movieTitle}' and 
                        year='${movieYear}' and runtime='${movieRuntime}' and 
                        rating='${movieRating}'`;
        var request = new sql.Request();
        request.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                // If movie already exists in the database
                if (rows.recordset[0]) {
                    const deleteQuery = `DELETE FROM MovieInfo WHERE title='${movieTitle}' and 
                                        year='${movieYear}' and runtime='${movieRuntime}' and 
                                        rating='${movieRating}'`;
                    var deleteRequest = new sql.Request();
                    deleteRequest.query(deleteQuery, (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                            return res.status(500).json({ error: 'Server Error' });
                        }
                        else {
                            console.log("Data deleted from DB");
                            return res.status(200).json(rows2);
                        }
                    });
                }
                else {
                    // If movie does not exist in the database
                    return res.status(400).json({ error: "Movie not found in the database" });
                }
            }
        });
    });
}));
// Update movie data from the database
app.put('/movieupdate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const movieTitle = req.body.movieTitle;
        const movieYear = req.body.movieYear;
        const movieRuntime = req.body.movieRuntime;
        const movieRating = req.body.movieRating;
        if (!movieTitle || !movieYear || !movieRating || !movieRating) {
            console.log("Invalid movie info");
            return res.status(400).json({ error: 'Appropriate movie info required' });
        }
        const query = `SELECT DISTINCT title FROM MovieInfo WHERE title='${movieTitle}'`;
        var request = new sql.Request();
        request.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                // If movie already exists in the database
                if (rows.recordset[0]) {
                    const updateQuery = `UPDATE MovieInfo SET year = ${movieYear}, 
                                        runtime = ${movieRuntime}, rating = ${movieRating} 
                                        WHERE title = '${movieTitle}'`;
                    var updateRequest = new sql.Request();
                    updateRequest.query(updateQuery, (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                            return res.status(500).json({ error: 'Server Error' });
                        }
                        else {
                            console.log("Data updated from DB");
                            return res.status(200).json(rows2);
                        }
                    });
                }
                else {
                    // If movie does not exist in the database
                    return res.status(400).json({ error: "This movie does not exist in the database" });
                }
            }
        });
    });
}));
// Get a watchlist for a user
app.get('/viewwatchlist/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const username = req.params.name;
        const query = `SELECT * FROM ${username}`;
        var request = new sql.Request();
        request.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                if (rows.recordset[0]) {
                    return res.status(200).send(rows.recordset);
                }
                else {
                    return res.status(400).json({ error: "Empty watchlist" });
                }
            }
        });
    });
}));
// Add movie to watchlist by a user
app.post('/addwatchlist/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        // Check if movie exists in the movie database
        const username = req.params.name;
        const movieTitle = req.body.movieTitle;
        const searchQuery = `SELECT DISTINCT title FROM MovieInfo WHERE title='${movieTitle}'`;
        const searchRequest = new sql.Request();
        searchRequest.query(searchQuery, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                if (rows.recordset[0]) {
                    // If movie exists in the movie database
                    const searchWatchlistRequest = new sql.Request();
                    const searchWatchlistQuery = `SELECT DISTINCT title FROM ${username} WHERE title='${movieTitle}'`;
                    searchWatchlistRequest.query(searchWatchlistQuery, (err, rows) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Server Error');
                        }
                        else {
                            // If movie exists in the watchlist
                            if (rows.recordset[0]) {
                                return res.status(400).json({ error: "Movie already exists in the watchlist" });
                            }
                            else {
                                // If movie does not exist in the watchlist
                                const addRequest = new sql.Request();
                                const addQuery = `INSERT INTO ${username} (title) VALUES ('${movieTitle}')`;
                                addRequest.query(addQuery, (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send('Server Error');
                                    }
                                    else {
                                        console.log("Added to watchlist");
                                        return res.status(200).send('Added to wachlsit');
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    // If movie does not exist in the movie database
                    return res.status(400).json({ error: "Cannot add this movie to the watchlist" });
                }
            }
        });
    });
}));
// Delete movie from watchlist by a user
app.delete('/deletewatchlist/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const username = req.params.name;
        const movieTitle = req.body.movieTitle;
        // Check movie exists in the watchlist
        const searchQuery = `SELECT DISTINCT title FROM ${username} WHERE title='${movieTitle}'`;
        const searchRequest = new sql.Request();
        searchRequest.query(searchQuery, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                // If movie exists in the watchlist
                if (rows.recordset[0]) {
                    const deleteQuery = `DELETE FROM ${username} WHERE title='${movieTitle}'`;
                    const deleteRequest = new sql.Request();
                    deleteRequest.query(deleteQuery, (err, row) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Server Error');
                        }
                        else {
                            console.log("Movie deleted from watchlist!");
                            return res.status(200).send("Movie deleted from watchlist!");
                        }
                    });
                }
                else {
                    // If movie does not exist in the watchlist
                    return res.status(400).json({ error: "Movie does not exist in watchlist" });
                }
            }
        });
    });
}));
// Double confirm password
app.put('/checkpassword/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const username = req.params.name;
        const currentPassword = req.body.currentPassword;
        const searchQuery = `SELECT password FROM UserInfo WHERE username='${username}'`;
        const searchRequest = new sql.Request();
        searchRequest.query(searchQuery, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                // If password matches
                if (rows.recordset[0].password === currentPassword) {
                    console.log('Password matches');
                    return res.status(200).send('Password matches');
                }
                else {
                    // If password does not match
                    return res.status(400).json({ error: "Password does not match" });
                }
            }
        });
    });
}));
// Change password
app.put('/changepassword/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const username = req.params.name;
        const newPassword = req.body.newPassword;
        const updateQuery = `UPDATE UserInfo SET password='${newPassword}' WHERE username='${username}'`;
        const updateRequest = new sql.Request();
        updateRequest.query(updateQuery, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                console.log('Changed Password');
                return res.status(200).send('Changed Password');
            }
        });
    });
}));
// Browse user list for admin
app.get('/browseusers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const query = `SELECT id, username, admin FROM UserInfo`;
        const request = new sql.Request();
        request.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server Error');
            }
            else {
                return res.status(200).json(rows.recordset);
            }
        });
    });
}));
// Delete user by admin
app.delete('/deleteuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    sql.connect(config, () => {
        const targetUser = req.body.targetUser;
        // Check if the user exists in the database
        const checkRequest = new sql.Request();
        const checkQuery = `SELECT DISTINCT username FROM UserInfo WHERE username='${targetUser}'`;
        checkRequest.query(checkQuery, (err, rows) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send('Server Error');
            }
            else if (!rows.recordset[0]) {
                // If target user does not exist in the database
                console.log('Target user not found');
                return res.status(400).json({ error: 'User not found' });
            }
            else {
                // If target user exists in the database
                // Delete user from user database
                const deleteUserRequest = new sql.Request();
                const deleteUserQuery = `DELETE FROM UserInfo WHERE username='${targetUser}'`;
                deleteUserRequest.query(deleteUserQuery, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).send('Server Error');
                    }
                    else {
                        console.log('User Removed');
                    }
                });
                // Delete user watchlist database
                const deleteWatchlistRequest = new sql.Request();
                const deletWatchlistQuery = `DROP TABLE ${targetUser}`;
                deleteWatchlistRequest.query(deletWatchlistQuery, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).send('Server Error');
                    }
                    else {
                        console.log('User Watchlist Removed');
                        return res.status(200).send('User Removed');
                    }
                });
            }
        });
    });
}));
// Change authorization by admin
app.put('/authorization', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetUser = req.body.targetUser;
    // Check if the user exists in the database
    const checkRequest = new sql.Request();
    const checkQuery = `SELECT username, admin FROM UserInfo WHERE username='${targetUser}'`;
    checkRequest.query(checkQuery, (err, rows) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Server Error');
        }
        else if (!rows.recordset[0]) {
            // If target user does not exist in the database
            console.log('Target user not found');
            return res.status(400).json({ error: 'User not found' });
        }
        else {
            // If the target user exsists in the database
            // If the target user is admin
            let changeQuery;
            if (rows.recordset[0].admin === 'YES') {
                changeQuery = `UPDATE UserInfo SET admin='NO' WHERE username='${targetUser}'`;
            }
            else {
                // If the target user is not admin
                changeQuery = `UPDATE UserInfo SET admin='YES' WHERE username='${targetUser}'`;
            }
            const changeRequest = new sql.Request();
            changeRequest.query(changeQuery, (err, rows) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).send('Server Error');
                }
                else {
                    console.log('Changed Authorization');
                    return res.status(200).send('Changed Authorization');
                }
            });
        }
    });
}));
