import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className=" bg-[url('../public/Login.png')] bg-[100%_100%] bg-center bg-no-repeat h-screen w-screen overflow-hidden">
      <App />
    </div>
    
  </React.StrictMode>,
)
