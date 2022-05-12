import {BrowserRouter, Redirect, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import WorksPage from "./pages/WorksPage";
import OptionsPage from "./pages/OptionsPage";
import SlidersPage from "./pages/SlidersPage";
import React from "react";
import {ApiContext} from "./provider/ApiProvider";

export default function AppRouter(){
    const {user} = React.useContext(ApiContext);
    return (
        <BrowserRouter>
            <Routes>
                {user ? (
                    <>
                        <Route exact path="/" element={<AboutPage />}/>
                        <Route exact path="/about" element={<AboutPage />} />
                        <Route exact path="/works" element={<WorksPage />} />
                        <Route exact path="/options" element={<OptionsPage />} />
                        <Route exact path="/sliders" element={<SlidersPage />} />

                    </>
                ) : (
                    <>
                        <Route exact path="/" element={<LoginPage />} />
                    </>
                )}

            </Routes>
        </BrowserRouter>
    )
}