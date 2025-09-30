---
title: Golang PocketBase Setup Notes
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

Create a new Go project and initialize the module:

```bash
mkdir my-pocketbase-app
cd my-pocketbase-app
go mod init github.com/yourusername/my-pocketbase-app
```

## Install PocketBase

Use Go modules to install PocketBase and dependencies:

```bash
go get github.com/pocketbase/pocketbase
go get github.com/pocketbase/pocketbase/plugins/migratecmd
go get github.com/joho/godotenv
```

## Folder Structure

Organize your project like this:

```
my-pocketbase-app/
├── main.go
├── go.mod
├── go.sum
├── .env
└── migrations/
```

## main.go Example

```go
package main

import (
    "log"

    "github.com/joho/godotenv"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
    app := pocketbase.New()

    // Load environment variables from .env
    err := godotenv.Load(".env")
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Register migrations plugin
    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        Automigrate: true,
        Dir:         "migrations",
    })

    // Start PocketBase app
    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

## Environment File (.env)

Create a `.env` file in your project root to configure environment variables if needed.

## Migrations

- Place your migration files inside the `migrations` folder.
    
- `Automigrate: true` will automatically apply migrations on app startup.
    

## Run the Project

```bash
go run main.go
```

Your PocketBase backend will start and be ready for use.

## Useful Commands

- Build project: `go build`
    
- Run project: `go run main.go`
    
- Tidy dependencies: `go mod tidy`
    
- Install a package: `go get <package_url>`