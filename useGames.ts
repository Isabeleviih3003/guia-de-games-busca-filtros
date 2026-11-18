import { useEffect, useState } from "react";
import type { Game, Genre, Platform } from "../types/game";

const API = "https://api.rawg.io/api";
const KEY = import.meta.env.VITE_RAWG_KEY as string;

interface Paged<T> {
    results: T[];
}

const FALLBACK_GENRES: Genre[] = [
    { id: 4, name: "Ação", slug: "action" },
    { id: 5, name: "RPG", slug: "role-playing-games-rpg" },
    { id: 3, name: "Aventura", slug: "adventure" },
    { id: 2, name: "Tiro", slug: "shooter" },
    { id: 10, name: "Estratégia", slug: "strategy" },
];

const FALLBACK_PLATFORMS: Platform[] = [
    { id: 1, name: "PC", slug: "pc" },
    { id: 2, name: "PlayStation", slug: "playstation" },
    { id: 3, name: "Xbox", slug: "xbox" },
    { id: 7, name: "Nintendo", slug: "nintendo" },
];

const FALLBACK_GAMES: Game[] = [
    {
        id: 1,
        name: "The Witcher 3: Wild Hunt",
        slug: "the-witcher-3-wild-hunt",
        background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        rating: 4.7,
        released: "2015-05-18",
        genres: [
            { id: 4, name: "Ação", slug: "action" },
            { id: 5, name: "RPG", slug: "role-playing-games-rpg" },
        ],
        parent_platforms: [
            { platform: { id: 1, name: "PC", slug: "pc" } },
            { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
            { platform: { id: 3, name: "Xbox", slug: "xbox" } },
            { platform: { id: 7, name: "Nintendo", slug: "nintendo" } },
        ],
    },
    {
        id: 2,
        name: "God of War",
        slug: "god-of-war-2",
        background_image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
        rating: 4.6,
        released: "2018-04-20",
        genres: [
            { id: 4, name: "Ação", slug: "action" },
            { id: 3, name: "Aventura", slug: "adventure" },
        ],
        parent_platforms: [
            { platform: { id: 1, name: "PC", slug: "pc" } },
            { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
        ],
    },
    {
        id: 3,
        name: "Red Dead Redemption 2",
        slug: "red-dead-redemption-2",
        background_image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
        rating: 4.6,
        released: "2018-10-26",
        genres: [
            { id: 4, name: "Ação", slug: "action" },
            { id: 3, name: "Aventura", slug: "adventure" },
        ],
        parent_platforms: [
            { platform: { id: 1, name: "PC", slug: "pc" } },
            { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
            { platform: { id: 3, name: "Xbox", slug: "xbox" } },
        ],
    },
    {
        id: 4,
        name: "Cyberpunk 2077",
        slug: "cyberpunk-2077",
        background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
        rating: 4.2,
        released: "2020-12-10",
        genres: [
            { id: 4, name: "Ação", slug: "action" },
            { id: 5, name: "RPG", slug: "role-playing-games-rpg" },
            { id: 2, name: "Tiro", slug: "shooter" },
        ],
        parent_platforms: [
            { platform: { id: 1, name: "PC", slug: "pc" } },
            { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
            { platform: { id: 3, name: "Xbox", slug: "xbox" } },
        ],
    },
    {
        id: 5,
        name: "The Legend of Zelda: Breath of the Wild",
        slug: "the-legend-of-zelda-breath-of-the-wild",
        background_image: "https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg",
        rating: 4.7,
        released: "2017-03-03",
        genres: [
            { id: 4, name: "Ação", slug: "action" },
            { id: 3, name: "Aventura", slug: "adventure" },
        ],
        parent_platforms: [{ platform: { id: 7, name: "Nintendo", slug: "nintendo" } }],
    },
    {
        id: 6,
        name: "Civilization VI",
        slug: "sid-meiers-civilization-vi",
        background_image: "https://media.rawg.io/media/games/997/997ab4d67e96fb20a4092383477d4463.jpg",
        rating: 4.1,
        released: "2016-10-21",
        genres: [{ id: 10, name: "Estratégia", slug: "strategy" }],
        parent_platforms: [
            { platform: { id: 1, name: "PC", slug: "pc" } },
            { platform: { id: 7, name: "Nintendo", slug: "nintendo" } },
        ],
    },
];

async function get<T>(
    path: string,
    params: Record<string, string>,
    signal: AbortSignal
): Promise<T> {
    if (!KEY) throw new Error("Chave da API ausente");
    const qs = new URLSearchParams({ key: KEY, ...params });
    const res = await fetch(`${API}${path}?${qs}`, { signal });
    if (!res.ok) throw new Error(`Erro ${res.status} ao buscar dados da RAWG`);
    return res.json() as Promise<T>;
}

/** Consome a API RAWG com fallback local caso a requisição falhe. */
export function useGames(search: string) {
    const [games, setGames] = useState<Game[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            get<Paged<Genre>>("/genres", {}, controller.signal),
            get<Paged<Platform>>("/platforms/lists/parents", {}, controller.signal),
        ])
            .then(([g, p]) => {
                setGenres(g.results);
                setPlatforms(p.results);
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setGenres(FALLBACK_GENRES);
                    setPlatforms(FALLBACK_PLATFORMS);
                }
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        const term = search.trim().toLowerCase();
        const timer = setTimeout(() => {
            get<Paged<Game>>(
                "/games",
                term ? { page_size: "40", search: term } : { page_size: "40", ordering: "-added" },
                controller.signal
            )
                .then((d) => setGames(d.results))
                .catch(() => {
                    if (!controller.signal.aborted) {
                        const local = term
                            ? FALLBACK_GAMES.filter((g) => g.name.toLowerCase().includes(term))
                            : FALLBACK_GAMES;
                        setGames(local);
                        setError(null);
                    }
                })
                .finally(() => {
                    if (!controller.signal.aborted) setLoading(false);
                });
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search]);

    return { games, genres, platforms, loading, error };
}