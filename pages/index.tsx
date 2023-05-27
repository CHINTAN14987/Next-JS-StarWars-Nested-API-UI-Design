
import { useRouter } from "next/router";
import { useState } from "react";
import fetchData from "../api-utils/index"
import { IPerson } from "../types";

function HomePage({ data }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [listIndex, setListIndex] = useState(-1);
  const router = useRouter();
  const [filters, setFilters] = useState({
    movie: "",
    species: "",
    birthYearMin: "",
    birthYearMax: "",
  });
  const handleFilterChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredPeople = data.filter((person: any) => {
    const { movie, species, birthYearMin, birthYearMax } = filters;
    let isValid = true;
    if (movie && person.films.indexOf(movie) === -1) {
      isValid = false;
    }

    if (species && person.species !== species) {
      isValid = false;
    }

    if (
      birthYearMin &&
      person.birth_year &&
      (parseInt(person.birth_year) < parseInt(birthYearMin) ||
        parseFloat(person.birth_year) < parseFloat(birthYearMin))
    ) {
      isValid = false;
    }

    if (
      birthYearMax &&
      person.birth_year &&
      (parseInt(person.birth_year) > parseInt(birthYearMax) ||
        parseFloat(person.birth_year) > parseFloat(birthYearMax))
    ) {
      isValid = false;
    }

    return isValid;
  });
  const handleHover = () => {
    setIsHovered(true);
  };
  const handleClick = (value: number) => {
    router.push(`/${value}`);
  };

  return (
    <div className="px-8">
      <h3 className="font-extrabold text-5xl bg-blue-500 text-white py-4 px-6">
        Star Wars Characters:-
      </h3>
      <div className="mb-8 py-8 bg-blue-500 flex flex-wrap justify-start gap-10 px-8 sm:flex-col">
        <div>
          {/* dynamic data loading for Movies for Select Option*/}
          <label className="font-bold text-2xl text-white mr-2">Movies:</label>
          <select
            name="movie"
            className="mr-2 border border-gray-300 rounded-md px-2 py-2 w-52 outline-none bg-white"
            value={filters.movie}
            onChange={handleFilterChange}
          >
            <option value="" className="font-semibold text-slate-700 text-xl" >Select movies</option>
            {Array.from(
              new Set(
                ...data.map((listItems: IPerson) => {
                  return listItems.films;
                })
              )
            )?.map((option, index) => {
              return (
                <option key={index} value={option} className="font-semibold text-slate-700 text-xl">
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="font-bold mr-2 text-2xl text-white">Species:</label>
          {/* dynamic data loading for species for Select Option*/}
          <select
            className="mr-2 border border-gray-300 rounded-md px-2 py-2 w-52 outline-none bg-white"
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
          >
            <option value="" className="font-semibold text-slate-700 text-xl" >Select species</option>

            {Array.from(
              new Set([
                ...data.map((listItems: any) => {
                  return listItems.species;
                }),
              ])
            )?.map((option, index) => {
              return (
                <>
                  {option && (
                    <option key={index} value={option} className="font-semibold text-slate-700 text-xl ">
                      {option}
                    </option>
                  )}
                </>
              );
            })}
          </select>
        </div>
        <div className="flex sm:flex-col ">
          <label className="font-bold mr-2 text-2xl text-white">
            Birth Year Range:
          </label>
          <div>
            <input
              type="number"
              name="birthYearMin"
              placeholder="Min"
              value={filters.birthYearMin}
              onChange={handleFilterChange}
              className="mr-2 border border-gray-300 rounded-md px-2 py-1 mb-2"
            />

            <span className="mr-2 text-2xl text-white font-extrabold mb-2">
              -
            </span>
            <input
              type="number"
              name="birthYearMax"
              placeholder="Max"
              value={filters.birthYearMax}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
          </div>
        </div>
      </div>

      {filteredPeople?.length && (
        <div className="flex flex-col gap-8">
          {filteredPeople?.map((item: IPerson, index: number) => {
            return (
              <div
                className="flex bg-yellow-300 h-12 items-center cursor-pointer"
                onMouseEnter={() => {
                  handleHover();
                  setListIndex(index);
                }}
                onClick={() => {
                  handleClick(item.id);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setListIndex(-1);
                }}
                key={item.id}
              >
                <button
                  className={`bg-green-500 w-20 h-12 transform transition duration-300 text-2xl text-white font-extrabold ${isHovered && index === listIndex
                    ? "-rotate-12 -translate-y-2"
                    : "rotate-0"
                    }`}
                >
                  {item.id}
                </button>
                <h3 className="font-semibold text-slate-700 text-xl  px-8">
                  {item.name}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async () => {
  try {
    const data = await fetchData("https://swapi.dev/api/people/");
    return {
      props: { data: data },
    };
  } catch (error) {
    console.error(error);
  }
};

export default HomePage;
