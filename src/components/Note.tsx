import React, { useMemo, FC } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

interface TypeNote {
    item: {
        date: string;
        time: string;
        title: string;
        note: string;
        id: string;
        isArchived: boolean;
        isPinned: boolean;
    };
    chooseId: (getId: string) => void;
    variants: {
        hidden: {
            opacity: number;
        };
        animate: {
            opacity: number;
        };
    };
    isEditing: "pinned" | "plain" | "archived" | "";
    value: "pinned" | "plain" | "archived";
    selectedId: string[];
}

export const Note: FC<TypeNote> = ({
    item,
    chooseId,
    variants,
    isEditing,
    value,
    selectedId
}) => {
    const monthNames = useMemo(() => {
        return [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ] as const;
    }, []);

    type noteDateType = [number, number, number];

    const [year, month, date]: noteDateType = item.date.split("-").map(Number);

    const today = new Date();

    return (
        <motion.div
            variants={variants}
            className="flex gap-4 w-full overflow-x-hidden"
        >
            {isEditing === value && (
                <input
                    className="cursor-pointer"
                    checked={selectedId?.includes(item?.id)}
                    onChange={() => chooseId(item.id)}
                    type="checkbox"
                />
            )}
            <NavLink
                className="w-full"
                onClick={isEditing === value ? () => chooseId(item.id) : null}
                to={isEditing === value ? "" : `/notes/${item.id}`}
            >
                <div className="w-full cursor-pointer p-4 shadow-md bg-neutral-50 dark:bg-gray-900">
                    <div className="flex w-full flex-col gap-2">
                        <p className="text-xl w-11/12 truncate text-gray-800 dark:text-neutral-100">
                            {item.title || item.note}
                        </p>

                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                            {monthNames[month]} {date}, {year} | {item.time}
                        </p>
                    </div>
                </div>
            </NavLink>
        </motion.div>
    );
};
