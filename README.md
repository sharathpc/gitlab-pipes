# 🚀 GitLab Pipes - Browser Extension to Monitor GitLab Pipelines

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)
[![GitLab GraphQL](https://img.shields.io/badge/API-GitLab%20GraphQL-orange)](https://docs.gitlab.com/ee/api/graphql/)

**GitLab Pipes** is a lightweight browser extension that allows you to bookmark multiple GitLab projects and view their latest CI/CD pipeline statuses directly in your browser.

## ✨ Screenshots

![Screenshot](https://github.com/sharathpc/gitlab-pipes/blob/screenshots/screenshot-1.png?raw=true)
![Screenshot](https://github.com/sharathpc/gitlab-pipes/blob/screenshots/screenshot-2.png?raw=true)
![Screenshot](https://github.com/sharathpc/gitlab-pipes/blob/screenshots/screenshot-3.png?raw=true)

---

## ✨ Features

- 🔖 Bookmark multiple GitLab repositories  
- 🟢 View the most recent pipeline status per project  
- ⚠️ Easily detect failed or running pipelines  
- 🔐 Authenticated via GitLab Personal Access Token (PAT)  
- 🧠 Built with React + GraphQL + Manifest V3  

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sharathpc/gitlab-pipes.git
cd gitlab-pipes
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Build the Extension
```bash
yarn build
```

### 4. Load into Chrome
- Open chrome://extensions
- Enable Developer Mode
- Click Load Unpacked
- Select the dist/ directory

---

### 🔐 Authentication
On first use, you'll be prompted to enter your GitLab Personal Access Token.

> ✅ Make sure your token has the read_api scope.

It is stored locally in your browser and never sent anywhere else.

---

### 📦 Tech Stack
- React
- Vite
- GitLab GraphQL API
- Chrome Extension Manifest V3

---

### 🛣 Roadmap Ideas
- Manual pipeline trigger button
- Mobile-friendly popup layout
- Project group filters
- Token and bookmarks sync using GitLab snippets
- Have suggestions? [Open an issue](https://github.com/sharathpc/gitlab-pipes/issues)!

---

### 🤝 Contributing
1. Fork the repo
2. Create your feature branch (git checkout -b feature/awesome-feature)
3. Commit your changes (git commit -m 'Add awesome feature')
4. Push to the branch (git push origin feature/awesome-feature)
5. Open a Pull Request

---

### 📄 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/sharathpc/gitlab-pipes/blob/master/LICENSE) file for details.
