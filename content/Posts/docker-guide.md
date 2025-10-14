---
title: docker-guide
date: 2025-10-04
draft: false
tags:
  - docker
  - containers
  - beginner-guide
  - development
  - environment-setup
---

## Backlinks

- [[How to kill the process currently using a port on localhost in windows]]
- [[🐧 WSL + Fish Shell Setup Notes]]
- [[Golang Setup on Linux]]

Docker is an incredibly powerful tool that has revolutionized how developers build, ship, and run applications. If you've ever heard phrases like "it works on my machine!" or struggled with environment setup, Docker is here to save the day.

This guide will break down Docker into simple, understandable concepts and get you started with your first containers.

---

## What is Docker? (The Simple Analogy)

Imagine you're shipping a fragile, complex product – say, a custom-built computer. If you just throw it in a box, it might break or not work when it arrives because of how it was packed or the environment it lands in.

Now, imagine using a **standardized shipping container**. You put your computer inside, along with *everything* it needs to run (power supply, specific cables, instructions). This container is sealed and ensures that no matter where it goes – by truck, train, or ship – it arrives in the same condition and works exactly as expected when unpacked.

**Docker is like that standardized shipping container for your software.**

*   **Your application and all its dependencies (libraries, configuration, specific OS settings) are bundled together into a single, isolated "container."**
*   This container runs consistently on any machine that has Docker installed, regardless of the underlying operating system.

---

## Why Use Docker? (The Benefits)

1.  **"It works on my machine!" Solved:** Docker ensures your application runs the same way everywhere – development, testing, and production. No more environmental inconsistencies.
2.  **Isolation:** Each application runs in its own isolated container, meaning they won't interfere with each other or with your host system.
3.  **Portability:** Docker containers can be easily moved and run on any machine with Docker installed (Linux, Windows, macOS).
4.  **Efficiency:** Containers are lightweight and start up quickly, using fewer resources than traditional virtual machines.
5.  **Faster Development Cycles:** Developers can quickly set up consistent development environments and easily share them.
6.  **Scalability:** Docker makes it easier to scale your applications by running multiple instances of containers.

---

## Core Docker Concepts for Beginners

Before we dive into commands, let's understand the essential building blocks:

1.  ### **Images**
    *   **Think of it as:** A blueprint or a recipe.
    *   An image is a read-only template that contains a set of instructions for creating a container. It includes the application, libraries, dependencies, and configuration needed to run the application.
    *   You *build* images, and then you *run* containers from them.
    *   Examples: An image for a Python application, an image for a MySQL database, an image for a web server like Nginx.

2.  ### **Containers**
    *   **Think of it as:** A running instance of an image.
    *   A container is a live, executable instance created from an image. When you run an image, it becomes a container.
    *   You can start, stop, move, and delete containers.
    *   A container is isolated from other containers and from the host system.

3.  ### **Dockerfile**
    *   **Think of it as:** The instruction manual for building an image.
    *   A simple text file that contains a sequence of commands Docker uses to build an image. It defines exactly what goes into your image and how it should be configured.

4.  ### **Docker Hub**
    *   **Think of it as:** A public registry or library for Docker Images.
    *   Like GitHub for code, Docker Hub is where you can find and share Docker images. You can pull (download) existing images (e.g., official images for Ubuntu, Node.js, MySQL) or push (upload) your own custom images.

---

## Getting Started: Installation

The easiest way to get Docker running on your personal computer (Windows or macOS) is by installing **Docker Desktop**. For Linux, you typically install the Docker Engine directly.

1.  **Download Docker Desktop:**
    *   Go to the official Docker website: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
    *   Download the appropriate installer for your operating system (Windows, Mac with Intel chip, or Mac with Apple chip).
    *   Follow the installation instructions. You might need to enable virtualization (Hyper-V on Windows, Virtualization in BIOS/UEFI) or grant permissions.

2.  **Verify Installation:**
    *   Open your terminal or command prompt.
    *   Type: `docker --version`
        *   You should see the Docker version printed.
    *   Type: `docker run hello-world`
        *   This command is a great way to verify that Docker is working correctly. It will:
            *   Check if the `hello-world` image exists locally.
            *   If not, pull (download) it from Docker Hub.
            *   Create and run a new container from that image.
            *   The container will print a "Hello from Docker!" message and then exit.

---

## Your First Docker Commands

Let's get hands-on with some fundamental Docker commands.

1.  ### `docker run` - Run a container
    This is the most fundamental command. It creates and starts a new container from an image.

    ```bash
    docker run ubuntu
    ```
    *   This will download the `ubuntu` image (if not already present) and then run a container from it.
    *   **Wait, nothing happened?** The `ubuntu` image is just a base operating system. It runs, does nothing, and then exits. To interact with it, we need to add a flag:

    ```bash
    docker run -it ubuntu bash
    ```
    *   `-i`: (interactive) Keeps the standard input open.
    *   `-t`: (tty) Allocates a pseudo-TTY, giving you a shell.
    *   `ubuntu`: The image to run.
    *   `bash`: The command to run inside the container (opens a bash shell).
    *   You are now *inside* the Ubuntu container! Try commands like `ls`, `pwd`, `apt update`.
    *   Type `exit` to leave the container. The container will then stop.

2.  ### `docker ps` - List containers
    Shows you the currently running containers.

    ```bash
    docker ps
    ```
    *   You'll likely see nothing, as our `ubuntu` container exited.

    To see *all* containers (running and stopped):
    ```bash
    docker ps -a
    ```
    *   You should see your `hello-world` and `ubuntu` containers listed, showing their status (Exited).

