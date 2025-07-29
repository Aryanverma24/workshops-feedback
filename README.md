# Workshop Feedback System

A comprehensive web application designed to manage workshops and collect participant feedback efficiently. This system enables organizers to list workshops, gather detailed feedback from attendees, and analyze results to improve future events.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
- [Usage](#usage)  
- [Deployment](#deployment)  
- [Continuous Integration / Continuous Deployment (CI/CD)](#continuous-integration--continuous-deployment-cicd)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Features

- **Workshop Listing:** Display upcoming and past workshops with details.  
- **Feedback Collection:** Participants can submit feedback for workshops.  
- **Admin Panel:** Manage workshops and view aggregated feedback (optional).  
- **Responsive UI:** Accessible and usable across desktop and mobile devices.  
- **Authentication:** Secure login for admins (if applicable).  
- **Automated Deployment:** GitHub Actions workflows for seamless CI/CD with Firebase Hosting.

---


## Screenshots

### Workshop Home Page
![Workshop Listing](assets/Screenshot%20(110).png)

### Login Form
![Feedback Form](assets/Screenshot%20(111).png)

### Admin Panel
![Admin Panel](assets/Screenshot%20(120).png)

### FireStore Results View
![Feedback Results](assets/Screenshot%20(127).png)

### FireStore Results View
![Feedback Results](assets/Screenshot%20(128).png)

### Cloudinary Results View
![Feedback Results](assets/Screenshot%20(132).png)

### Student Dashboard View
![Feedback Results](assets/Screenshot%20(112).png)

### Feedback form View
![Feedback Results](assets/Screenshot%20(115).png)

### phone otp verification View
![Feedback Results](assets/Screenshot%20(117).png)

### Generate Certificate View and Certificate is also email to the user 
![Feedback Results](assets/Screenshot%20(119).png)

### Workshops Submissions View
![Feedback Results](assets/Screenshot%20(123).png)



## Tech Stack

| Layer            | Technology                         |
|------------------|----------------------------------|
| Frontend         | React.js / Vue.js / Angular (specify your framework) |
| Backend          | Node.js with Express (if applicable) |
| Database         | Firebase Firestore / Realtime Database |
| Hosting          | Firebase Hosting                 |
| Authentication   | Firebase Authentication (optional) |
| CI/CD            | GitHub Actions                  |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js)  
- Firebase CLI installed globally:  
  ```bash
  npm install -g firebase-tools


* A Firebase project set up for hosting and database.

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/Aryanverma24/workshop-feedback-system.git
   cd workshop-feedback-system
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set up Firebase configuration (see next section).

### Configuration

* Create a `.env` file in the `server/` or root folder (depending on your setup) to store environment variables like Firebase API keys, database URLs, etc.
* Example `.env`:

  ```
  REACT_APP_FIREBASE_API_KEY=your_api_key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
  REACT_APP_FIREBASE_PROJECT_ID=your_project_id
  ```
* Make sure your Firebase rules and authentication are properly set up in the Firebase Console.

---

## Usage

* Start the development server:

  ```bash
  npm start
  ```
* Open your browser at `http://localhost:5173` (or the port your app uses).
* Admin users can log in (if auth implemented) and add/manage workshops.
* Participants can view workshops and submit feedback through forms.

---

## Deployment

* Build the app for production:

  ```bash
  npm run build
  ```
* Deploy to Firebase Hosting:

  ```bash
  firebase deploy
  ```

---

## Continuous Integration / Continuous Deployment (CI/CD)

* GitHub Actions workflows are set up to automate build and deployment processes when you push changes to the `main` branch.
* Workflows:

  * `firebase-hosting-pull-request.yml` – runs build on PRs.
  * `firebase-hosting-merge.yml` – deploys to Firebase on merge to `main`.

---

## Project Structure

```
workshop-feedback-system/
├── public/                   # Static files
├── src/                      # React or frontend source files
├── server/                   # Backend code and API (if any)
├── .github/
│   └── workflows/            # GitHub Actions workflow files
├── firebase.json             # Firebase config
├── .firebaserc               # Firebase project aliases
├── package.json              # npm dependencies and scripts
└── README.md                 # Project documentation
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

Aryan Verma – [aryanv2204@gmail.com](mailto:aryanv2204@gmail.com)
GitHub: [https://github.com/Aryanverma24](https://github.com/Aryanverma24)

```

```
