import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Problem from "../components/Problem";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

const Home = () => {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [helpUsed, setHelpUsed] = useState(false);
  const [selectedDate, setselectedDate] = useState(new Date());
  const [problemArr, setProblemArr] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const today = new Date();
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!localStorage.getItem("user")) {
        navigate("/login");
      } else {
        user = localStorage.getItem("user");
        user = JSON.parse(user);
      }
    };
    check();
  }, []);

  // to get all the probles done on selectedDate
  const handleProblems = async () => {
    let date = selectedDate.toLocaleDateString();
    try {
      const response = await axios.get(
        `${apiUrl}/problems/findbydate?date=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProblemArr(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ques = {
      date: selectedDate.toLocaleDateString(),
      name: e.target.name.value,
      link: e.target.link.value,
      platform: e.target.platform.value,
      difficulty: e.target.difficultyLevel.value,
      topic: e.target.topic.value,
      helpUsed: helpUsed,
    };

    try {
      const response = await axios.post(`${apiUrl}/problems/create`, ques, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      const data = response.data;
      handleProblems();
    } catch (err) {
      console.log(err);
    }

    setLink("");
    setHelpUsed(false);
    setName("");
  };

  const handleDelete = async (link) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${apiUrl}/problems/deleteProblem`,
        { link },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      handleProblems();
    } catch (error) {
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    handleProblems();
  }, [selectedDate]);

  const onChange = (date, dateString) => {
    // console.log(date.$d, dateString);
    setselectedDate(date.$d);
  };

  return (
    <div className="Home">
      <div className="problemSection">
        <div className="dateSelection">
          <span>
            Select <span>Date </span>:{" "}
          </span>
          <DatePicker onChange={onChange} className="datePicker" />
        </div>
        <div className="solvedProb">
          <div className="solved_box">
            <h3>
              Solved <span>Problems</span>{" "}
            </h3>
          </div>
          <>
            {problemArr.map((problem, i) => (
              <Problem
                problem={problem}
                handleDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </>
        </div>
      </div>
      <div className="probForm">
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Name:
            <input
              className="form-control"
              type="text"
              placeholder="Enter the name of the question"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            <span>Link Of The Question:</span>
            <input
              type="url"
              placeholder="Enter the Link"
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="form-control"
            />
          </label>
          <label className="form-label">
            <span>Difficulty: </span>
            <select className="form-control" required name="difficultyLevel">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
          <label className="form-label">
            <span>Platform: </span>
            <select className="form-control" required name="platform">
              <option>LeetCode</option>
              <option>GFG</option>
              <option>CodeForces</option>
              <option>AtCoder</option>
              <option>HackerRank</option>
              <option>CSES</option>
              <option>Other</option>
            </select>
          </label>
          <label className="form-label">
            Topic:
            <select className="form-control" required name="topic">
              <option>Arrays</option>
              <option>Strings</option>
              <option>2D Arrays</option>
              <option>Searching And Sorting</option>
              <option>Backtracking</option>
              <option>Linked List</option>
              <option>Stacks and Queues</option>
              <option>Greedy</option>
              <option>Binary Trees</option>
              <option>Binary Search Trees</option>
              <option>Heaps and Hashing</option>
              <option>Graphs</option>
              <option>Tries</option>
              <option>DP</option>
              <option>BinarySearch</option>
              <option>Bit Manipulation</option>
              <option>Recursion</option>
              <option>Segment Tree</option>
            </select>
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              onClick={() =>
                helpUsed ? setHelpUsed(false) : setHelpUsed(true)
              }
              checked={helpUsed}
            />
            Done with some external Help
          </div>
          <button className="btn btn-primary">Add Question</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
