import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../components/ui/pagination';

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export function PaginationControls({ currentPage, totalPages, setCurrentPage }: Props) {
  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevClick}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            aria-label="Previous page"
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;

          if (
            totalPages <= 7 ||
            index === 0 ||
            index === totalPages - 1 ||
            (index >= currentPage - 2 && index <= currentPage + 2)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(e, pageNumber)}
                  isActive={currentPage === pageNumber}
                  aria-label={`Go to page ${pageNumber}`}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (
            (index === currentPage - 3 && currentPage > 3) ||
            (index === currentPage + 3 && currentPage < totalPages - 3)
          ) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="text-muted-foreground px-2 text-sm" aria-hidden>
                  …
                </span>
              </PaginationItem>
            );
          }

          return null;
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNextClick}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            aria-label="Next page"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
