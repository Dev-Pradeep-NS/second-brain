#!/bin/bash

# Function to load .env file
load_env() {
    if [[ ! -f .env ]]; then
        echo "Error: .env file not found"
        exit 1
    fi

    # Load .env file while handling spaces in values
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^[[:space:]]*# ]] && continue
        [[ -z $key ]] && continue

        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)

        # Export the variable
        export "$key"="$value"
    done < .env
}

# Set error handling
set -e

# Change to script directory
cd "$(dirname "$0")"

# Load environment variables
load_env

# Validate required environment variables
required_vars=("OBSIDIAN_POSTS_PATH" "OBSIDIAN_ATTACHMENTS_PATH" "POSTS_DESTINATION" "ATTACHMENTS_DESTINATION")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "Error: $var is not defined in .env file"
        exit 1
    fi
done

# Check for required commands
for cmd in git node npx; do
    if ! command -v "$cmd" &> /dev/null; then
        echo "Error: $cmd is not installed or not in PATH"
        exit 1
    fi
done

# Step 1: Initialize git if needed
if [[ ! -d ".git" ]]; then
    echo "Initializing Git repository..."
    git init
    if [[ -n "$REPO_URL" ]]; then
        git remote add origin "$REPO_URL"
    fi
else
    echo "Git repository already initialized."
    if [[ -n "$REPO_URL" ]] && ! git remote | grep -q origin; then
        echo "Adding remote origin..."
        git remote add origin "$REPO_URL"
    fi
fi

# Step 2: Sync content from Obsidian
echo "Syncing posts from Obsidian..."

# Check if source paths exist
if [[ ! -d "$OBSIDIAN_POSTS_PATH" ]]; then
    echo "Warning: Source posts path does not exist: $OBSIDIAN_POSTS_PATH"
    echo "Skipping posts sync..."
else
    echo "Copying posts from $OBSIDIAN_POSTS_PATH to $POSTS_DESTINATION"
    cp -r "$OBSIDIAN_POSTS_PATH"/* "$POSTS_DESTINATION/" 2>/dev/null || echo "No posts to copy"
fi

if [[ ! -d "$OBSIDIAN_ATTACHMENTS_PATH" ]]; then
    echo "Warning: Source attachments path does not exist: $OBSIDIAN_ATTACHMENTS_PATH"
    echo "Skipping attachments sync..."
else
    echo "Copying attachments from $OBSIDIAN_ATTACHMENTS_PATH to $ATTACHMENTS_DESTINATION"
    cp -r "$OBSIDIAN_ATTACHMENTS_PATH"/* "$ATTACHMENTS_DESTINATION/" 2>/dev/null || echo "No attachments to copy"
fi

# Step 3: Process markdown files for image links (if images.js exists)
if [[ -f "images.js" ]]; then
    echo "Processing image links in Markdown files..."
    node images.js
else
    echo "images.js not found, skipping image processing..."
fi

# Step 4: Build the Quartz site
echo "Building the Quartz site..."
if [[ -n "$BUILD_COMMAND" ]]; then
    eval "$BUILD_COMMAND"
else
    npx quartz build
fi

# Step 5: Check for changes and commit
echo "Checking for changes..."
if git status --porcelain | grep -q .; then
    echo "Staging changes..."
    git add .

    if git diff --cached --name-only | grep -q .; then
        commit_message="New Blog Post on $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Committing changes with message: $commit_message"
        git commit -m "$commit_message"

        # Step 6: Push to main branch (GitHub Actions will handle deployment)
        echo "Pushing to main branch..."

        # Start SSH agent if not running or not accessible
        if ! ssh-add -l &>/dev/null; then
            echo "Starting SSH agent..."
            eval "$(ssh-agent -s)"
        fi

        # Check if our specific key is loaded
        if ! ssh-add -l 2>/dev/null | grep -q "id_personal"; then
            echo "Adding SSH key to agent..."
            echo "Please enter your SSH key passphrase:"
            ssh-add ~/.ssh/id_personal || {
                echo "⚠️  Failed to add SSH key."
                echo "Please check your passphrase and try again."
                exit 1
            }
        fi

        git push origin main || {
            echo "❌ Failed to push to main branch."
            echo "Please check your SSH key and run: ssh-add ~/.ssh/id_personal"
            exit 1
        }

        echo "✅ All done! Site synced, built, committed, and pushed."
        echo "🚀 GitHub Actions will automatically deploy to GitHub Pages."
        echo "📖 Your site will be available at: https://dev-pradeep-ns.github.io/second-brain/"
    else
        echo "No staged changes to commit."
    fi
else
    echo "No changes detected."
fi