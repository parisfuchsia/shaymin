import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { TfiFaceSad } from "react-icons/tfi";

export const NotFound = () => {
    useEffect(() => {
        window.scrollTo({
            top: 0
        });
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="flex flex-col gap-2  fixed inset-0 justify-center items-center">
            <div className="flex flex-col absolute sm:left-20 top-20 left-10">
                <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                        <h1 className="text-5xl text-gray-800 dark:text-neutral-100 font-bold">
                            404 Error
                        </h1>
                        <h2 className="text-3xl text-gray-800 dark:text-neutral-100  font-bold">
                            Page not found
                        </h2>
                    </div>
                    <TfiFaceSad className="size-16 text-gray-800 dark:text-neutral-100" />
                </div>
                <p className="my-3 text-gray-800 dark:text-neutral-100">
                    Invalid URL Pathname
                </p>
                <NavLink
                    to="/"
                    className="underline cursor-pointer flex gap-2 items-center text-gray-800 dark:text-neutral-100"
                >
                    <IoReturnUpBack className="size-6 text-gray-800  dark:text-neutral-100" />
                    Head back home
                </NavLink>
            </div>
        </div>
    );
};
