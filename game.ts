export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface Platform {
    id: number;
    name: string;
    slug: string;
}

export interface Game {
    id: number;
    name: string;
    slug: string;
    background_image: string | null;
    rating: number;
    released: string | null;
    genres: Genre[];
    parent_platforms?: { platform: Platform }[];
}