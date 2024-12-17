import React from "react";
import { NavLink } from "react-router-dom";

type TitleType = {
    id: string;
    title: string;
    note: string;
};

interface DropdownPropType {
    matchedResults: TitleType[];
    onClose: () => void;
    query: string;
}

export const Dropdown: React.forwardRef<HTMLDivElement, DropdownPropType> = (
    { matchedResults, onClose, query },
    { ref }
) => {
    return (
        <div className="rounded shadow-lg top-36 left-4 absolute w-11/12 bg-gray-300 text-gray-800 flex flex-col items-start">
            {matchedResults.length > 0 && query.length > 0
                ? matchedResults.map(item => {
                      return (
                          <NavLink
                              to={`/notes/${item.id}`}
                              key={item.id}
                              className=" w-full truncate "
                          >
                              <div
                                  ref={ref}
                                  className="py-2 flex cursor-pointer px-3 items-center flex justify-between w-full truncate"
                              >
                                  <p> {item.title || item.note}</p>
                                  <p className = "text-xs">
                                      {item.isPinned
                                          ? "Pinned"
                                          : item.isArchived
                                          ? "Archived"
                                          : "Note"}
                                  </p>
                              </div>
                          </NavLink>
                      );
                  })
                : query.length > 0 && (
                      <p className="text-gray-700 p-2 text-xs">
                          No results found
                      </p>
                  )}
        </div>
    );
};
