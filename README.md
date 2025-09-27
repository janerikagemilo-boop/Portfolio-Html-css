# My Node.js Profile Image Upload Application

This project is a simple Node.js application that allows users to upload profile images. It uses Express for the server and Multer for handling file uploads.

## Project Structure

```
my-node-app
├── public
│   ├── uploads          # Directory for storing uploaded profile images
│   ├── index.html       # HTML file containing the upload form
│   └── script.js        # JavaScript file for handling uploads and localStorage
├── server.js            # Entry point of the application
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory:
   ```
   cd my-node-app
   ```
3. Install the required dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:5501` to access the upload form.
3. Select a profile image to upload and submit the form. The image will be stored in the `public/uploads` directory.

## Dependencies

- **Express**: A web framework for Node.js.
- **Multer**: A middleware for handling `multipart/form-data`, which is used for uploading files.

## License

This project is licensed under the MIT License.