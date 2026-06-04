# Images Upload Folder

You can upload your personal images to this directory!

## How to use:
1. In the file explorer on the left sidebar of your AI Studio Build workspace, locate the `public` folder, then the `images` folder.
2. Drag and drop your image file (e.g. `my-photo.jpg`) directly into this folder, or use the file upload function in the developer workspace.
3. In your database (or Admin Panel), refer to this image using the path:
   `/images/your-file-name.ext`
   (e.g., `/images/my-photo.jpg`).

## Why this works:
Vite automatically services any assets placed inside the `public/` directory at the root URL. This means you do not need any external public cloud URL or Firebase Storage!
