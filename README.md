# projeto21-SingMeASong
<p align="center">
  <img  src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg">
</p>
<h1 align="center">
  SingMeASong
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Prisma-316192?style=for-the-badge&logo=prisma&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Jest-316192?style=for-the-badge&logo=jest&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/React-316192?style=for-the-badge&logo=react&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Cypress-316192?style=for-the-badge&logo=cypress&logoColor=white" height="30px"/>
  
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

SingMeASong is a full-stack application that shows youtube videos recommendations, on this project we received already built front-end and back-end
and had to implement unit and integration tests for backend utilizing Jest, and test the front-end with Cypress.

</br>

## Environment Variables

To test this project routes and services, you will need to add the following environment variables to your .env.test and .env files respectively on
backend and frontend folders.

### backend

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`NODE_ENV = "test"`

### frontend

`REACT_APP_API_BASE_URL=http://localhost:5000`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/FKnight-cyber/projeto21-singmeasong
```

Go to the project directory

```bash
  cd projeto21-singmeasong/back-end
```
</br>
```bash
  cd projeto21-singmeasong/front-end
```
</br>
Install dependencies

```bash
  npm install
```

Create database

If you want to run it locally.

cd ../../projeto21-singmeasong/back-end

check your .env.test and inform your DATABASE_URL and NODE_ENV

```bash
  run npx prisma migrate dev 
```

and prisma will build the postgress database.

Start the server

```bash
  npm run dev
```

Run tests

```bash
  npm run test:unit
```

```bash
  npm run test:integration
```

prisma will build another postgress database for test purposes.
</br>

## Lessons Learned

In this project i've implemented cypress tests and backend service tests for the first time, i was quite hard but also interesting to check the integrity
of all routes and functions and also see if front-end was receiving all the data and functioning correctly.

</br>

## Acknowledgements

-   [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>

## Authors

-   Ryan Nicholas is a student at Driven Education and is putting effort into it to become a Dev.
<br/>

#
