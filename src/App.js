import './App.css';
import React from "react";
import {useState} from "react";
import {Routes, Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LayoutComp from "./components/Layout";
import WorksPage from "./pages/WorksPage";
import AboutPage from "./pages/AboutPage";
import OptionsPage from "./pages/OptionsPage";
import ApiProvider from "./provider/ApiProvider";
import LoginPage from "./pages/LoginPage";
import AppRouter from "./AppRouter";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
      setCollapsed(!collapsed);
  };
  return (
      <ApiProvider>
          <div className="App">
             <AppRouter />
          </div>
      </ApiProvider>
  );
}

export default App;
