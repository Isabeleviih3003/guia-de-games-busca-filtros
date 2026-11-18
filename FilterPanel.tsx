import type { Genre, Platform } from "../types/game";
import "./filters.css";

interface Option {
    id: number;
    name: string;
    slug: string;
}

interface ChipGroupProps {
    label: string;
    allLabel: string;
    options: Option[];
    value: string;
    onChange: (slug: string) => void;
}

function ChipGroup({ label, allLabel, options, value, onChange }: ChipGroupProps) {
    return (
        <div>
            <p className="lbl">{label}</p>
            <div className="seg" role="group" aria-label={label}>
                <button
                    type="button"
                    className={value === "" ? "chip on" : "chip"}
                    aria-pressed={value === ""}
                    onClick={() => onChange("")}
                >
                    {allLabel}
                </button>
                {options.map((o) => (
                    <button
                        key={o.id}
                        type="button"
                        className={value === o.slug ? "chip on" : "chip"}
                        aria-pressed={value === o.slug}
                        onClick={() => onChange(o.slug)}
                    >
                        {o.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface FilterPanelProps {
    genres: Genre[];
    platforms: Platform[];
    genre: string;
    platform: string;
    resultCount: number;
    onGenreChange: (slug: string) => void;
    onPlatformChange: (slug: string) => void;
    onClear: () => void;
}

export default function FilterPanel({
    genres,
    platforms,
    genre,
    platform,
    resultCount,
    onGenreChange,
    onPlatformChange,
    onClear,
}: FilterPanelProps) {
    return (
        <section className="filterpanel" aria-label="Filtros">
            <ChipGroup
                label="Gênero"
                allLabel="Todos"
                options={genres}
                value={genre}
                onChange={onGenreChange}
            />
            <ChipGroup
                label="Plataforma"
                allLabel="Todas"
                options={platforms}
                value={platform}
                onChange={onPlatformChange}
            />
            <div className="filter-footer">
                <span>{resultCount} jogos</span>
                <button type="button" className="chip clear" onClick={onClear}>
                    Limpar filtros
                </button>
            </div>
        </section>
    );
}