import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import React, { useState } from "react";

type TProps = {
    setPage: (page: number) => void;
    totalPage: number;
};

const TablePagination = ({ setPage, totalPage }: TProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setPage(page);
    };

    return (
        <div className="flex justify-center items-center mt-4 w-full">
            <Pagination className="flex items-center gap-2">
                <PaginationItem className="list-none">
                    <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    />
                </PaginationItem>
                {
                    [...Array(totalPage)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <PaginationItem key={index} className="list-none">
                                <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 rounded-md hover:bg-primary-foreground hover:text-primary-background ${currentPage === page
                                        ? "bg-primary-foreground text-primary-background"
                                        : ""
                                        }`}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                }
                <PaginationEllipsis />
                <PaginationItem className="list-none">
                    <PaginationNext
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPage))}
                    />
                </PaginationItem>
            </Pagination>
        </div>
    );
};

export default TablePagination;
