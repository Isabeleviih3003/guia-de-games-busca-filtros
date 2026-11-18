import "./filters.css";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = "Buscar jogo pelo nome",
}: SearchBarProps) {
    return (
        <div className="searchbar">
            <label htmlFor="search" className="sr-only">
                Buscar jogo
            </label>
            <input
                id="search"
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}