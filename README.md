# Online Movie Store

Online Movie Store application using TypeScript, npm, Azure SQL (MSSQL), and React. This is a project assignment for the course of **Software Programming Foundation and Data Modelling** offered by **Institute of Applied Technology** in collaboration with **TAFE NSW** in Australia.

## 1. Features

- Easy-to-use Command Line Interface (CLI)
- CRUD Functionality
  - User authentication & authorization
    - User registration, login, and logout functionality
  - Data Manipulation and Storage
    - Add, update, delete, and view movie data.
    - Manage a watchlist for every user

## 2. Tech stack

- Programming language
  - Typescript
- Frontend frameworks
  - React.js
- Web application framework
  - Express.js
- Server-side tool
  - Node.js
- Package management
  - npm
- Database management
  - Azure SQL
- Containerization
  - Docker

## 3. ERD

<img src="image/ERD.png" width="500">

## 4. Pseudocode Flowchart

<img src="image/flowchart.png" width="500">

## 5. Instruction - Set up

### 5.1 Backend

Locate the Backend directory

- Install package
  - In terminal, type `npm i`
  - In terminal, type `npm i msnodesqlv8`
- Run the backend server
  - In terminal, type `node index`

### 5.2 Containerization & Azure SQL

\*Disclaimer: In this project, SQL Server 2022 (16.x) Linux container image was tested on MacOS and may not work on other operating systems.

- Pull the SQL Server 2022 (16.x) Linux container image from the Microsoft Container Registry.

  ```
  sudo docker pull mcr.microsoft.com/mssql/server:2022-latest
  ```

- Run the Linux container image with Docker

  ```
  sudo docker run -e "ACCEPT_EULA=Y" -e MSSQL_SA_PASSWORD=ABCdefgh@ -p 1433:1433 \
  --name sql1 --hostname sql1 -d \
  mcr.microsoft.com/mssql/server:2022-latest
  ```

- Check if Docker container works

  ```
  sudo docker ps -a
  ```

  Output should be similar to

  ```
  CONTAINER ID IMAGE                                      COMMAND                  CREATED       STATUS       PORTS                                     NAMES
  d4a1999ef83e mcr.microsoft.com/mssql/server:2022-latest "/opt/mssql/bin/perm..." 2 minutes ago Up 2 minutes 0.0.0.0:1433->1433/tcp, :::1433->1433/tcp sql1
  ```

- Start an interactive bash shell inside the running container

  ```
  sudo docker exec -it sql1 "bash"
  ```

- Inside the container, connect locally with **sqlcmd**

  ```
  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ABCdefgh@
  ```

### 5.3 Set up basic database

- Create a database called "TAFEDB", followed by `GO`

  ```
  CREATE DATABASE TAFEDB;
  ```

- Locate the TAFEDB database, followed by `GO`
  ```
  USE TAFEDB;
  ```
- Create a table 'MovieInfo' to store movie information, followed by `GO`

  ```
  CREATE TABLE MovieInfo (id INT NOT NULL IDENTITY(1,1) PRIMARY KEY, title varchar(255) NOT NULL, year INT, runtime FLOAT, rating FLOAT)
  ```

- Create a table 'UserInfo' to store user information, followed by `GO`

  ```
  CREATE TABLE UserInfo (id INT NOT NULL IDENTITY(1,1) PRIMARY KEY, username varchar(255) NOT NULL, password varchar(255) NOT NULL, admin varchar(10) NOT NULL DEFAULT 'NO')
  ```

- Insert one admin account to 'UserInfo' as an initial log-in account, followed by `GO`
  ```
  INSERT INTO UserInfo (username, password, admin) VALUES ('admin1', 'admin1', 'YES');
  ```
- Create a watchlist table for 'admin1', followed by `GO`
  ```
  CREATE TABLE admin1 (title varchar(255));
  ```

### 5.4 Frontend

Locate the Frontend directory

- Install package
  - In terminal, type `npm i`
- Run
  - In terminal, type `node index`

## 6. Instruction - CLI Interaction

### 6.1 Sign up

Click the 'Signup' option. Enter desired username followed by password. Accounts are not admin by default.

```
? Choose an option: Signup
? Enter your username: user1
? Enter your password: [hidden]
```

### 6.2 Log in

Click the 'Login' option. Enter existing username followed by password. Once logged-in, CLI is slightly different depending on whether a user is admin or not. To create a movie list later, log-in with an admin account.

```
? Choose an option: Login
? Enter your username: admin1
? Enter your password: [hidden]
```

### 6.3 Add movies (Admin only)

Once logged-in as admin, click 'Manage Movies' followed by 'Add Movies'. Enter title, year, runtime (in minutes), and rating (out of 10).

```
? What would you like to do? Manage Movies
? What would you like to do? Add    Movies
? Enter title The Matrix
? Enter release year: 1999
? Enter running time (mins): 136
? Enter rating (out of 10): 8.7

============= MESSAGE ============
Updated Movie Info!
==================================
```

### 6.4 Browse movies

If logged-in as admin, click 'Manage Movies' followed by 'Browse Movies'. If logged-in as non-admin, click 'Browse Movies'.

```
? What would you like to do? Browse Movies

=========== Movie List ==========
#1 - The Matrix
=================================
```

### 6.5 Search movies

If logged-in as admin, click 'Manage Movies' followed by 'Search Movies'. If logged-in as non-admin, click 'Search Movies'. Enter the title of movie.

```
? What would you like to do? Search Movies
? Enter Movie Name The Matrix

====== DETAILED INFORMATION =====
Title:   The Matrix
Year:    1999
Runtime: 136 mins
Rating:  8.7/10
==================================
```

### 6.6 Update movies (Admin only)

Click 'Manage Movies' followed by 'Update Movies'. If logged-in as non-admin, click 'Search Movies'. Only year, runtime, or rating can be changed; title cannot be changed.

```
? What would you like to do? Manage Movies
? What would you like to do? Update Movies
? Enter title The Matrix
? Enter release year: 2023
? Enter running time (mins): 500
? Enter rating (out of 10): 10

============= MESSAGE ============
Updated Movie Info!
==================================
```

### 6.7 Delete movies (Admin only)

Click 'Manage Movies' followed by 'Delete Movies'. Enter title, year, runningtime, and rating. If all information matches, the movie can be deleted.

```
? What would you like to do? Manage Movies
? What would you like to do? Delete Movies
? Enter title The Matrix
? Enter release year: 2023
? Enter running time (mins): 500
? Enter rating (out of 10): 10

============= MESSAGE ============
Deleted Movie Info!
==================================
```
