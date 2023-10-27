import "./Home.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Problem from "../components/Problem";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/helper";
import { DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";

const Home = () => {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [helpUsed, setHelpUsed] = useState(false);
  const [selectedDate, setselectedDate] = useState(new Date());
  const [problemArr, setProblemArr] = useState([]);
  const apiUrl = BASE_URL;
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!localStorage.getItem("user")) {
        navigate("/login");
      } else {
        // eslint-disable-next-line
        user = localStorage.getItem("user");
        user = JSON.parse(user);
      }
    };
    check();
  }, []);

  // to get all the problems done on selectedDate
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
      await axios.post(`${apiUrl}/problems/create`, ques, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      handleProblems();
    } catch (err) {
      console.log(err);
    }

    setLink("");
    setHelpUsed(false);
    setName("");
    if (modalOpen) {
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${apiUrl}/problems/deleteProblem`,
        { id },
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
    // eslint-disable-next-line
  }, [selectedDate]);

  const onChange = (date, dateString) => {
    // console.log(date.$d, dateString);
    setselectedDate(date.$d);
  };

  const modalRef = useRef(null);

  // Function to handle clicks outside the modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalOpen(false);
    }
  };

  // Attach the event listener when the modal is open
  useEffect(() => {
    if (modalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalOpen]);

  return (
    <div className="bg-[#222831] text-white">
      <div className="flex items-center flex-col gap-5  ">
        <DatePicker onChange={onChange} className="datePicker" />
        <span className="text-[#00adb5] ">
          {selectedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>

        <PlusCircleOutlined
          className="text-3xl hover:text-[#00adb5]"
          onClick={() => setModalOpen(true)}
        />

        <div className="overflow-scroll flex items-center flex-col gap-5 h-[550px]  mb-5 ">
          {problemArr.map((problem) => (
            <Problem
              key={problem._id}
              id={problem._id}
              problem={problem}
              handleDelete={() => handleDelete(problem._id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* <div className="grid grid-cols-3 min-h-full h-screen pt-20">
        <div className="bg-[#222831] col-span-3 md:col-span-2">
          <div className="flex items-center box-border z-10 text-white overflow-scroll">
            <span className="m-5">
              Select <span className="text-[#00adb5]">Date </span>:{" "}
            </span>
            <DatePicker onChange={onChange} className="datePicker" />
          </div>
          <div className="sticky pl-5 top-20 z-10 bg-[#222831] text-base text-white ">
            <h3>
              Solved Problems -{" "}
              <span className="text-[#00adb5] ">
                {selectedDate.toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>{" "}
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[550px] mt-3 ">
            {problemArr.map((problem) => (
              <Problem
                key={problem._id}
                id={problem._id}
                problem={problem}
                handleDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        className="fixed right-0 top-[170px] rounded-md text-white z-50 bg-blue-400 px-2 py-1 md:hidden mr-2"
        onClick={() => setModalOpen(true)}
      >
        Add Problem
      </button> */}
      {modalOpen && (
        <div className="fixed top-0 left-0 z-10 h-full w-full backdrop-blur-sm flex items-center justify-center min-h-screen">
          <div className="relative w-full flex items-center justify-center m-auto h-auto md:p-20 max-w-2xl max-h-2xl p-2">
            <div className=" bg-[#222831] w-full col-span-1" ref={modalRef}>
              <form
                onSubmit={handleSubmit}
                className=" flex flex-col bg-[#393e46] text-white p-5"
              >
                <label className="flex flex-col ">
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
                  <select
                    className="form-control"
                    required
                    name="difficultyLevel"
                  >
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
                    onChange={() =>
                      helpUsed ? setHelpUsed(false) : setHelpUsed(true)
                    }
                    checked={helpUsed}
                  />
                  Done with some external Help
                </div>
                <button className="btn btn-primary ">Add Question</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
