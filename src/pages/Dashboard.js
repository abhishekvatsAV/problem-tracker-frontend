import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { BarList, BarListSeries } from "reaviz";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";
import { LoadingOutlined } from "@ant-design/icons";
import { BASE_URL } from "../services/helper";

const Dashboard = () => {
  const today = new Date();
  const apiUrl = BASE_URL;
  const [heatmapCalendarData, setHeatmapCalendarData] = useState([]);
  const [easyProblems, setEasyProblems] = useState([]);
  const [mediumPoblems, setMediumPoblems] = useState([]);
  const [hardProblems, setHardProblems] = useState([]);
  const [allproblems, setAllProblems] = useState([]);
  const [todayProblems, setTodayProblems] = useState([]);
  const [monthProblems, setMonthProblems] = useState([]);
  const [weekProblems, setWeekProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let user = localStorage.getItem("user");
  user = JSON.parse(user);

  useEffect(() => {
    const bargraph = async () => {
      try {
        // for hard problems
        let hProblems = [...allproblems];
        hProblems = hProblems.filter((prob) => {
          if (prob.difficulty === "Hard") return true;
          return false;
        });
        setHardProblems([...hProblems]);

        // for medium problems
        let mProblems = [...allproblems];
        mProblems = mProblems.filter((prob) => {
          if (prob.difficulty === "Medium") return true;
          return false;
        });
        setMediumPoblems([...mProblems]);

        // for easy problems
        let eProblems = [...allproblems];
        eProblems = eProblems.filter((prob) => {
          if (prob.difficulty === "Easy") return true;
          return false;
        });

        setEasyProblems([...eProblems]);

      } catch (error) {
        console.log("error : ", error);
      }
    };

    const gettodayProb = async () => {
      let date = today.toLocaleDateString();
      let todayProbs = allproblems.filter((prob) => {
        if (prob.date === date) return true;
        return false;
      });
      setTodayProblems([...todayProbs]);
    };
    gettodayProb();
    bargraph();
    // eslint-disable-next-line
  },[allproblems]);

  useEffect(() => {
    const getAllProblems = async () => {
      setIsLoading(true);
      let problems = await axios(`${apiUrl}/problems/getAllProblems`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setIsLoading(false);
      setAllProblems([...problems.data]);

      // for week data
      let allweekProblems = problems.data;
      let startWeekDate = new Date();
      startWeekDate.setDate(startWeekDate.getDate() - 7);
      startWeekDate = startWeekDate.getTime();
      let currDate = new Date().getTime();
      allweekProblems = allweekProblems.filter((prob) => {
        let [day, month, year] = prob.date.split("/");
        // Months in JavaScript are zero-based, so subtract 1 from the month value
        let date = new Date(year, month - 1, day);
        date = date.getTime();
        if (date >= startWeekDate && date <= currDate) {
          return true;
        }
        return false;
      });
      setWeekProblems([...allweekProblems]);

      // for month data
      let allmonthProblems = problems.data;
      let startMonthDate = new Date();
      startMonthDate.setDate(startMonthDate.getDate() - 30);
      startMonthDate = startMonthDate.getTime();
      currDate = new Date().getTime();
      allmonthProblems = allmonthProblems.filter((prob) => {
        let [day, month, year] = prob.date.split("/");
        // Months in JavaScript are zero-based, so subtract 1 from the month value
        let date = new Date(year, month - 1, day);
        date = date.getTime();
        if (date >= startMonthDate && date <= currDate) {
          return true;
        }
        return false;
      });
      setMonthProblems([...allmonthProblems]);

      // for year heatmap data
      let allYearProblems = problems.data;
      let startYearDate = new Date();
      startYearDate.setDate(startYearDate.getDate() - 365);
      startYearDate = startYearDate.getTime();

      let finalArr = [];
      let map = new Map();
      allYearProblems.map((prob) => {
        let [day, month, year] = prob.date.split("/");
        // Months in JavaScript are zero-based, so subtract 1 from the month value
        let date = new Date(year, month - 1, day);
        date = date.getTime();

        if (date <= currDate && date >= startYearDate) {
          if (map.has(date)) {
            // map[date]++;
            let temp = map.get(date);
            map.set(date, temp + 1);
          } else {
            // map[date] = 1;
            map.set(date, 1);
          }
        }
        return null;
      });

      let sDate = new Date();
      sDate.setDate(sDate.getDate() - 364);
      let sdateStr = sDate.toLocaleDateString();
      let sdateParts = sdateStr.split("/");
      sdateStr = [
        sdateParts[1].padStart(2, "0"),
        sdateParts[0].padStart(2, "0"),
        sdateParts[2],
      ].join("/");

      let eDate = new Date();
      let edateStr = eDate.toLocaleDateString();
      let edateParts = edateStr.split("/");
      edateStr = [
        edateParts[1].padStart(2, "0"),
        edateParts[0].padStart(2, "0"),
        edateParts[2],
      ].join("/");

      const startDate = new Date(sdateStr);
      const endDate = new Date(edateStr);

      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        let formattedDate = `${month}/${day}/${year}`;
        formattedDate = new Date(formattedDate).getTime();
        if (!map.has(formattedDate)) {
          map.set(formattedDate, 0);
        }
      }

      for (let [key, value] of map) {
        finalArr.push({
          date: key,
          count: value,
        });
      }

      setHeatmapCalendarData([...finalArr]);
    };

    getAllProblems();
    // eslint-disable-next-line
  }, []);

  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  return (
    <div className="dashBoard min-h-screen">
      <div className="flexBox">
        <div className="heatMap md:w-[80%]">
          <h3>Year Overview</h3>
          {!isLoading ? (
            <>
              <CalendarHeatmap
                startDate={shiftDate(today, -364).getTime()}
                endDate={today.getTime()}
                values={heatmapCalendarData}
                classForValue={(value) => {
                  if (!value) {
                    return "color-empty";
                  }
                  return `color-github-${value.count}`;
                }}
                tooltipDataAttrs={(value) => {
                  const date = new Date(value.date);
                  const formattedDate = `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;
                  // formattedDate will be '25/12/2022'
                  return {
                    "data-tip": `${formattedDate} has count: ${value.count}`,
                  };
                }}
                showWeekdayLabels={true}
                onClick={(value) =>
                  alert(`Clicked on value with count: ${value.count}`)
                }
              />
              <ReactTooltip />
            </>
          ) : (
            <div className="loadHeatMap">
              <LoadingOutlined />
            </div>
          )}
        </div>
        <div className="details md:w-[80%]">
          <div className="item">
            <h4>{`${allproblems.length} problems`}</h4>
            <p>solved for all time</p>
          </div>
          <div className="item">
            <h4>{`${todayProblems.length} problems`}</h4>
            <p>solved today</p>
          </div>
          <div className="item">
            <h4>{`${monthProblems.length} problems`}</h4>
            <p>solved for the last month</p>
          </div>
          <div className="item">
            <h4> {`${weekProblems.length} problems`} </h4>
            <p>solved for the last week</p>
          </div>
        </div>
        <div className="barGraph">
          <h3>Difficulty Graph</h3>
          <BarList
            data={[
              { key: "Easy", data: easyProblems.length },
              { key: "Medium", data: mediumPoblems.length },
              { key: "Hard", data: hardProblems.length },
            ]}
            series={
              <BarListSeries
                barClassName="bar"
                outerBarClassName="outer"
                valueClassName="value"
                labelPosition="end"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
