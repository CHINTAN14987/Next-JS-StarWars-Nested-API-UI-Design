import { useRouter } from "next/router";
import React, { FC } from "react";
import { IPerson } from "../types";
import fetchData from "../api-utils/index";

interface IProps {
  data: IPerson
}
const Rooms: FC<IProps> = (props) => {

  const router = useRouter();
  const clickHandler = () => {
    router.push("/");
  };
  return (
    <div className="flex pt-20 justify-center cursor-pointer">
      <div className="w-[50%]">
        <div className="flex justify-between">
          <h3 className="font-extrabold text-5xl text-gray-900 mb-12">
            Character Details:-
          </h3>
          <button
            className="bg-gray-900 w-36 h-12 rounded-xl text-gray-300 font-extrabold text-lg"
            onClick={clickHandler}
          >
            Back
          </button>
        </div>
        <div className="mb-4 flex items-center gap-8 border-b pb-4 shadow-md">
          <span className="font-bold text-lg ">Name</span>
          <span className="font-bold text-3xl text-gray-700">
            {props.data.name}
          </span>
        </div>
        <div className="mb-4 flex items-center gap-8 border-b pb-4 shadow-md">
          <span className="font-bold text-lg">FilmoGraphy</span>
          <div className="flex flex-wrap gap-4 mt-4">
            {props.data?.films?.map((film: string, index: number) => {
              return (
                <span
                  className="bg-gray-200 py-4 px-6 rounded-full mr-2 mb-2 font-bold text-lg text-gray-700"
                  key={index}
                >
                  {film}
                </span>
              );
            })}
          </div>
        </div>
        <div className="mb-4 flex items-center gap-8 border-b py-6 shadow-md">
          <span className="font-bold text-lg">Gender</span>
          <span className="text-3xl text-gray-700 font-bold">
            {props.data?.gender}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-8 border-b pb-4 shadow-md">
          <span className="font-bold text-lg ">StarShips</span>
          <div className="flex flex-wrap gap-4 mt-4">
            {props?.data?.starships &&
              props?.data?.starships?.map((item: any) => {
                return (
                  <div className="bg-gray-200 py-4 px-6 rounded-full mr-2 mb-2 font-bold text-lg text-gray-700">
                    {item.name}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="mb-4 flex items-center gap-8 border-b pb-4 shadow-md">
          <span className="font-bold text-lg ">Vehicles</span>
          <div className="flex flex-wrap gap-4 mt-4">
            {props.data.vehicles &&
              props.data.vehicles?.map((item: any) => {
                return (
                  <div className="bg-gray-200 py-4 px-6 rounded-full mr-2 mb-2 font-bold text-lg text-gray-700">
                    {item.name}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context: any) {
  const data = await fetchData("https://swapi.dev/api/people/");
  const selectedCharacter = data.find((item) => {
    return item.id == context.params.character;
  });

  return {
    props: {
      data: {
        name: selectedCharacter?.name,
        films: selectedCharacter?.films,
        vehicles: selectedCharacter?.vehicles,
        starships: [...selectedCharacter?.starships],
        gender: selectedCharacter?.gender,
      },
    },
  };
}
export async function getStaticPaths() {
  const data = await fetchData("https://swapi.dev/api/people/");
  const paths = data.map((item: any) => ({
    params: { character: item.id.toString() },
  }));

  console.log(paths);
  return {
    paths: paths,
    fallback: false,
  };
}

export default Rooms;
