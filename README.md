# E-Wallet App

[![Maintainability](https://api.codeclimate.com/v1/badges/7bae05e0e0b1d869b619/maintainability)](https://codeclimate.com/github/supercede/e-wallet-app/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/7bae05e0e0b1d869b619/test_coverage)](https://codeclimate.com/github/supercede/e-wallet-app/test_coverage)

[![Build Status](https://travis-ci.com/supercede/e-wallet-app.svg?branch=develop)](https://travis-ci.com/supercede/e-wallet-app)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/93847dbc6e336c0047c9)

### Prerequisites

Ensure you have the following installed on your local machine:

- [NodeJS](https://nodejs.org/en/download/)
- [MySQL](https://www.mysql.com/downloads/)

## Technologies Used

- [NodeJS](https://nodejs.org/en/download/) - A cross-platform JavaScript runtime
- [ExpressJS](https://expressjs.com/) - NodeJS application framework
- [MySQL](https://www.mysql.com/downloads/) - A relational database management system
- [Sequelize ORM](https://sequelize.org/) - A promise-based Node.js ORM for relational databases
- [Heroku](https://www.heroku.com/nodejs) - A container-based cloud platform as a service for deploying applications
- [ClearDB](https://www.cleardb.com/developers/connect/paas/heroku/nodejs) - A cloud database as a service for MySQL applications

## Project Pipeline
- [Hosted API](https://e-wallet-app.herokuapp.com/)
- [API DOCS - Swagger](https://e-wallet-app.herokuapp.com/docs)
- [API DOCS - Postman](https://documenter.getpostman.com/view/9950313/T17GenG3?version=latest)

### Installing/Running locally
- Clone or fork repo

  ```bash
    - git clone https://github.com/supercede/e-wallet-app.git
    - cd e-wallet
  ```

- Create/configure `.env` environment with your credentials. A sample `.env.example` file has been provided. Make a duplicate of `.env.example` and rename to `.env`, then configure your credentials (ensure to provide the correct details). After configuring your database in accordance with the Sequelize config file (`src/config/config.js`):
    ```
        - npm install
        - npm run db:seed
    ```

- Run `npm run dev` to start the server and watch for changes

## Documentation

- Check [Swagger](https://documenter.getpostman.com/view/9950313/T17GenG3?version=latest) or [Postman](https://documenter.getpostman.com/view/9950313/T17GenG3?version=latest) documentation