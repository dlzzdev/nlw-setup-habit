import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/UserContext";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  completedHabits: number;
  amountOfHabits: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  const { user } = useContext(Context);

  useEffect(() => {
    api
      .get("/summary", {
        params: {
          email: user!.email,
        },
      })
      .then((response) => {
        setSummary(response.data);
      });
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="text-zinc-400 text-xl font-bold w-10 h-10 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amountOfHabits={dayInSummary?.amountOfHabits}
                defaultCompletedHabits={dayInSummary?.completedHabits}
              />
            );
          })}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => {
            return (
              <div
                key={index}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-50 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}
