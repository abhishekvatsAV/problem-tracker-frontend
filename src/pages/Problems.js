import React, { useEffect, useState } from "react";
import "./Problems.css";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Problem from "../components/Problem";

const Problems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [woHelpProb, setWoHelpProb] = useState([]);
  const [helpUsedProb, setHelpUsedProb] = useState([]);
  const [flag, setFlag] = useState(1);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [rerender, setRerender] = useState(false);

  let user = localStorage.getItem("user");
  user = JSON.parse(user);

  const handleDelete = async (link) => {
    try {
      await axios.post(
        `${apiUrl}/problems/deleteProblem`,
        {
          link,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      rerender ? setRerender(false) : setRerender(true);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    const getAllProb = async () => {
      const res = await axios.get(`${apiUrl}/problems/getAllProblems`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setAllProblems([...res.data]);
    };

    const helpProblems = async () => {
      const res = await axios.get(`${apiUrl}/problems/withHelp`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setHelpUsedProb([...res.data]);
    };

    const withoutHelpProblems = async () => {
      const res = await axios.get(`${apiUrl}/problems/withoutHelp`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setWoHelpProb([...res.data]);
    };

    getAllProb();
    helpProblems();
    withoutHelpProblems();
  }, [rerender]);

  const handleClick1 = () => {
    setFlag(1);
  };
  const handleClick2 = () => {
    setFlag(2);
  };
  const handleClick3 = () => {
    setFlag(3);
  };

  return (
    <div className="problemsPg">
      <div className="probGrid">
        <div
          onClick={handleClick1}
          style={
            flag === 1 ? { background: "#7d9d9c" } : { background: "#F0EBE3" }
          }
        >
          <button className="btn" style={{ border: "none", outline: "none" }}>
            <h4>All Solved Problems</h4>
          </button>
        </div>
        <div
          onClick={handleClick2}
          style={
            flag === 2 ? { background: "#7d9d9c" } : { background: "#F0EBE3" }
          }
        >
          <button className="btn">
            <h4>Problems Done Without Help</h4>
          </button>
        </div>
        <div
          onClick={handleClick3}
          style={
            flag === 3 ? { background: "#7d9d9c" } : { background: "#F0EBE3" }
          }
        >
          <button className="btn">
            <h4>Problems Solved Using Help</h4>
          </button>
        </div>
        <div>
          {flag === 1 &&
            allProblems.map((problem, i) => (
              <Problem problem={problem} handleDelete={handleDelete} />
            ))}
          {flag === 2 &&
            woHelpProb.map((problem, i) => (
              <Problem problem={problem} handleDelete={handleDelete} />
            ))}
          {flag === 3 &&
            helpUsedProb.map((problem, i) => (
              <Problem problem={problem} handleDelete={handleDelete} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;
