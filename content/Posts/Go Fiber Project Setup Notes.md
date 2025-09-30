---
title: Go Fiber Project Setup Notes
date: 2025-09-30
draft: false
tags:
  - Golang
  - Setup
  - tech
---
## Prerequisites

- Go installed (version 1.21+ recommended), see [[ Golang Setup on Linux ]]
    
- Git installed
    
- Code editor (VS Code recommended)
    
- Terminal / CLI
    

## Project Setup

Create a new project folder and initialize a Go module:

```bash
mkdir my-fiber-app
cd my-fiber-app
go mod init github.com/yourusername/my-fiber-app
```

## Install Fiber

Use Go modules to install Fiber:

```bash
go get github.com/gofiber/fiber/v2
```

## Folder Structure

Organize your project like this:

```
my-fiber-app/
├── main.go
├── go.mod
├── go.sum
├── routes/
│   └── routes.go
├── controllers/
│   └── example_controller.go
├── models/
│   └── example_model.go
├── utils/
│   └── helpers.go
└── config/
    └── config.go
```

## Example main.go

```go
package main

import (
    "github.com/gofiber/fiber/v2"
    "my-fiber-app/routes"
)

func main() {
    app := fiber.New()

    // Setup routes
    routes.Setup(app)

    // Start server
    app.Listen(":3000")
}
```

## Example Routes

```go
package routes

import (
    "github.com/gofiber/fiber/v2"
    "my-fiber-app/controllers"
)

func Setup(app *fiber.App) {
    app.Get("/", controllers.Home)
    app.Get("/ping", controllers.Ping)
}
```

## Example Controller

```go
package controllers

import "github.com/gofiber/fiber/v2"

func Home(c *fiber.Ctx) error {
    return c.SendString("Welcome to Fiber!")
}

func Ping(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{"message": "pong"})
}
```

## Run the Project

```bash
go run main.go
```

Visit `http://localhost:3000` to see your app running.

## Useful Commands

- Build project: `go build`
    
- Run project: `go run main.go`
    
- Tidy dependencies: `go mod tidy`
    
- Install a package: `go get <package_url>`