import { useMemo, useState } from "react";
import { useGames } from "./useGames";

/** Lógica de busca + filtros que a Home usa. */
export function useGameFilters() {
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState(""); // slug do gênero ("" = todos)
    const [platform, setPlatform] = useState(""); // slug da plataforma ("" = todas)

    const { games, genres, platforms, loading, error } = useGames(search);

    // Filtra por gênero e plataforma sem refazer a conta a cada render
    const filteredGames = useMemo(
        () =>
            games.filter(
                (g) =>
                    (!genre || g.genres.some((x) => x.slug === genre)) &&
                    (!platform || g.parent_platforms?.some((p) => p.platform.slug === platform))
            ),
        [games, genre, platform]
    );

    const clearFilters = () => {
        setSearch("");
        setGenre("");
        setPlatform("");
    };

    return {
        search,
        genre,
        platform,
        setSearch,
        setGenre,
        setPlatform,
        clearFilters,
        genres,
        platforms,
        games: filteredGames,
        loading,
        error,
    };
}