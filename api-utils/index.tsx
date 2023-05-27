import { IPerson } from "../types";

const fetchData = async (value: string) => {
  const response = await fetch(value);
  const data = await response.json();


  const characterWithSpecies = await Promise.all(
    data.results.map(async (person: IPerson, index: number) => {
      if (person.species.length) {
        const response = await (await fetch(person.species)).json();

        return {
          ...person,
          species: response.name,
          id: index + 1,
        };
      }
      return { ...person, species: "", id: index + 1 };
    })
  );

  const charactersWithVehicles = await Promise.all(
    characterWithSpecies.map(async (person: any) => {
      if (person.vehicles.length) {
        const vehicleResponse = await Promise.all(
          person.vehicles.map(async (vehicle: string) => {
            const data = await (await fetch(vehicle)).json();

            return data;
          })
        );

        return {
          ...person,
          vehicles: vehicleResponse,
        };
      }
      return {
        ...person,
        vehicles: "",
      };
    })
  );

  const CharacterFilmoGraphy = await Promise.all(
    charactersWithVehicles.map(async (person: IPerson) => {
      if (person.films.length) {
        const filmsResponse = await Promise.all(
          person.films.map(async (filmUrl: string) => {
            const data = await (await fetch(filmUrl)).json();

            return data.title;
          })
        );

        return {
          ...person,
          films: filmsResponse,
        };
      }
      return {
        ...person,
        films: "",
      };
    })
  );
  // Fetching films data for each person

  const characterWithStarShips = await Promise.all(
    CharacterFilmoGraphy.map(async (person: IPerson) => {
      if (person.starships.length) {
        const response = await Promise.all(
          person.starships.map(async (starShip: string) => {
            const data = await (await fetch(starShip)).json();

            return data;
          })
        );

        return {
          ...person,
          starships: response,
        };
      }
      return {
        ...person,
        starships: "",
      };
    })
  );

  return characterWithStarShips;
};
export default fetchData;