3.  ### `docker stop` - Stop a running container
    You need the container ID or name (from `docker ps`).

    ```bash
    docker stop <container_id_or_name>
    ```

4.  ### `docker rm` - Remove a container
    Removes a *stopped* container.

    ```bash
    docker rm <container_id_or_name>
    ```
    *   To remove all stopped containers: `docker container prune`

5.  ### `docker images` - List images
    Shows all images downloaded to your local machine.

    ```bash
    docker images
    ```

6.  ### `docker rmi` - Remove an image
    Removes an image. You can't remove an image if there are containers (even stopped ones) based on it. Remove containers first.

    ```bash
    docker rmi <image_id_or_name>
    ```
    *   To remove all unused images: `docker image prune -a`

7.  ### `docker pull` - Download an image
    Downloads an image from Docker Hub without running it.

    ```bash
    docker pull alpine
    ```
    *   `alpine` is a very small Linux distribution, great for testing.

---

## Dockerizing a Simple Application (Python Flask Example)

Let's build a simple web application and put it into a Docker container.

**Goal:** Create a Flask (Python web framework) "Hello World" application and run it in a container.

**Steps:**

1.  **Create Project Files:**
    Create a new directory (e.g., `my-flask-app`). Inside it, create two files:

    *   **`app.py`** (Our Flask application)
        ```python
        from flask import Flask
        import os

        app = Flask(__name__)

        @app.route('/')
        def hello():
            return "Hello from Flask inside Docker! (Running on port {})".format(os.environ.get("FLASK_PORT", "5000"))

        if __name__ == '__main__':
            # Get port from environment variable or default to 5000
            port = int(os.environ.get("FLASK_PORT", 5000))
            app.run(debug=True, host='0.0.0.0', port=port)
        ```

    *   **`requirements.txt`** (Python dependencies)
        ```
        Flask
        ```

    *   **`Dockerfile`** (Instructions for building our image)
        ```dockerfile
        # Use an official Python runtime as a parent image
        FROM python:3.9-slim-buster

        # Set the working directory in the container to /app
        WORKDIR /app

        # Copy the current directory contents into the container at /app
        COPY . /app

        # Install any needed packages specified in requirements.txt
        RUN pip install --no-cache-dir -r requirements.txt

        # Make port 5000 available to the world outside this container
        EXPOSE 5000

        # Define environment variable
        ENV FLASK_APP=app.py
        ENV FLASK_RUN_HOST=0.0.0.0
        ENV FLASK_PORT=5000

        # Run app.py when the container launches
        CMD ["flask", "run"]
        ```

2.  **Build the Docker Image:**
    Open your terminal, navigate to the `my-flask-app` directory (where your `Dockerfile` is), and run:

    ```bash
    docker build -t my-flask-app .
    ```
    *   `docker build`: The command to build an image.
    *   `-t my-flask-app`: Tags the image with the name `my-flask-app`. This makes it easy to reference later.
    *   `.`: Tells Docker to look for the `Dockerfile` in the current directory.

    You'll see a lot of output as Docker executes each step in your `Dockerfile`. If successful, it will end with a message like "Successfully tagged my-flask-app:latest".

3.  **Run the Docker Container:**

    ```bash
    docker run -p 5000:5000 my-flask-app
    ```
    *   `docker run`: Start a new container.
    *   `-p 5000:5000`: This is crucial! It maps port 5000 on your host machine to port 5000 *inside* the container. Without this, you wouldn't be able to access the web app from your browser.
    *   `my-flask-app`: The name of the image we want to run.

4.  **Verify the Application:**
    Open your web browser and go to `http://localhost:5000`. You should see "Hello from Flask inside Docker!"

    To stop the container, go back to your terminal where it's running and press `Ctrl+C`.

5.  **Run in Detached Mode (Background):**
    If you want the container to run in the background without tying up your terminal, use the `-d` (detached) flag:

    ```bash
    docker run -d -p 5000:5000 my-flask-app
    ```
    *   Now you can close your terminal, and the app will keep running.
    *   To stop it, first find its ID: `docker ps`. Then: `docker stop <container_id>`.

---

## Beyond the Basics (What's Next?)

This guide just scratches the surface. As you get more comfortable, explore these concepts:

*   **Volumes:** For persistent data storage (e.g., database files). Containers are ephemeral; volumes keep your data safe.
*   **Networks:** To allow containers to communicate with each other securely.
*   **Docker Compose:** For defining and running multi-container Docker applications (e.g., a web app + a database + a caching layer).
*   **Docker Hub:** Learn how to push your own images to Docker Hub to share them.
*   **Docker Swarm / Kubernetes:** For orchestrating and managing large-scale container deployments.

---

## Tips for Beginners

*   **Start Small:** Don't try to containerize your entire complex application on day one. Start with a simple "Hello World" or a single service.
*   **Use Official Images:** When building your `Dockerfile`, start with official base images from Docker Hub (e.g., `python:3.9-slim-buster`, `node:16-alpine`, `nginx`). They are well-maintained and secure.
*   **Read the Docs:** The official Docker documentation is excellent and comprehensive.
*   **Clean Up:** Docker can consume disk space. Regularly prune stopped containers, unused images, and volumes:
    *   `docker system prune` (cleans up a lot, but be careful!)
*   **`docker logs <container_id>`:** Use this command to view the output and errors from a running container.
*   **`docker exec -it <container_id> bash`:** If a container is running in the background and you want to inspect what's happening inside, this command lets you open a shell within it.

---

Docker might seem intimidating at first, but with practice, it quickly becomes an indispensable tool. Keep experimenting, and you'll soon appreciate its power and elegance! Happy containerizing!