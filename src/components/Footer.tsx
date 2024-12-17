import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaReact } from "react-icons/fa6";
import { SiRedux } from "react-icons/si";
import { RiSupabaseLine } from "react-icons/ri";
import { ProjectLinks } from "../otherProjects.ts";
import StackIcon from "tech-stack-icons";

export const Footer = () => {
    type techStackObj = {
        name:
            | "HTML5"
            | "JavaScript"
            | "Tailwind CSS"
            | "Redux"
            | "React JS"
            | "Supabase"
            | "TypeScript";
        icon: React.JSX.element;
    };

    const techStack: techStackObj[] = [
        {
            name: "HTML5",
            icon: <StackIcon className="size-8" name="html5" />
        },
        {
            name: "JavaScript",
            icon: <StackIcon className="size-8" name="js" />
        },
        {
            name: "Tailwind CSS",
            icon: <StackIcon className="size-8" name="tailwindcss" />
        },
        {
            name: "TypeScript",
            icon: <StackIcon className="size-8" name="typescript" />
        },
        {
            name: "Redux",
            icon: <StackIcon className="size-8" name="redux" />
        },
        {
            name: "React JS",
            icon: <StackIcon className="size-8" name="reactjs" />
        },
        {
            name: "Supabase",
            icon: <StackIcon className="size-8" name="supabase" />
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center w-full text-neutral-100 py-6 flex flex-col sm:flex-row items-center gap-1 sm:gap-20 bg-gray-800 dark:bg-gray-900 text-sm"
        >
            <div className="text-center font-extrabold text-xl tracking-wide">
                Technologies used
                <div className="grid grid-cols-2 my-5 gap-y-2 gap-x-16">
                    {techStack.map(item => {
                        return (
                            <div className="flex font-medium gap-4 items-center">
                                {item.icon}
                                <p className="text-xs">{item.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="text-lg mb-5 sm:mt-3 flex flex-col items-center font-black tracking-wide">
                    Other Projects
                </p>
                <div className="flex flex-col  gap-2">
                    {ProjectLinks.map(project => (
                        <a
                            className="ml-5 active:underline cursor-pointer"
                            href={project.link}
                        >
                            {project.title}
                        </a>
                    ))}
                </div>
                <div className="flex gap-8 mt-10 mb-4 items-center">
                    <span className="flex gap-10 items-center">
                        <div className="flex gap-4 items-center">
                            <a href="https://github.com/parisfuchsia">
                                <FaGithub className="size-8 cursor-pointer" />
                            </a>
                            <a href="https://www.facebook.com/a.hopelieswithin?mibextid=ZbWKwL">
                                <FaFacebook className="size-8 cursor-pointer" />
                            </a>
                        </div>
                        <span>|</span>
                        <span className="text-base tracking-wide">
                            ©Parisfuchsia
                        </span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
