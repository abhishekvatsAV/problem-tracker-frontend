import React, { useEffect, useState, useSyncExternalStore } from "react";
import "./Dashboard.css";
import { BarList, BarListSeries } from "reaviz";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";

const Dashboard = () => {
  const today = new Date();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [heatmapCalendarData, setHeatmapCalendarData] = useState([]);
  const [easyProblems, setEasyProblems] = useState([]);
  const [mediumPoblems, setMediumPoblems] = useState([]);
  const [hardProblems, setHardProblems] = useState([]);
  const [allproblems, setAllProblems] = useState([]);
  const [todayProblems, setTodayProblems] = useState([]);
  const [monthProblems, setMonthProblems] = useState([]);
  const [weekProblems, setWeekProblems] = useState([]);

  useEffect(() => {
    const heatmapCalendarDataGen = async () => {
      try {
        const response = await axios.get(`${apiUrl}/problems/yeardata`);
        setHeatmapCalendarData([...response.data]);
        console.log("response", response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const bargraph = async () => {
      try {
        const res1 = await axios(`${apiUrl}/problems/hard`);
        const res2 = await axios(`${apiUrl}/problems/medium`);
        const res3 = await axios(`${apiUrl}/problems/easy`);
        setHardProblems([...res1.data]);
        setMediumPoblems([...res2.data]);
        setEasyProblems([...res3.data]);
      } catch (error) {
        console.log("error : ", error);
      }
    };

    const getAllProblems = async () => {
      const problems = await axios(`${apiUrl}/problems/getAllProblems`);
      setAllProblems([...problems.data]);
    };

    const gettodayProb = async () => {
      let date = today.toLocaleDateString();
      try {
        const response = await axios.get(
          `${apiUrl}/problems/findbydate?date=${date}`
        );
        setTodayProblems([...response.data]);
      } catch (err) {
        console.log(err);
      }
    };

    const monthProb = async () => {
      try {
        let monthPrb = await axios.get(`${apiUrl}/problems/month`);
        setMonthProblems([...monthPrb.data]);
      } catch (err) {
        console.log(err);
      }
    };

    const weekProb = async () => {
      try {
        let weekPrb = await axios.get(`${apiUrl}/problems/week`);
        setWeekProblems([...weekPrb.data]);
      } catch (err) {
        console.log(err);
      }
    };

    heatmapCalendarDataGen();
    bargraph();
    getAllProblems();
    gettodayProb();
    monthProb();
    weekProb();
  }, []);

  // console.log("heatmapData: ", heatmapCalendarData);

  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  return (
    <div className="dashBoard">
      <div className="flexBox">
        <div className="heatMap">
          <h3>Year Overview</h3>
          <CalendarHeatmap
            startDate={shiftDate(today, -364)}
            endDate={today}
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
        </div>
        <div className="details">
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
            style={{ width: 350 }}
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
