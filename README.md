# E-Shop Frontend (React + TypeScript + Vite)

This project is a modern frontend built using **React**, **TypeScript**, and **Vite**. It provides a fast, maintainable setup with built-in support for **Dark Mode**, **Toast Notifications**, **Routing**, **Authentication**, and **Custom Providers**.

## 🔧 Features

- ⚡️ Vite for fast development
- 🔐 Authentication system with context
- 🌗 Dark mode toggle with `DarkModeProvider`
- 🔔 Toast notifications via `react-hot-toast`
- ✅ ESLint setup for code quality (with optional type-checking)
- 🧱 Modular structure (contexts, components, hooks, routes)

---

## 📁 Project Structure

<pre><code>src/
├── assets/ # Static assets
├── components/ # UI components
│ └── auth/ # Auth-related components
├── config/ # App configuration
├── context/ # Global contexts
├── hooks/ # Custom hooks
│ ├── AuthContext.ts # Authentication context 
│ ├── DarkModeContext.ts # Dark mode context 
├── i18n/ # Internationalization
├── interfaces/ # Interfaces
├── providers/ # App-level providers (like AuthProvider, DarkModeProvider) 
├── routes/ # Page components 
├── services/ # API services 
├── utils/ # helper functions 
├── App.css # Main css component 
├── App.tsx # Main app component 
├── index.css # Global css
└── main.tsx # App entry point
</code></pre>

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
 npm install
 or
 yarn install
```
### 2. Start the development server

npm run dev

### 3. Build for production

npm run build

## 🌙 Dark Mode

Dark mode is managed through a DarkModeProvider and can be toggled via a button. Tailwind's darkMode: 'class' strategy is used.

Example:
```
<button
onClick={toggleDarkMode}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
title="Toggle dark mode"
>
🌓
</button>
```

## 🔔 Toast Notifications

Using react-hot-toast, toasts are globally styled via a custom CustomToaster component:

Example:
```
<Toaster
toastOptions={{
style: {
borderRadius: '8px',
background: '#1a202c',
color: '#f7fafc',
},
success: {
style: {
background: '#2f855a',
color: '#e6fffa',
},
},
error: {
style: {
background: '#c53030',
color: '#fff5f5',
},
},
}}
/>
``` 

## 🧹 ESLint Setup

Basic ESLint is configured for React + TypeScript. For more advanced rules, enable type-aware linting:
Install:
```
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```
eslint.config.js (example with stricter rules)
```
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
```
```
export default tseslint.config({
extends: [
...tseslint.configs.recommendedTypeChecked,
...tseslint.configs.stylisticTypeChecked,
],
plugins: {
'react-x': reactX,
'react-dom': reactDom,
},
languageOptions: {
parserOptions: {
project: ['./tsconfig.app.json', './tsconfig.node.json'],
tsconfigRootDir: import.meta.dirname,
},
},
rules: {
...reactX.configs['recommended-typescript'].rules,
...reactDom.configs.recommended.rules,
},
});
```
## 📦 Recommended VS Code Extensions
*
    ESLint
*
    Tailwind CSS IntelliSense
*
    Prettier – Code formatter
*
    TypeScript React Snippets

##  🛠 Tech Stack
*
    React
*
   TypeScript
*
    Vite
*
    Tailwind CSS
*
    React Router Dom
*
    React Hot Toast
*
    ESLint

## 📄 License

This project is open-source.