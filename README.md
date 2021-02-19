## Project Overview

This is a simple web app that will allow users to shorten long URLS to a randomized 6 character key.

## Functional Requirement

### User Stories
* As an avid twitter poster, I want to be able to shorten links, so that I can fit more non-link text in my tweets.

* As a twitter reader, I want to be able to visit sites via shortened links, so that I can read interesting content.

* (Stretch) As an avid twitter poster, I want to be able to see how many times my subscribers visit my links, so that I can learn what content they like.

## Display Requirements
* Site Header:

  - [x] If a user is logged in, the header shows:
    * the user's email
    * a logout button which makes a POST request to `/logout`
  
  - [x] If a user is not logged in, the header shows:
    * a link to the login page (`/login`)
    * a link to the registration page (`/register`)

## Behaviour Requirement

- [x] `GET /`
  * if user is logged in:
    - [x] (Minor) redirect to `/urls`
  * if user is not logged in:
    - [x] (Minor) redirect to `/login`

- [x] `GET /urls`
  * if user is logged in:
    * returns HTML with:
    - [x] the site header (see Display Requirements above)
    - [x] a list (or table) of URLs the user has created, each list item containing:
      - [x] a short URL
      - [x] the short URL's matching long URL
      - [x] an edit button which makes a GET request to `/urls/:id`
      - [x] a delete button which makes a POST request to `/urls/:id/delete`
      - [ ] (Stretch) the date the short URL was created
      - [ ] (Stretch) the number of times the short URL was visited
      - [ ] (Stretch) the number number of unique visits for the short URL
    - [x] (Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
  * if user is not logged in:
    - [x] returns HTML with a relevant error message

- [x] `GET /urls/new`
  * if user is logged in:
  * returns HTML with:
  - [x] the site header (see Display Requirements above)
  - [x] a form which contains:
    - [x] a text input field for the original (long) URL
    - [x] a submit button which makes a POST request to `/urls`
  * if user is not logged in:
    - [x] redirects to the `/login` page

- [x] `GET /urls/:id`
  * if user is logged in and owns the URL for the given ID:
    * returns HTML with:
    - [x] the site header (see Display Requirements above)
    - [x] the short URL (for the given ID)
    - [x] a form which contains:
      * the corresponding long URL
      * an update button which makes a POST request to `/urls/:id`
    - [ ] (Stretch) the date the short URL was created
    - [ ] (Stretch) the number of times the short URL was visited
    - [ ] (Stretch) the number of unique visits for the short URL
  * if a URL for the given ID does not exist:
    - [x] (Minor) returns HTML with a relevant error message
  * if user is not logged in:
    - [x] returns HTML with a relevant error message
  * if user is logged it but does not own the URL with the given ID:
    - [] returns HTML with a relevant error message

- [x] `GET /u/:id`
  * if URL for the given ID exists:
    - [x] redirects to the corresponding long URL
  * if URL for the given ID does not exist:
    - [x] (Minor) returns HTML with a relevant error message

- [x] `POST /urls`
  * if user is logged in:
    - [x] generates a short URL, saves it, and associates it with the user
    - [x] redirects to `/urls/:id`, where :id matches the ID of the newly saved URL
  * if user is not logged in:
    - [x] (Minor) returns HTML with a relevant error message

- [ ] `POST /urls/:id`
  * if user is logged in and owns the URL for the given ID:
    - [ ] updates the URL
    - [ ] redirects to `/urls`
  * if user is not logged in:
    - [ ] (Minor) returns HTML with a relevant error message
  * if user is logged it but does not own the URL for the given ID:
    - [ ] (Minor) returns HTML with a relevant error message

- [ ] `POST /urls/:id/delete`
  * if user is logged in and owns the URL for the given ID:
    - [x] deletes the URL
    - [x] redirects to `/urls`
  * if user is not logged in:
    - [ ] (Minor) returns HTML with a relevant error message
  * if user is logged it but does not own the URL for the given ID:
    - [ ] (Minor) returns HTML with a relevant error message

- [x] `GET /login`
  * if user is logged in:
    - [x] (Minor) redirects to `/urls`
  * if user is not logged in:
    * returns HTML with:
    - [x] a form which contains:
      - [x] input fields for email and password
      - [x] submit button that makes a POST request to `/login`

- [ ] `GET /register`
  * if user is logged in:
    - [ ] (Minor) redirects to `/urls`
  * if user is not logged in:
    * returns HTML with:
    - [x] a form which contains:
    - [x] input fields for email and password
    - [x] a register button that makes a POST request to `/register`

- [ ] `POST /login`

  * if email and password params match an existing user:
    - [x] sets a cookie
    - [x] redirects to `/urls`
  * if email and password params don't match an existing  user:
    - [] returns HTML with a relevant error message

- [ ] `POST /register`
  * if email or password are empty:
    - [ ] returns HTML with a relevant error message
  * if email already exists:
    - [ ] returns HTML with a relevant error message
  * otherwise:
    - [x] creates a new user
    - [x] encrypts the new user's password with bcrypt
    - [x] sets a cookie
    - [x] redirects to `/urls`

- [x] `POST /logout`
  - [x] deletes cookie
  - [x] redirects to `/urls`


