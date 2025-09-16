# Technical Test for Front-End Developer

## Overview

This technical test is designed to assess your skills and approach in improving and adding functionality to a simple
React application.

## Allowed Resources

- Use of any necessary library or framework.
- Internet access for research.

## Project Description

This project revolves around a simple todo list application, which incorporates category-based organization for todos. A
unique feature of this application is the automatic assignment of a random pastel color to each newly created category.

We have integrated the Radix UI library (https://www.radix-ui.com/) for the user interface components. This choice
alleviates the need to focus on styling and CSS, allowing you to concentrate on functionality and code quality.

Additionally, the application utilizes `json-server`, a simple yet powerful tool that enables you to set up a fake REST
API without requiring a fully featured back end server. It uses a JSON file to store data.

## Setup and Running the Project

Follow these steps to set up the project:

1. **Installing Dependencies:**

  - Execute `yarn install` to install all required libraries and dependencies.

2. **Running the Project:**
  - Run `yarn dev` to start the ViteJS development server.
  - Use `yarn server` to start the `json-server` for backend simulation.
  - Both need to run in parallel for the application to work properly.

Ensure both the development server and `json-server` are running simultaneously for full functionality.

## Part 1: Implement a Delete Function

### Overview

Implement a general delete function to allow users to delete individual todo items.

### Implementation Details

- **Delete Option per Todo Item:** Introduce a delete button or icon alongside each todo item. This provides a
  straightforward way for users to remove specific todos.
- **API Interaction:** Leverage the existing `json-server` setup to handle delete requests, ensuring the feature
  integrates seamlessly with the backend simulation.
- **User Interface:** Ensure that the delete option is intuitively accessible within the user interface.

## Part 2: Review and Refactor Code

Refactor and improve the provided code, considering some or all of the following:

- **Architecture and Design:** Code structure, organization, design patterns.
- **Clean Code:** Readability, meaningful naming, simplicity.
- **DRY Principle:** Minimizing repetitions.
- **Performance:** Optimizations for better performance.
- **Security:** Vulnerability identification and correction.
- **Testing:** Implementing tests (unit, integration, etc.)
- **Documentation:** Clear, helpful code comments.

If you do not have time to implement all the improvements you would like to, then make a note of the changes you
would make given more time, and we will discuss them on the debrief call.
