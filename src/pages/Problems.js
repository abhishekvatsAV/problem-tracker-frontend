import React, { useEffect, useState } from "react";
import "./Problems.css";
import axios from "axios";
import Problem from "../components/Problem";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Problems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [woHelpProb, setWoHelpProb] = useState([]);
  const [helpUsedProb, setHelpUsedProb] = useState([]);
  const [filter1, setFilter1] = useState(allProblems);
  const [filter2, setFilter2] = useState(woHelpProb);
  const [filter3, setFilter3] = useState(helpUsedProb);
  const [searchWord, setSearchWord] = useState("");
  const [flag, setFlag] = useState(1);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [rerender, setRerender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let user = localStorage.getItem("user");
  user = JSON.parse(user);

  const handleDelete = async (link) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
      setFilter1([...res.data]);
    };

    const helpProblems = async () => {
      const res = await axios.get(`${apiUrl}/problems/withHelp`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setHelpUsedProb([...res.data]);
      setFilter3([...res.data]);
    };

    const withoutHelpProblems = async () => {
      const res = await axios.get(`${apiUrl}/problems/withoutHelp`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      setWoHelpProb([...res.data]);
      setFilter2([...res.data]);
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

  const onSearch = (event) => {
    const temp = event.target.value;
    setSearchWord(temp);
    temp = temp.toLowerCase();

    // search inside name, platform, difficulty and topic
    if (temp.length === 0) {
      setFilter1(allProblems);
      setFilter2(woHelpProb);
      setFilter3(helpUsedProb);
    } else if (flag === 1) {
      const newArr = allProblems.filter((prob) => {
        return (
          prob.name.toLowerCase().includes(temp) ||
          prob.platform.toLowerCase().includes(temp) ||
          prob.difficulty.toLowerCase().includes(temp) ||
          prob.topic.toLowerCase().includes(temp)
        );
      });
      setFilter1(newArr);
    } else if (flag === 2) {
      const newArr = woHelpProb.filter((prob) => {
        return (
          prob.name.toLowerCase().includes(temp) ||
          prob.platform.toLowerCase().includes(temp) ||
          prob.difficulty.toLowerCase().includes(temp) ||
          prob.topic.toLowerCase().includes(temp)
        );
      });
      setFilter2(newArr);
    } else {
      const newArr = helpUsedProb.filter((prob) => {
        return (
          prob.name.toLowerCase().includes(temp) ||
          prob.platform.toLowerCase().includes(temp) ||
          prob.difficulty.toLowerCase().includes(temp) ||
          prob.topic.toLowerCase().includes(temp)
        );
      });
      setFilter3(newArr);
    }
  };

  return (
    <div className="problemsPg">
      <div className="probGrid">
        <div
          onClick={handleClick1}
          style={
            flag === 1 ? { background: "#00ADB5" } : { background: "#222831" }
          }
          className="btnBtn"
        >
          <h4>All Solved Problems</h4>
        </div>
        <div
          onClick={handleClick2}
          style={
            flag === 2 ? { background: "#00ADB5" } : { background: "#222831" }
          }
          className="btnBtn"
        >
          <h4>Problems Done Without Help</h4>
        </div>
        <div
          onClick={handleClick3}
          style={
            flag === 3 ? { background: "#00ADB5" } : { background: "#222831" }
          }
          className="btnBtn"
        >
          <h4>Problems Solved Using Help</h4>
        </div>
        <div className="flex_prob">
          {flag === 1 && (
            <>
              <Input
                placeholder="input search text"
                onChange={onSearch}
                value={searchWord}
              />
              <p>{filter1.length}</p>
              {filter1.map((problem, i) => (
                <Problem
                  problem={problem}
                  handleDelete={handleDelete}
                  isLoading={isLoading}
                />
              ))}
            </>
          )}
          {flag === 2 && (
            <>
              <Input
                placeholder="input search text"
                onChange={onSearch}
                value={searchWord}
              />
              <p>{filter2.length}</p>
              {filter2.map((problem, i) => (
                <Problem
                  problem={problem}
                  handleDelete={handleDelete}
                  isLoading={isLoading}
                />
              ))}
            </>
          )}
          {flag === 3 && (
            <>
              <Input
                placeholder="input search text"
                onChange={onSearch}
                value={searchWord}
              />
              <p>{filter3.length}</p>
              {filter3.map((problem, i) => (
                <Problem
                  problem={problem}
                  handleDelete={handleDelete}
                  isLoading={isLoading}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
