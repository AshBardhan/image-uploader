# Image Uploader

## About the Project

A modern, performant image uploader built with React, Uppy, and Cloudinary. It supports drag-and-drop, file validation, thumbnail previews, concurrent uploads, and a beautiful, responsive UI with toast notifications.

[View Demo](http://uppy-img-uploader.netlify.app)

## Features Implemented

- Drag-and-drop and file picker support
- File type and size validation (JPEG, PNG, GIF, WEBP, max 10MB)
- Async thumbnail generation with loading skeletons
- Upload progress tracking and stats
- Error handling with toast notifications
- Retry, cancel, and clear actions for uploads
- Responsive, accessible UI

## Tech Stack

- React 18
- TypeScript
- Uppy (Core, XHRUpload, ThumbnailGenerator)
- Cloudinary (image hosting)
- Tailwind CSS
- class-variance-authority (CVA)
- framer-motion

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup & Installation

```sh
# Clone the repository
git clone https://github.com/AshBardhan/image-uploader.git
cd image-uploader

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:5173` in your browser to view the application.

## Project Structure

```text
image-uploader/
├── public/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── templates/
│   ├── constants/
│   ├── contexts/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
├── package.json
├── tailwind.config.js
├── vite.config.ts
```

## Architectural Decisions

| Decision                        | Reasoning                                                                |
|---------------------------------|--------------------------------------------------------------------------|
| Uppy for uploads                | Robust, extensible, handles restrictions and plugins well                |
| Cloudinary for storage          | Fast, reliable, free tier, easy integration                              |
| Context API for toasts          | Global notification management, decoupled from UI                        |
| ThumbnailGenerator plugin       | Efficient async thumbnail creation                                       |
| File state derived from Uppy    | Single source of truth, avoids sync bugs                                 |
| Tailwind CSS + CVA              | Utility-first, scalable, easy variant management                         |
| Atomic design pattern           | Reusable, testable, maintainable UI components                           |

## Future Implementations

- [ ] Add React error boundaries for crash protection
- [ ] Lazy load thumbnails for large file lists
- [ ] Make upload concurrency configurable
- [ ] Revoke object URLs for thumbnails on file removal
- [ ] Add unit and integration tests
- [ ] Add dark mode support
- [ ] Add drag-to-reorder for files
- [ ] Add multi-language (i18n) support
