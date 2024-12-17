import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient.ts";
import { FaArchive } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RootState } from "../state/store.ts";
import { MdOutlineCheck } from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import { OptionModal } from "../components/OptionModal.tsx";
import { Note } from "../components/Note.tsx";
import { MoonLoader } from "react-spinners";
import { useSelector } from "react-redux";

type TypeVariant = {
    initial: {
        opacity: number;
    };
    animate: {
        opacity: number;
    };
    exit: {
        opacity: number;
    };
};

const variant: TypeVariant = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    },
    exit: {
        opacity: 0
    }
};

export const Archived = () => {
    type TypeNote = {
        title: string;
        note: string;
        date: string;
        time: string;
        isPinned: boolean;
        isArchived: boolean;
        id: string;
    };

    const [archivedNotes, setArchivedNotes] = useState<TypeNote[]>([]);
    const [isEditing, setIsEditing] = useState<"archived" | "">("");
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useSelector((state: RootState) => state.theme);

    const getArchived = async (): Promise<void> => {
        setLoading(true);
        const { data } = await supabase
            .from("secnote")
            .select("*")
            .eq("isArchived", true);
        if (data) {
            setArchivedNotes(data as TypeNote[]);
            setLoading(false);
        }
    };

    useEffect((): void => {
        getArchived();
    }, []);

    const chooseId = (getId: string): void => {
        let cpySelectedId: string[] = [...selectedId];
        const idIndex: number = cpySelectedId.indexOf(getId);
        if (idIndex > -1) {
            cpySelectedId.splice(idIndex, 1);
        } else {
            cpySelectedId.push(getId);
        }
        setSelectedId(cpySelectedId);
    };

    const monthNames: TypeMonthNames = useMemo(() => {
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

    const nav = useNavigate();

    const goBack = (): void => {
        nav(-1);
    };

    const handleSelectAll = (): void => {
        const allIdSelected: string[] = archivedNotes.reduce(
            (acc: string[], prev: TypeNote) => {
                acc.push(prev.id);
                return acc;
            },
            []
        );

        setSelectedId(allIdSelected);
        setIsAllSelected(true);
    };

    const handleClose = (): void => {
        setIsAllSelected(false);
        setIsOpen(false);
    };

    return (
        <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {isOpen && (
                    <OptionModal
                        selectedId={selectedId}
                        setIsEditing={setIsEditing}
                        setSelectedId={setSelectedId}
                        onClose={handleClose}
                        fetchAll={getArchived}
                        isEditing={isEditing}
                    />
                )}
            </AnimatePresence>
            <div className="text-gray-800 dark:text-neutral-100 px-3 py-6 sm:px-16 items-center text-xl flex justify-center w-full">
                <div className="w-full flex justify-between items-center gap-3 ">
                    <div className="flex gap-2">
                        <IoReturnUpBack
                            onClick={goBack}
                            className="size-8 cursor-pointer"
                        />
                        <NavLink
                            className="active:underline cursor-pointer"
                            to="/"
                        >
                            Notes/Archive
                        </NavLink>
                    </div>
                    {isEditing === "archived" ? (
                        <div className="flex items-center gap-4">
                            <button
                                className="text-gray-600 cursor-pointer text-sm dark:text-gray-300"
                                onClick={
                                    isAllSelected
                                        ? () => {
                                              setSelectedId([]);
                                              setIsAllSelected(false);
                                          }
                                        : handleSelectAll
                                }
                            >
                                {isAllSelected ? "Deselect All" : "Select All"}
                            </button>
                            <MdOutlineCheck
                                className="text-gray-600 dark:text-gray-300 size-6 cursor-pointer"
                                onClick={
                                    selectedId?.length > 0
                                        ? () => setIsOpen(true)
                                        : () => setIsEditing("")
                                }
                            />
                        </div>
                    ) : (
                        archivedNotes?.length > 0 && (
                            <BsThreeDotsVertical
                                className="text-gray-600 cursor-pointer dark:text-gray-300"
                                onClick={() => setIsEditing("archived")}
                            />
                        )
                    )}
                </div>
            </div>
            <motion.div
                variants={variant}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col min-h-[85vh] my-5 w-full sm:w-10/12 items-center gap-2"
            >
                {loading ? (
                    <MoonLoader
                        size="16"
                        color={theme === "dark" ? "#FFFFFF" : "#000000"}
                    />
                ) : archivedNotes?.length > 0 ? (
                    archivedNotes
                        .slice()
                        .reverse()
                        .map(item => {
                            return (
                                <Note
                                    item={item}
                                    chooseId={chooseId}
                                    variants={variant}
                                    isEditing={isEditing}
                                    value="archived"
                                    selectedId={selectedId}
                                />
                            );
                        })
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                        Your archive is empty.
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
};
