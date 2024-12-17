import { useSelector, useDispatch } from "react-redux";
import "./App.css";

import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CircleLoader } from "react-spinners";
import { getTheme } from "./state/themeSlice.ts";
import Notes from "./pages/Notes.tsx";
import NewNote from "./pages/newNote.tsx";
import { Archived } from "./pages/Archived.tsx";
import { Footer } from "./components/Footer.tsx";
import { NotFound } from "./pages/NotFound.tsx";

function App() {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);

    useEffect(() => {
        dispatch(getTheme());
    }, []);

    return (
        <div className={` ${theme === "dark" && "dark"}`}>
            <div className="dark:bg-gray-800 bg-[#eceef1] w-full min-h-screen flex-col items-center justify-between flex">
                <div className="w-11/12 min-h-screen  flex flex-col items-center mb-7">
                    <Suspense fallback={<CircleLoader />}>
                        <Routes>
                            <Route path="/" element={<Notes />} />
                            <Route path="/notes/:id" element={<NewNote />} />
                            <Route path="/archived" element={<Archived />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </div>
                <div>
                    <div className="w-screen dark:bg-gray-900 bg-gray-300 h-[1px]"></div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default App;
