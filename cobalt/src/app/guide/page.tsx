"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import fetchDirectoryContents from "@/helpers/github/gitApi";
import Link from "next/link";
import SnippetComponent from "./SnippetComponent";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import search from "@/Images/whitesearch.svg";

function Page() {
  const [repoLink, setRepoLink] = useState<string>("");
  const [data, setData] = useState<object>();
  const [explanations, setExplanations] = useState<object>();
  const [repoName, setRepoName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>();
  const [selectedText, setSelectedText] = useState("");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [snippetBox, setSnippetBox] = useState(false);
  const [repLoading, setRepoLoading] = useState(false);
  const [expLoading, setExpLoading] = useState(false);
  const [recentRepos, setRecentRepos] = useState<Array<String>>();

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      setSelectedText(selectedText);
      const range = selection.getRangeAt(0).getBoundingClientRect();
      const { top, left } = range;
      setButtonPosition({ x: left, y: top });
    }
  };

  useEffect(() => {
    if (repoLink.startsWith("https://")) {
      setRepoLink(repoLink.replace("https://", ""));
    }
    setUserName(repoLink.split("/")[1]);
    setRepoName(repoLink.split("/")[2]);
  }, [repoLink]);

  const GetRepo = async () => {
    // if(userName==null || repoName==null ){
    //   return
    // }
    if (repoLink == null || repoLink == "") {
      return;
    }

    setRepoLoading(true);
    // setRecentRepos([...recentRepos,${userName}/${repoName}])
    const d = localStorage.getItem(`${userName}/${repoName}`);
    if (d == null) {
      try {
        await fetchDirectoryContents(userName, repoName).then((data) => {
          if (data == null) {
            console.log("Cannot fetch");
          } else {
            setData(data);
            localStorage.setItem(
              `${userName}/${repoName}`,
              JSON.stringify(data)
            );
            Object.keys(data).forEach((key) => {
              if (hasREADME(key)) {
                setSelectedFile(key);
              }
            });
          }
        });
      } catch (error) {}
    } else {
      setData(JSON.parse(d));
    }
    setRepoLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("recentRepos", JSON.stringify(recentRepos));
  }, [recentRepos]);

  const LoadExp = async () => {
    setExpLoading(true);
    // const cache = localStorage.getItem(${selectedFile})
    const cache = null;
    if (selectedFile == null) {
      return;
    }
    if (cache == null) {
      try {
        if (hasREADME(selectedFile)) {
          await axios
            .post("api/users/askgeminitext", { prompt: readMePrompt() })
            .then((res) => {
              setExplanations({
                ...explanations,
                selectedFile: res.data.message,
              });
              localStorage.setItem(`${selectedFile}`, res.data.message);
            });
        } else {
          await axios
            .post("api/users/askgeminitext", { prompt: FilePrompt() })
            .then((res) => {
              setExplanations({
                ...explanations,
                selectedFile: res.data.message,
              });
              localStorage.setItem(`${selectedFile}`, res.data.message);
            });
        }
      } catch (error) {}
    } else {
      setExplanations({ ...explanations, selectedFile: cache });
    }
    setExpLoading(false);
  };

  useEffect(() => {
    if (selectedFile != null) {
      setExplanations(null);
      LoadExp();
    }
  }, [selectedFile]);

  function readMePrompt() {
    const a =
      "Analyze the given README.md file and provide a comprehensive explanation of the project it describes. Include details about the project's purpose, functionalities, installation instructions, usage steps, and any relevant contributing guidelines. Additionally, identify any links or references mentioned in the Readme that could be helpful for further exploration. give in plain text ,remove all highlighting" +
      data[selectedFile];
    return a;
  }

  function FilePrompt() {
    const a =
      " Analyze the code in <selected file> and provide detailed explanations for each function defined within the file. Explain the purpose of each function, its parameters, return values (if any), and the logic it implements. Additionally, identify any internal function calls or dependencies between functions.. give in plain text ,remove all highlighting" +
      data[selectedFile];
    return a;
  }

  function hasREADME(string: string) {
    const regex = /README\.md/i;
    return regex.test(string);
  }

  useEffect(() => {
    // setRecentRepos(localStorage.getItem('recentRepos')|| null)
    // localStorage.clear();
  }, []);

  return (
    <div className="spacebg">
      <NavBar />

      <div className="flex justify-center gap-5">
        <input
          type="text"
          value={repoLink}
          onChange={(e) => {
            setRepoLink(e.target.value);
          }}
          name=""
          id=""
          className=" px-4 py-2 mt-20 h-10 w-[200px] bg-[#1e293b] rounded-md text-[#8f9eb3] focus:outline-none focus:ring focus:ring-opacity-40"
        />
        {repLoading ? (
          <>
            <button
              disabled
              onClick={(e) => {
                e.preventDefault();
                setData(null);
                GetRepo();
              }}
            >
              getrepo
            </button>
          </>
        ) : (
          <>
            <button
              className="h-10 mt-20 bg-[#00adf1] rounded-xl min-w-[100px] outline-none cursor-pointer text-lg hover:bg-[#37bcf8] font-semibold text-white"
              onClick={(e) => {
                e.preventDefault();
                setData(null);
                GetRepo();
              }}
            >
              getrepo
            </button>
          </>
        )}
      </div>

      {data != null ? (
        <div className="h-screen">
          <div className="grid grid-cols-8 h-[700px]">
            <div className="bg-[#264F9460] col-span-2 m-6 mr-0 rounded-2xl">
              <div className=" grid grid-cols-6 h-[100%] justify-items-center">
                <div className="col-span-5 bg-blue-50 w-full m-2 mr-2 rounded-2xl flex flex-col pl-5">
                  <p>{repoName}</p>
                  <hr />
                  <div className="flex flex-col text-left">
                    {data &&
                      Object.keys(data).map((key) => {
                        return (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFile(key);
                            }}
                            key={key}
                          >
                            {" "}
                            <p>{key}</p>{" "}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#264F9460] col-span-3 m-6 mr-0 rounded-2xl text-white">
              {data &&
                Object.keys(data).map((key) => {
                  if (key == selectedFile)
                    return (
                      <pre
                        className="whitespace-pre-wrap"
                        onMouseUp={handleSelection}
                        onMouseDown={() => {
                          setSelectedText(null);
                        }}
                        key={key}
                      >
                        {" "}
                        {data[key]}{" "}
                      </pre>
                    );
                })}
              <div>
                {/* {data &&
                  Object.keys(data).map((key) => {
                    if (key == selectedFile)
                      return (
                        <pre
                          onMouseUp={handleSelection}
                          onMouseDown={() => {
                            setSelectedText(null);
                          }}
                          key={key}
                        >
                          {" "}
                          {data[key]}{" "}
                        </pre>
                      );
                  })} */}
                {selectedText && (
                  <div
                    className="bg-slate-700"
                    style={{
                      position: "absolute",
                      top: buttonPosition.y,
                      left: buttonPosition.x,
                    }}
                  >
                    <button
                      onClick={() => {
                        setSnippetBox(true);
                      }}
                    >
                      Action
                    </button>
                    {/* opens snippet box */}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#264F9460] col-span-3 m-6 rounded-2xl text-white">
              {snippetBox ? (
                <>
                  <button
                    onClick={() => {
                      setSnippetBox(false);
                    }}
                  >
                    {" "}
                    close{" "}
                  </button>
                  <SnippetComponent code={selectedText} />
                </>
              ) : (
                <>
                  {expLoading ? (
                    <>Exp Loading.......</>
                  ) : (
                    <>
                      {explanations &&
                        Object.keys(explanations).map((key) => {
                          return (
                            <pre className="whitespace-pre-wrap" key={key}>
                              {explanations[key]}{" "}
                            </pre>
                          );
                        })}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-16">
          <Image
            src={search}
            alt={"search"}
            className="h-[600px] w-[600px]"
          ></Image>
        </div>
      )}
    </div>
  );
}

export default Page;