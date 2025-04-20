# Sequence Diagrams

This document contains sequence diagrams that illustrate the flow of key operations in the Task Manager application.

## Task Creation Flow

The following sequence diagram shows the process of creating a new task:

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant AuthMiddleware
    participant TaskController
    participant TaskModel
    participant DB as MongoDB
    
    User->>Frontend: Fill task form
    User->>Frontend: Click "Create Task"
    Frontend->>API: POST /api/tasks
    
    Note over Frontend,API: Request includes JWT token in header
    
    API->>AuthMiddleware: Verify token
    AuthMiddleware->>DB: Find user with token
    DB-->>AuthMiddleware: Return user object
    
    alt Invalid token
        AuthMiddleware-->>API: 401 Unauthorized
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Display error message
    else Valid token
        AuthMiddleware->>TaskController: Forward request with user
        TaskController->>TaskModel: Create task(req.body, owner=user._id)
        TaskModel->>DB: Save new task
        DB-->>TaskModel: Confirmation
        TaskModel-->>TaskController: Return new task object
        TaskController-->>API: 201 Created with task data
        API-->>Frontend: 201 Created with task data
        Frontend->>Frontend: Add task to list
        Frontend-->>User: Display success message
    end
```

## User Authentication Flow

The following sequence diagram shows the user login process:

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant UserController
    participant UserModel
    participant DB as MongoDB
    
    User->>Frontend: Enter email and password
    User->>Frontend: Click "Login"
    Frontend->>API: POST /api/users/login
    API->>UserController: loginUser(req, res)
    
    UserController->>UserModel: findByCredentials(email, password)
    UserModel->>DB: Find user by email
    
    alt User not found
        DB-->>UserModel: No user found
        UserModel-->>UserController: Throw error
        UserController-->>API: 401 Unauthorized
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Display error message
    else User found
        DB-->>UserModel: Return user
        UserModel->>UserModel: Compare password hash
        
        alt Invalid password
            UserModel-->>UserController: Throw error
            UserController-->>API: 401 Unauthorized
            API-->>Frontend: 401 Unauthorized
            Frontend-->>User: Display error message
        else Valid password
            UserModel->>UserModel: Generate JWT token
            UserModel->>DB: Save token to user document
            DB-->>UserModel: Confirmation
            UserModel-->>UserController: Return user and token
            UserController-->>API: 200 OK with user and token
            API-->>Frontend: 200 OK with user and token
            Frontend->>Frontend: Store token in localStorage
            Frontend->>Frontend: Update auth context
            Frontend->>Frontend: Redirect to dashboard
            Frontend-->>User: Display success message
        end
    end
```

## Task Update Flow

The following sequence diagram shows the process of updating a task:

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant AuthMiddleware
    participant TaskController
    participant TaskModel
    participant DB as MongoDB
    
    User->>Frontend: Edit task fields
    User->>Frontend: Click "Update Task"
    Frontend->>API: PATCH /api/tasks/:id
    
    Note over Frontend,API: Request includes JWT token in header
    
    API->>AuthMiddleware: Verify token
    AuthMiddleware->>DB: Find user with token
    DB-->>AuthMiddleware: Return user object
    
    AuthMiddleware->>TaskController: Forward request with user
    TaskController->>TaskModel: Find task by ID and owner
    TaskModel->>DB: Query for task
    
    alt Task not found or not owner
        DB-->>TaskModel: No task found
        TaskModel-->>TaskController: No task found
        TaskController-->>API: 404 Not Found
        API-->>Frontend: 404 Not Found
        Frontend-->>User: Display error message
    else Task found and is owner
        DB-->>TaskModel: Return task
        TaskModel->>TaskModel: Update task with new data
        TaskModel->>DB: Save updated task
        DB-->>TaskModel: Confirmation
        TaskModel-->>TaskController: Return updated task
        TaskController-->>API: 200 OK with updated task
        API-->>Frontend: 200 OK with updated task
        Frontend->>Frontend: Update task in list
        Frontend-->>User: Display success message
    end
```

These diagrams help to visualize the interaction between different components of the application and the flow of data during key operations. 