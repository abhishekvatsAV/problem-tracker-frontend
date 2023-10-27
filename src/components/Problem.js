import React from "react";
import { MdDelete } from "react-icons/md";
import { LoadingOutlined } from "@ant-design/icons";

const Problem = ({ problem, handleDelete, isLoading, id }) => {
  return (
    <div className=" bg-[#393e46] text-white border-solid border-[1px] border-[rgba(0,0,0,0.5)] rounded-md w-full ">
      {!isLoading ? (
        <div className=" ">
          <div className="flex justify-between bg-[#282828] p-2 ">
            <a
              href={problem.link}
              target="_blank"
              rel="noreferrer"
              className="text-white font-bold hover:!text-[#00adb5] cursor-pointer"
            >
              {problem.name}
            </a>
            <MdDelete
              className="cursor-pointer hover:text-[#00adb5]"
              style={{ fontSize: "1.5em" }}
              onClick={() => handleDelete(id)}
            />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
            <li>
              <span className="font-semibold text-gray-500">Difficulty:</span>
              {problem.difficulty}
            </li>
            <li>
              <span className="font-semibold text-gray-500">Platform:</span>
              {problem.platform}
            </li>
            <li>
              <span className="font-semibold text-gray-500">Topic:</span>
              {problem.topic}
            </li>
            <li>
              <span className="font-semibold text-gray-500">helpUsed:</span>
              {problem.helpUsed ? "Yes" : "No"}
            </li>
          </ul>
        </div>
      ) : (
        <div className="loaderCard">
          <LoadingOutlined />
        </div>
      )}
    </div>
  );
};

export default Problem;
