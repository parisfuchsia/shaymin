import React, { useMemo, useRef, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { BsClipboard2Fill, BsClipboard2CheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";
import { IoReturnUpBack } from "react-icons/io5";
import { supabase } from "../supabaseClient.ts";
import { FaCheck } from "react-icons/fa6";
import { MoonLoader } from "react-spinners";
import { GoAlertFill } from "react-icons/go";
import { v4 } from "uuid";

interface FormatType {
    title: string;
    note: string;
    date: string;
    time: string;
    id: string;
}

interface ParamsType {
    id: string | "new" | undefined;
}

interface EventType {
    name: string;
    value: string;
}

export default function NewNote() {
    const today = new Date();
    const nav = useNavigate();
    const { theme } = useSelector((state: RootState) => state.theme);

    const [loading, setLoading] = useState<boolean>(false);
    const [format, setFormat] = useState<FormatType>({
        title: "",
        note: "",
        date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
        time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
        id: v4()
    });
    const [errorIndicator, setErrorIndicator] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const { id } = useParams<ParamsType>();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSetHeight = (): void => {
        const textRef = textAreaRef.current;
        textRef.focus();
        textRef.style.height = "auto";
        textRef.style.height = `${textRef.scrollHeight}px`;
    };

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

    useEffect((): void => {
        if (id === "new") {
            handleSetHeight();
        } else {
            setLoading(true);
            const fetchDetail = async (): Promise<void> => {
                const { data, error } = await supabase
                    .from("secnote")
                    .select()
                    .eq("id", id)
                    .single();
                if (data) {
                    setFormat({
                        title: data.title,
                        note: data.note,
                        date: data.date,
                        time: data.time,
                        id: data.id
                    });
                    setLoading(false);
                } else if(error) {
                    setLoading(false);
                    setErrorIndicator(true);
                    setFormat({
                        title: "",
                        note: "",
                        date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                        time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
                        id: v4()
                    });
                }
            };
            fetchDetail();
        }
    }, [id]);

    const handleCopy = (): void => {
        navigator.clipboard.writeText(format.note);
        setIsCopied(true);
        setTimeout((): void => {
            setIsCopied(false);
        }, 1000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormat((prev: FormatType) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleAddNote = async (): Promise<void> => {
        if (format.note.length > 0 && id === "new") {
            await supabase.from("secnote").insert(format);
            nav("/");
        } else if (format.note.length > 0) {
            await supabase
                .from("secnote")
                .update({
                    ...format,
                    date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                    time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
                })
                .eq("id", format.id);
            nav("/");
        }
    };

    const goBack = (): void => {
        nav("/");
    };

    useEffect(() => {
        if (loading || errorIndicator) {
            document.body.style.overflow = "hidden";
            window.scrollTo({
              top:0
            })
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [loading, errorIndicator]);

    const retry = (): void => {
        window.location.reload();
    };

    type DateType = [number, number, number];
    const [year, month, date]: DateType = format.date.split("-").map(Number);

    if (loading) {
        return (
            <div className="my-8 fixed inset-0 flex justify-center items-center">
                <MoonLoader
                    size="28"
                    color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-11/12 sm:w-8/12 flex flex-col gap-3 mt-5"
        >
            {errorIndicator&& (
                <div className="bg-[#00000080] fixed inset-0 justify-center items-center flex ">
                    <div className="bg-red-500 w-11/12 rounded-lg text-neutral-100 p-8 gap-4 flex flex-col">
                        <div className="flex justify-center">
                            <GoAlertFill className="size-6" />
                        </div>
                        <p>
                            Unable to load Note ID{" "}
                            <span className="underline">{id}</span>
                        </p>
                        <div>
                            <p className="text-sm">Options:</p>
                            <div className="flex gap-4 underline">
                                <NavLink to="/" className="cursor-pointer">
                                    Head back home
                                </NavLink>
                                <button
                                    className="cursor-pointer"
                                    onClick={retry}
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-col w-full">
                    <div className="flex w-full justify-between">
                        <IoReturnUpBack
                            className="size-8 cursor-pointer text-gray-800 dark:text-neutral-100"
                            onClick={goBack}
                        />

                        <FaCheck
                            onClick={handleAddNote}
                            className={`size-6 ${
                                format?.note?.length > 0
                                    ? " text-gray-800 cursor-pointer dark:text-neutral-100 "
                                    : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                    </div>
                    <input
                        onChange={handleChange}
                        name="title"
                        placeholder="Input title"
                        value={format.title}
                        className="bg-[#eceef1]  cursor-pointer text-gray-800 dark:text-neutral-100 dark:bg-gray-800 h-16 text-2xl focus:outline-none"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {id === "new"
                            ? `${
                                  monthNames[today.getMonth()]
                              } ${today.getDate()}, ${today.getFullYear()} | ${today.getHours()}:${today.getMinutes()}`
                            : `${monthNames[month]} ${date}, ${year} | ${format.time} `}
                    </p>
                    {!isCopied ? (
                        <BsClipboard2Fill
                            onClick={format.note !== "" ? handleCopy : null}
                            className={`${
                                format.note !== ""
                                    ? "cursor-pointer dark:text-neutral-100 text-gray-800"
                                    : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                    ) : (
                        <p className="dark:text-neutral-100 text-xs text-gray-800">
                            Copied
                        </p>
                    )}
                </div>
            </div>
            <textarea
                onInput={handleSetHeight}
                value={format.note}
                onChange={handleChange}
                name="note"
                ref={textAreaRef}
                placeholder="Write down your notes here..."
                rows="25"
                className="p-1 focus:outline-none text-gray-800 dark:text-neutral-100 bg-[#eceef1]  dark:bg-gray-800"
            />
        </motion.div>
    );
}
