# ProConnect
## Business management app
A centralized application for companies and teams where business owners can access information on their employees including access information, pay stubs and different management features. We chose this project because it is widely applicable to the business world today that can plugin to many different types of companies. This project is important because it allows business owners to save time on different company management tasks. 

## Pre-Reqs
* Docker Desktop installed and running
* Node.js installed
* Git installed

## How to run the application
1. Clone the repo locally
Run ```https://github.com/StuartGavidia/businessapp.git``` in terminal inside directory of your choice.
2. Install node modules for React development
Cd into the frontend folder. Then run ```npm install```
3. Build all of the Docker images and run the containers
At the root of the project run ```docker-compose build```.(Try again if it fails first time) After the build is complete run ```docker-compose up``` to run the containers. The API gateway routes all request to port 8080, accessing the services through the browser is outline below.

## How to access each service (For development)
* Frontend: https://localhost:8080
* User Service: htpps://localhost:8080/users

## Installing additional dependencies in React App (For development)
* Cd into frontend
* Run ```npm install {dependency}```
* Re-build and spin up docker containers again
* While the container is running, access the container terminal session in Docker Desktop and run ```npm install```
* Spin up the docker containers again

## Installing additional dependencies in Flask App (For development)
* Cd into the corresponding service (ex: UserService). Create a virtual environment if you haven't already using ```python3 -m venv venv```
* Source into the venv with ```source venv/bin/activate```
* Run ```pip install {dependency}```
* Run ```pip freeze > requirements.txt``` to move into requiremnts folder
* Re-build and spin up docker containers again