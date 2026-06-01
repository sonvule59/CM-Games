# **CM Intervention**

A React app that guides users through interactive, branching wellness activities across five different domains of physical activity/ Each domain presents choices that update a live stats panel tracking **energy**, **mood**, **confidence**, and **health**.

---

## **Domains**

| Route | Domain | Activities |
| ----- | ----- | ----- |
| `/leisure` | Leisure | Rock climbing, outdoors/lake, walking, swimming |
| `/domestic-home` | Domestic (Home) | Indoor chores (cleaning, dishes, laundry, cooking) and outdoor tasks (gardening, car washing, dog walking, etc.) |
| `/office` | Office Game | Desk exercises, walking meetings, water breaks, stretches, and more |
| `/mindfulness-home` | Mindfulness | Phrase-based reflection game — tap a phrase that fits your mood to shift your stats |
| `/transport-home` | Transport Game | Two scenarios: commuting to work and going grocery shopping, with branching choices (walk, bike, transit, drive) |

---

## **Stats System**

Every choice in every world adjusts a shared stats object:

`type Stats = {`  
    `energy: number, mood: number, confidence: number, health: number`  
`};`

Stats are clamped and displayed in a `StatsPanel`. After each choice, a `StatDeltaViewer` shows what changed.

## **Getting Started**

npm install  
npm run lint \# optional  
npm run typecheck \# optional  
npm run dev

---

## **Tech Stack**

* **NPM** for package management and code organization  
* **Vite** with **ECMAScript Modules** for building/bundling and development server  
* **TypeScript** and **ESLint** for static code analysis  
* **React** for client-side user interface  
* **React Router** (`react-router`) **with Framework Mode** for client-side navigation  
* **Tailwind** for CSS  
* Shared design system via `Layout.tsx`, `ActionPanel.tsx`, `ActivityImage.tsx`, and `StatsPanel.tsx`

# **How to Build**

*Deployment guide for the React \+ PM2 app*

## **1\. Install PM2**

Download and install PM2 globally via npm:

cd Frontend/CM\_Intervention  
npm install \-g pm2

## **2\. Configure package.json Scripts**

Make sure your package.json includes the following scripts block:

"scripts": {  
  "dev": "vite",  
  "build": "react-router build",  
  "lint": "eslint .",  
  "typecheck": "react-router typegen && tsc",  
  "preview": "vite preview"  
}

## **3\. Install Dependencies**

Install all project dependencies:

npm install

## **4\. Build the App**

Run the production build:

npm run build

## **5\. Deploy with PM2**

Start the app using PM2 as a static SPA server on port 8080:

pm2 delete cm-app || true  
pm2 serve build/client 8080 \--spa \--name cm-app \--time  
pm2 save

*pm2 save persists the process list so it restarts automatically after a reboot.*
