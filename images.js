import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Use environment variables or fallback to default paths
const postsDir = path.resolve(process.env.POSTS_DESTINATION || './content/Posts');
const attachmentsDir = path.resolve(process.env.ATTACHMENTS_DESTINATION || './content/attachments');
const staticImagesDir = path.resolve('./public/images');

// Create static images directory if it doesn't exist
if (!fs.existsSync(staticImagesDir)) {
    fs.mkdirSync(staticImagesDir, { recursive: true });
    console.log(`Created missing directory: ${staticImagesDir}`);
}

// Function to process a single markdown file
function processMarkdownFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, "utf-8", (err, content) => {
            if (err) {
                console.error("Error reading file:", filepath, err);
                reject(err);
                return;
            }

            let hasChanges = false;
            let updatedContent = content;

            // Updated regex to match !![Image Description](image.png) format
            const imageMatches = content.match(/!!\[([^\]]*)\]\(([^)]+)\)/g);

            if (imageMatches) {
                imageMatches.forEach((match) => {
                    // Extract image name from the full match
                    const imageName = match.match(/\(([^)]+)\)/)[1];
                    const markdownImage = `![${match.match(/\[([^\]]*)\]/)[1] || 'Image'}](/images/${encodeURIComponent(imageName)})`;
                    updatedContent = updatedContent.replace(match, markdownImage);
                    hasChanges = true;

                    const imageSource = path.join(attachmentsDir, imageName);
                    const imageDest = path.join(staticImagesDir, imageName);

                    if (fs.existsSync(imageSource)) {
                        if (!fs.existsSync(imageDest)) {
                            fs.copyFile(imageSource, imageDest, (err) => {
                                if (err) {
                                    console.error("Error copying file:", imageSource, "to", imageDest, err);
                                } else {
                                    console.log(`Copied: ${imageName}`);
                                }
                            });
                        } else {
                            console.log(`Image already exists, skipping copy: ${imageName}`);
                        }
                    } else {
                        console.warn(`Image not found: ${imageSource}`);
                    }
                });

                if (hasChanges) {
                    fs.writeFile(filepath, updatedContent, "utf-8", (err) => {
                        if (err) {
                            console.error("Error writing file:", filepath, err);
                            reject(err);
                        } else {
                            console.log(`Updated file: ${filepath}`);
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            } else {
                console.log(`No images found in: ${filepath}`);
                resolve();
            }
        });
    });
}

// Main processing function
async function processAllMarkdownFiles() {
    try {
        if (!fs.existsSync(postsDir)) {
            console.warn(`Posts directory does not exist: ${postsDir}`);
            return;
        }

        const files = fs.readdirSync(postsDir);
        const markdownFiles = files.filter(filename => filename.endsWith('.md'));

        if (markdownFiles.length === 0) {
            console.log('No markdown files found to process.');
            return;
        }

        console.log(`Processing ${markdownFiles.length} markdown files...`);

        for (const filename of markdownFiles) {
            const filepath = path.join(postsDir, filename);
            try {
                await processMarkdownFile(filepath);
            } catch (error) {
                console.error(`Failed to process ${filename}:`, error);
            }
        }

        console.log("✅ Markdown files processed and images copied successfully.");
    } catch (error) {
        console.error("Error processing markdown files:", error);
        process.exit(1);
    }
}

// Run the script
processAllMarkdownFiles();