# Workout Companies

## Dev start up

1. clone this repo
2. install dependencies

```zsh
    npm i
```

3. use correct node version

```zsh
    nvm use
```

4. make sure you have postgres install and createdb

```zsh
    psql -d jobs-backend
```

5. on first spin you will need seed all data and pull current jobs data. Command 1:

```zsh
    npm run dev:seed
```

wait for all test users to seed and jobs to populate to db

6. on second and subsequent steps all you'll need to do is run:

```zsh
    npm run dev
```

## Description

This is the backend application for job-board application viewer and tracker. A very crude app.

### API ENDPOINTS

- GET /v1/api/jobs
- GET /v1/api/jobs/greenhouse
- GET /v1/api/jobs/workday
- GET /v1/api/jobs/company/:companyName
- GET /v1/api/applications
- GET /v1/api/applications/active
- POST /v1/api/applications/active
- PUT /v1/api/applications/:id

### LEVER JOB ENDPOINTS

- GET https://api.lever.co/v0/postings/alltrails?mode=json [AllTrails]
- GET https://api.lever.co/v0/postings/articulate?mode=json [Articulate]

### CONTRIBUTIONS

- If you want to help building on this project don't hesitate to ask!
- You will need the following to get started:

1. This app and dependencies
2. Postgres installed (can do via brew on mac)
3. SSH and GPG signing on github
4. correct env variables set in .env.local

#### TODO

this is still a work in progess with lots to do including but not limited to...:

- [ ] connect "applied" to add that job to applied jobs tab
- [ ] a way to move "applied" to "no longer considering
- [ ] a bunch more features for the user dashboard

This will also be free to use.
