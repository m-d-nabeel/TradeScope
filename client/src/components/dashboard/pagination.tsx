import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  pageNumber,
  setPageNumber,
  totalPages,
}: {
  pageNumber: number;
  setPageNumber: (page: number) => void;
  totalPages: number;
}) {
  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
        disabled={pageNumber === 1}
        variant="outline"
      >
        <ChevronLeft className="mr-2" size={16} /> Previous
      </Button>
      <span className="text-sm text-gray-500">
        Page {pageNumber} of {totalPages}
      </span>
      <Button
        onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
        disabled={pageNumber === totalPages}
        variant="outline"
      >
        Next <ChevronRight className="ml-2" size={16} />
      </Button>
    </div>
  );
}
