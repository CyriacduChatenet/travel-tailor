import { Day } from "@travel-tailor/types";
import { Dispatch, FC, SetStateAction } from "react";

interface IProps {
    days: Day[];
    dayCurrent: Date;
    setDay: Dispatch<SetStateAction<Date>>
}

export const DayNavbar: FC<IProps> = ({ days, dayCurrent, setDay, }) => {
    return (
        <section className="my-2 xl:my-8 ">
            {
                days.map((day: Day, index) => <button
                key={index}
                onClick={() => setDay(day?.date)}
                className={`py-2 px-4 rounded mr-2 mb-2 ${day.date === dayCurrent ? 'bg-cyan-600 text-white' : 'text-black bg-gray-100'} hover:bg-cyan-500 hover:text-white`}
              >
                {new Date(day?.date).toLocaleDateString('fr')}
              </button>)
            }
        </section>
    );
};