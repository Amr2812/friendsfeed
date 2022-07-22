# Friendsfeed

A social network for friends to see their life updates only to support friends communication without influencers, creators, pages, etc...

## Technologies

* Node.js
* TypeScript
* Nest.js
* PostgreSQL
* TypeORM
* Redis
* RabbitMQ
* JWT Authentication
* Swagger

## System Architecture

[system-arch.png](https://github.com/friendsfeed/raw/master/.github/system-arch.png)

## Docs

Swagger [https://friends-feed.herokuapp.com/api/v1.0/docs](https://friends-feed.herokuapp.com/api/v1.0/docs)

## Features

The following features are available: (without details)

* Authentication:
  * Sign up
  * Login
  * Logout
  * JWT Refresh tokens

* Users:
  * Get my profile
  * Get user profile with friendship status
  * Update profile picture
  * Update profile

* Friendships:
  * Friendship request
  * Accept friendship request
  * Reject friendship request
  * Get/Filter/Search friendship requests
  * Get/Filter/Search friends

* Posts:
  * Create post
  * Get/Filter posts of a user
  * Get post by id
  * Update post
  * Delete post

* Comments:
  * Create comment on a post
  * Get comments of a post
  * Get comment by id
  * Update comment
  * Delete comment

* Likes:
  * Like a post
  * Unlike a post
  * Get likes of a post

* Feed Microservice (posts of my friends):
  * Store each user's feed in redis
  * Get feed of a user (autoscroll)

## Feed Microservice

It is a microservice that stores each user's feed. It communicates with the Postgresql database and the Redis database. It communicates through RabbitMQ. It acts as a worker that listens to posts creation events and updates the feed of the friends of the user. It uses Request-Response pattern with rabbitmq to send user's feed to the monolith web server.
