# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```









Family School 📚🎮
Family School is an interactive educational platform built with React, TypeScript, Tailwind CSS, and Supabase. It allows students to take exams, follow news, play educational games, and track their rankings, while admins can manage exams, news, games, and other school-related content.

🚀 Features
🎓 Students
✅ Take and submit exams
✅ Stay updated with the latest news
✅ Play interactive educational games
✅ View and compare rankings

🛠 Admins
✅ Create and manage exams
✅ Publish news and announcements
✅ Add and update games
✅ Manage student rankings

🏗 Tech Stack
Frontend: React, TypeScript, Tailwind CSS
Backend & Database: Supabase
📦 Installation
bash
Copy
Edit
git clone https://github.com/your-repo/family-school.git  
cd family-school  
npm install  
🚀 Running the Project
bash
Copy
Edit
npm run dev  
⚙️ Environment Variables
Create a .env file and configure it with your Supabase credentials:

plaintext
Copy
Edit
VITE_SUPABASE_URL=your_supabase_url  
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
📜 License
This project is licensed under MIT License.
