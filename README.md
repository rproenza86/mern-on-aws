# Project README - TODO Web App

## Overview
This project is a MERN stack web application designed to manage TODO tasks. It is hosted on AWS and utilizes various services and technologies for a robust, scalable application.

## Features
The application supports the following features:
- Create, retrieve, update, and delete TODO tasks.
- Real-time updates and state management on the frontend.
- Secure and scalable hosting on AWS.

## Technical Details
### Frontend

#### Technologies & Libraries
- React: A JavaScript library for building user interfaces.
- Tailwind CSS: A utility-first CSS framework for rapid UI development.
- React Context API: Used for state management across the React components.

#### Key Components
- TodoList: Displays the list of TODO tasks and handles interactions.
- GlobalContext: Manages the global state of the application, including TODO tasks and loading states.

### Backend

#### Technologies & Libraries
- Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
- AWS Lambda: Event-driven, serverless computing service.
- AWS API Gateway: Fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs.

#### Lambda Functions
- CreateTodoLambda: Handles the creation of new TODO tasks.
- GetTodosLambda: Retrieves all TODO tasks.
- UpdateTodoLambda: Updates existing TODO tasks.
- DeleteTodoLambda: Deletes TODO tasks.

### Infrastructure

#### Technologies & Frameworks
- AWS CDK: Framework for defining cloud infra using familiar programming languages.
- Amazon DynamoDB: NoSQL database service that provides fast and predictable performance with seamless scalability.

#### Key Constructs
- BackendConstruct: Sets up the backend services including Lambda functions and API Gateway.
- DataBaseConstruct: Manages the DynamoDB resources.

#### Deployment
- S3 Bucket: Hosts the static files for the frontend.
- CloudFront: CDN service that securely delivers data, videos, applications, and APIs to customers globally.

### Programming Techniques
- **Infrastructure as Code (IaC)**: Using AWS CDK to define and provision AWS infrastructure.
- **Serverless Architecture**: Utilizing AWS Lambda for business logic, reducing the need for server management.
- **Continuous Integration and Deployment**: Automated build and deployment pipelines enhance the development process.

## Conclusion
This project leverages modern web technologies and AWS services to deliver a scalable and maintainable TODO web application. It demonstrates effective use of serverless architecture and IaC for efficient cloud resource management.