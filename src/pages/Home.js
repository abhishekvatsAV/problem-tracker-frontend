import "./Home.css";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import Problem from "../components/Problem";
import { useNavigate } from "react-router-dom";

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
    console.log("start date", date);
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
      console.log("response Data : ", response.data);
      setProblemArr(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
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

    console.log(ques);
    setLink("");
    setHelpUsed(false);
    setName("");
  };

  const handleDelete = async (link) => {
    try {
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
      handleProblems();
    } catch (error) {
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    handleProblems();
  }, [selectedDate]);

  return (
    <div className="Home">
      <div className="solvedProblems">
        <div className="dateSelection">
          <span>Select Date :</span>
          <DatePicker
            maxDate={today} // Set the maximum selectable date to the current date
            selected={selectedDate}
            onChange={(date) => setselectedDate(date)}
          />
        </div>
        <div className="problems">
          <h3>Solved Problems</h3>
          <>
            {problemArr.map((problem, i) => (
              <Problem problem={problem} handleDelete={handleDelete} />
            ))}
          </>
        </div>
      </div>
      <div className="addProblem">
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
