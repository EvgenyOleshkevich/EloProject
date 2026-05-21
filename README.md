# Elo Project

A pet project for managing games, players, matches, tournaments, and Elo ratings.

## Tech Stack

- Java 17
- Spring Boot
- Spring GraphQL
- Spring Security
- MongoDB
- JWT
- Angular
- Apollo Angular

## Features

- Player management
- Match history
- Elo rating calculation
- JWT authentication
- Role-based authorization
- GraphQL API
- Tournament generation:
  - Single Elimination
  - Double Elimination

## Roles

- **Guest** — view tournaments, matches, and ratings
- **Player** — register, log in, find other players
- **Operator** — create and run tournaments
- **Admin** — full access and user role management

## Run Backend

```bash
./gradlew bootRun