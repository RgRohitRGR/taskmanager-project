# Kubernetes Task Manager Project

A full-stack application providing a REST API for managing and executing shell commands in a simulated Kubernetes environment, coupled with a modern, responsive web UI.

---

## Description

This project implements a comprehensive task management solution. The **Backend** (Java/Spring Boot) provides a secure REST API that handles task creation, retrieval, searching, and deletion, storing records in a MongoDB database. It includes a core feature for executing stored shell commands (Tasks) and recording the execution output and timing (TaskExecution). The **Frontend** (React/TypeScript/Ant Design) is a highly usable and accessible single-page application that serves as the administrative dashboard for interacting with all API endpoints, allowing users to effortlessly create tasks, run commands, and view execution history and output.

---

## Getting Started

### Dependencies

To run the full-stack application, you need the following dependencies installed on your system:

* **Java Development Kit (JDK) 17 or higher**
* **Apache Maven** (or rely on the provided `mvnw.cmd` wrapper)
* **MongoDB Server** (running locally on the default port `27017`)
* **Node.js (LTS recommended) and npm**
* **Git**

### Installing

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/RgRohitRGR/taskmanager-project.git](https://github.com/RgRohitRGR/taskmanager-project.git)
    cd taskmanager-project
    ```

2.  **Install Frontend Dependencies:**
    Navigate into the frontend directory and install Node packages.
    ```bash
    cd web-ui
    npm install
    cd ..
    ```

### Executing Program

You must run the MongoDB service, the Java backend, and the React frontend simultaneously in three separate terminals.

#### Step 1: Start the MongoDB Server

Start your MongoDB daemon (server). The command depends on your installation:

```bash
# Common command if MongoDB is in your system PATH
mongod
```

#### Start the Java Backend API (Port 8080)
Navigate to the project root and use the Maven Wrapper to run the Spring Boot application.
```bash
# Ensure you are in the main project folder
# C:\Users\Rohit\Downloads\taskmanager
./mvnw.cmd spring-boot:run
```
Wait for the logs to confirm Tomcat started on port 8080.

#### Start the React Frontend UI (Port 5173)
Navigate to the frontend directory and start the Vite development server.
```bash
cd web-ui
npm run dev
```
Wait for the logs to confirm the site is running at http://localhost:5173/.

#### Access the UI
Open your web browser and navigate to:
http://localhost:5173/


## Help
Common Problems and Issues
"Failed to fetch tasks"

Cause: The Backend API (Port 8080) isn't running, or the browser is blocking the connection due to CORS.

Solution: Ensure the Java application is running. Double-check that TaskController.java has the correct @CrossOrigin annotation (allowing access from http://localhost:5173).

MongoDB Connection Refused

Cause: The MongoDB database server isn't running and listening on port 27017.

Solution: Run the MongoDB daemon: mongod in a separate terminal window.

Push Failure (HTTP 408)

Cause: Git timed out during a large initial file upload.

Solution: This was resolved by increasing the internal buffer size using the command: git config --global http.postBuffer 52428800.

"K8s API Failure" in Output

Cause: The task command is designed to run in a Kubernetes pod, but the backend is running locally without a connected K8s cluster.

Solution: This is expected behavior. The failure message confirms that the Task Execution flow works correctly by capturing the environmental error and displaying it as command output.

## Authors

R G ROHIT
Contact: +91 9019533859, rgrrohit16@gmail.com

https://github.com/RgRohitRGR

