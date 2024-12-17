import React, {
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback
} from "react";
import Banner from "../components/Banner.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector as Select } from "react-redux";
import { RootState } from "../state/store.ts";
import { MdOutlineCheck } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { OptionModal } from "../components/OptionModal.tsx";
import { Note } from "../components/Note.tsx";
import { supabase } from "../supabaseClient.ts";
import { Dropdown } from "../components/Dropdown.tsx";
import { IoChevronBackOutline } from "react-icons/io5";

interface NoteType {
    title: string;
    note: string;
    date: string;
    time: string;
    isPinned: boolean;
    isArchived: boolean;
    id: string;
}

const variant = {
    hidden: {
        opacity: 0
    },
    animate: {
        opacity: 1
    }
};

const searchBarVariant = {
    hidden: {
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
        opacity: 0,
        transition: {
            duration: 0.5
        }
    },
    animate: {
        width: "100%",
        paddingRight: "8px",
        paddingLeft: "8px",
        opacity: 1,
        transition: {
            ease: "easeInOut",
            duration: 0.5
        }
    }
};

type TitleType = {
    title: string;
    id: string;
    note: string;
    isArchived: boolean, 
    isPinned: boolean
};

export default function Notes() {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<string>("");
    const [plainNotes, setPlainNotes] = useState<NoteType[]>([]);
    const [pinnedNotes, setPinnedNotes] = useState<NoteType[]>([]);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [titles, setTitles] = useState<object[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const { theme } = Select((state: RootState) => state.theme);

    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const fetchPinnedNotes = async (): Promise<void> => {
        const { data } = await supabase
            .from("secnote")
            .select("*")
            .eq("isPinned", true)
            .eq("isArchived", false);
        if (data) {
            setPinnedNotes(data as NoteType[]);
        }
    };

    const fetchAllTitle = async (): Promise<void> => {
        const { data } = await supabase
            .from("secnote")
            .select("title, id, note, isPinned, isArchived");
        if (data) {
            setTitles(data as TitleType[]);
        }
    };

    useEffect(() => {
        fetchAllTitle();
    }, [pinnedNotes, setPlainNotes]);

    const matchedResults = useMemo(() => {
        const handler: TitleType[] = titles?.filter(
            item =>
                item?.title
                    .toLowerCase()
                    .trim()
                    .indexOf(query.toLowerCase().trim()) !== -1 ||
                item?.note
                    ?.toLowerCase()
                    .trim()
                    .indexOf(query.toLowerCase().trim) !== -1
        );
        return handler.slice(0, 10);
    }, [query]);

    const fetchPlainNotes = async (): Promise<void> => {
        const { data } = await supabase
            .from("secnote")
            .select("*")
            .eq("isPinned", false)
            .eq("isArchived", false);
        if (data) {
            setPlainNotes(data as NoteType[]);
        }
    };

    const fetchAllNotes = useCallback(async (): Promise<void> => {
        setLoading(true);
        await fetchPinnedNotes();
        await fetchPlainNotes();
        setLoading(false);
    });

    useEffect((): void => {
        fetchAllNotes();
    }, []);

    const handleChange = (e): void => {
        setQuery(e.target.value);
        setIsDropdownOpen(true);
    };

    useEffect(() => {
        document.addEventListener("click", cancel);
        document.addEventListener("scroll", cancel);
        return () => {
            document.removeEventListener("click", () => {});
            document.removeEventListener("scroll", () => {});
        };
    }, []);

    const cancel = (): void => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
        } else {
            setIsDropdownOpen(false);
        }
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

    const handleSelectAll = (target: "pinned" | "plain"): void => {
        let allIdSelected: string[] = [];
        if (target === "pinned") {
            allIdSelected = pinnedNotes.reduce(
                (acc: string[], prev: NoteType) => {
                    acc.push(prev.id);
                    return acc;
                },
                []
            );
        } else {
            allIdSelected = plainNotes.reduce(
                (acc: string[], prev: NoteType) => {
                    acc.push(prev.id);
                    return acc;
                },
                []
            );
        }
        setSelectedId(allIdSelected);
        setIsAllSelected(true);
    };

    const handleEdit = (getType: "pinned" | "plain"): void => {
        setIsAllSelected(false);
        setIsEditing(getType);
        setSelectedId([]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col gap-3 items-center"
        >
            <AnimatePresence>
                {open && (
                    <OptionModal
                        setSelectedId={setSelectedId}
                        isEditing={isEditing}
                        fetchAll={fetchAllNotes}
                        setIsEditing={setIsEditing}
                        selectedId={selectedId}
                        onClose={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>
            <Banner />
            <motion.div
                variants={variant}
                initial="hidden"
                animate="animate"
                exit="hidden"
                className="w-11/12 sm:w-10/12 text-gray-800 dark:text-neutral-100 flex flex-col items-center gap-3"
            >
                <motion.div
                    variants={variant}
                    className="flex flex-col gap-1 w-full"
                >
                    <div className="flex gap-1 items-center">
                        <AnimatePresence>
                            {isSearchBarOpen && (
                                <motion.input
                                    variants={searchBarVariant}
                                    initial="hidden"
                                    animate="animate"
                                    exit="hidden"
                                    className="rounded py-2 w-full rescolor"
                                    placeholder="Search keywords here..."
                                    type="text"
                                    value={query}
                                    onChange={handleChange}
                                />
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsSearchBarOpen(prev => !prev)}
                            className="p-[6px] cursor-pointer rounded rescolor"
                        >
                            {isSearchBarOpen ? (
                                <IoChevronBackOutline className="p-1 size-7 " />
                            ) : (
                                <CiSearch className="p-1 size-7" />
                            )}
                        </button>
                    </div>
                    {isDropdownOpen && (
                        <Dropdown
                            onClose={() => setIsDropdownOpen(false)}
                            ref={dropdownRef}
                            matchedResults={matchedResults}
                            query={query}
                        />
                    )}
                    <div className="flex justify-between h-6 items-center">
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Pinned
                        </p>
                        {loading ? (
                            <MoonLoader
                                size="14"
                                color={theme === "dark" ? "#ffffff" : "#000000"}
                            />
                        ) : isEditing === "pinned" ? (
                            <div className="flex items-center gap-4">
                                <button
                                    className="text-gray-600 text-sm cursor-pointer dark:text-gray-300"
                                    onClick={
                                        isAllSelected
                                            ? () => {
                                                  setSelectedId([]);
                                                  setIsAllSelected(false);
                                              }
                                            : () => handleSelectAll("pinned")
                                    }
                                >
                                    {isAllSelected
                                        ? "Deselect All"
                                        : "Select All"}
                                </button>
                                <MdOutlineCheck
                                    className="text-gray-600 cursor-pointer dark:text-gray-300 size-5"
                                    onClick={
                                        selectedId?.length > 0
                                            ? () => setOpen(true)
                                            : () => setIsEditing("")
                                    }
                                />
                            </div>
                        ) : pinnedNotes?.length > 0 ? (
                            <BsThreeDotsVertical
                                className="text-gray-600 dark:text-gray-300 cursor-pointer"
                                onClick={() => handleEdit("pinned")}
                            />
                        ) : (
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                No notes
                            </p>
                        )}
                    </div>
                    <motion.div className="w-full flex my-2 flex-col gap-2">
                        {pinnedNotes?.length > 0 ? (
                            pinnedNotes
                                .slice()
                                .reverse()
                                .map(item => (
                                    <Note
                                        key={item.id}
                                        item={item}
                                        isEditing={isEditing}
                                        value="pinned"
                                        selectedId={selectedId}
                                        chooseId={chooseId}
                                        variants={variant}
                                    />
                                ))
                        ) : (
                            <hr className="bg-black" />
                        )}
                    </motion.div>
                </motion.div>
                <motion.div
                    variants={variant}
                    className="flex flex-col gap-1 w-full"
                >
                    <div className="flex w-full justify-between items-center h-6">
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Notes
                        </p>{" "}
                        {loading ? (
                            <MoonLoader
                                size="14"
                                color={theme === "dark" ? "#ffffff" : "#000000"}
                            />
                        ) : isEditing === "plain" ? (
                            <div className="flex gap-2 gap-4 items-center">
                                <button
                                    className="cursor-pointer text-gray-600 text-sm dark:text-gray-300"
                                    onClick={
                                        isAllSelected
                                            ? () => {
                                                  setSelectedId([]);
                                                  setIsAllSelected(false);
                                              }
                                            : () => handleSelectAll("plain")
                                    }
                                >
                                    {isAllSelected
                                        ? "Deselect All"
                                        : "Select All"}
                                </button>{" "}
                                <MdOutlineCheck
                                    className="size-5 text-gray-600 cursor-pointer dark:text-gray-300"
                                    onClick={
                                        selectedId?.length > 0
                                            ? () => setOpen(true)
                                            : () => setIsEditing("")
                                    }
                                />{" "}
                            </div>
                        ) : plainNotes?.length > 0 ? (
                            <BsThreeDotsVertical
                                className="cursor-pointer text-gray-600 dark:text-gray-300"
                                onClick={() => handleEdit("plain")}
                            />
                        ) : (
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                No notes
                            </p>
                        )}
                    </div>
                    <motion.div
                        variants={variant}
                        initial="hidden"
                        animate="animate"
                        exit="hidden"
                        className="w-full flex my-2 flex-col gap-2"
                    >
                        {plainNotes?.length > 0 ? (
                            plainNotes
                                .slice()
                                .reverse()
                                .map(item => (
                                    <Note
                                        key={item.id}
                                        item={item}
                                        selectedId={selectedId}
                                        isEditing={isEditing}
                                        value="plain"
                                        chooseId={chooseId}
                                        variants={variant}
                                    />
                                ))
                        ) : (
                            <hr className="bg-black" />
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
