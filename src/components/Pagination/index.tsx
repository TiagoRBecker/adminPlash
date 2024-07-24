"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

/**
 * @type {React.FC<{
 * totalPages: number|string
 * pageParam?: string
 * }>}
 */
export const Pagination = ({
  totalPages = Number.MAX_SAFE_INTEGER,
  pageParam = "page",
}) => {
  const search = useSearchParams();

  const currentPage = Number(search.get(pageParam) || 1);
  totalPages = Number(totalPages);

  return (
    <nav className="flex gap-3">
      {currentPage <= 1 && (
        <span>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </span>
      )}
      {currentPage > 1 && (
        <Link href={`?page=${currentPage - 1}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
      )}
      <div className="w-full  flex gap-3 ">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <h3
            key={index}
              className={
                currentPage === pageNumber
                  ? "flex items-center justify-center border-[1px] border-gray-400 bg-gray-300 w-8 h-8 "
                  : "flex items-center justify-center border-[1px] border-gray-400 bg-white w-8 h-8"
              }
            >
              {pageNumber}
            </h3>
          );
        })}
      </div>
      {currentPage < totalPages && (
        <Link href={`?page=${currentPage + 1}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      )}
      {currentPage >= totalPages && (
        <span>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      )}
    </nav>
  );
};
