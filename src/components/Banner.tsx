import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoPencil } from "react-icons/go";
import { changeTheme, getTheme } from "../state/themeSlice.ts";
import { RootState, AppDispatch } from "../state/store.ts";
import { BsThreeDotsVertical } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { FaArchive } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function Banner() {
    const dispatch = useDispatch<AppDispatch>();
    const { theme } = useSelector((state: RootState) => state.theme);

    const handleChangeTheme = (getValue: "light" | "dark"): void => {
        dispatch(changeTheme(getValue));
        localStorage.setItem("theme", getValue);
    };

    return (
        <div className=" w-full flex justify-between items-center px-3 py-6 sm:px-16 ">
            <NavLink
                to="/"
                className="text-gray-800 text-2xl font-bold dark:text-neutral-100"
            >
                Notes
            </NavLink>
            <div className="text-xs flex gap-4 items-center">
                <NavLink
                    to="/notes/new"
                    className="text-gray-600 dark:text-gray-300 text-3xl cursor-pointer"
                >
                    +
                </NavLink>
                <NavLink to="/archived">
                    <FaArchive className="text-gray-600 dark:text-gray-300 size-4 cursor-pointer" />
                </NavLink>

                <p
                    className="text-yellow-200 font-bold text-xs cursor-pointer"
                    onClick={() =>
                        handleChangeTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    {theme === "dark" ? (
                        <MdLightMode className="size-6" />
                    ) : (
                        <MdDarkMode className="size-6" />
                    )}
                </p>
            </div>
        </div>
    );
}
