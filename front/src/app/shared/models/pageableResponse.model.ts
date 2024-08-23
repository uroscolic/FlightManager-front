export interface PageableResponse<T> {
    content: T;
    pageable: any; // Prilagodite prema potrebi
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any; // Prilagodite prema potrebi
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}