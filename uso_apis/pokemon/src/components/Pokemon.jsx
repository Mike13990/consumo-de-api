import { useEffect, useState } from "react";

function Pokemon() {
    const [pokemon, setPokemon] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function obtenerPokemon() {
            try {
                // obtener listado de 20 pokemon
                const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon");
                const listado = await respuesta.json();
                
                // contenido de cada pokemon
                const datos = await Promise.all(
                    listado.results.map(async (poke) => {
                        const resPokemon = await fetch(poke.url);
                        const infoPokemon = await resPokemon.json();
                        const resEspecie = await fetch(infoPokemon.species.url);
                        const especie = await resEspecie.json();
                        
                        const descripcion = especie.flavor_text_entries.find(
                            texto => texto.language.name === "es"
                        );
                        
                        return {
                            id: infoPokemon.id,
                            nombre: infoPokemon.name,
                            imagen: infoPokemon.sprites.other["official-artwork"].front_default,
                            descripcion: descripcion 
                                ? descripcion.flavor_text.replace(/\f/g, " ") 
                                : "pokemon sin descripcion"
                        };
                    })
                );
                
                setPokemon(datos);
                setCargando(false);
            } catch {
                setError("no fue posible obtener la informacion");
                setCargando(false);
            }
        }
        
        obtenerPokemon();
    }, []);

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="grid">
            {pokemon.map((poke) => (
                <div className="card" key={poke.id}>
                    <img src={poke.imagen} alt={poke.nombre} width="180" />
                    <h2>{poke.nombre.toUpperCase()}</h2>
                    <p><strong>NO. </strong>{poke.id}</p>
                    <p>{poke.descripcion}</p>
                </div>
            ))}
        </div>
    );
}

export default Pokemon;