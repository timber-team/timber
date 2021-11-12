# CS3500

Timber is a social networking platform to connect professionals and hobbyists together. It’s
main purpose is to join people who are looking to work on projects in their spare time. It
can be ostensible nowadays for a student or a person aspiring to join the industry; to find and
collaborate with and gain team building skills. Our purpose is to mediate these worries of finding
a team and allow the users to match with each other based on their personal similarities and
interests. Our goal is to allow people to access this in a digestible fashion. Removing high
barriers to entry such as CVs, lengthy cover letters and experience prerequisites. Users on this
platform not only can match with these projects but can also use them to gain and show their
experience on their professional portfolios.

# Installation
## Dependencies
[Docker](https://docker.com) 
---
( or alternatively )
- [Go](https://golang.org)
- [Node](https://nodejs.org)
- a webserver like [Nginx](https://nginx.com)
- [PostgreSQL](https://www.postgresql.org)
- [Redis](https://redis.com/)

## Setup
- Create an OAuth web application on [Google Cloud Platform](https://console.cloud.google.com), and get OAuth2 Client ID and Secret 
- Create an OAuth web application on [Github](https://github.com/settings/developers), and get OAuth2 Client ID and secret.

- Set both to use `http://localhost/oauth/callback/<PROVIDER_NAME>` as valid redirect URLs (and http://localhost as valid Javascript Origins for Google).
- Add these as environment variables, following the examples in template.env

If using docker, use docker-compose with the docker-compose.yml file provided. Otherwise, deploy each service, making use of the environment variables.
