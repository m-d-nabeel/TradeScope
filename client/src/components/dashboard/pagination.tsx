import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent({
  pageNumber,
  setPageNumber,
  totalPages,
}: {
  pageNumber: number;
  setPageNumber: (page: number) => void;
  totalPages: number;
}) {
  return (
    <Pagination>
      <PaginationContent className="flex justify-between items-center">
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
          />
        </PaginationItem>

        {pageNumber > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationLink
              onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
            >
              {pageNumber - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{pageNumber}</PaginationLink>
        </PaginationItem>
        <PaginationItem className="cursor-pointer">
          <PaginationLink
            onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
          >
            {pageNumber + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
