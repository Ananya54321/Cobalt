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
import { PiCode } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import HashLoader from "react-spinners/HashLoader";
import { IoMdClose } from "react-icons/io";
import RingLoader from "react-spinners/RingLoader";
import jsPDF from "jspdf";

const InvalidFiles = [
  "mp3",
  "mp4",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
  "class",
  "exe",
];

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
  const [codeLoading, setCodeLoading] = useState(false);
  const [expLoading, setExpLoading] = useState(false);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      setSelectedText(selectedText);
      const range = selection.getRangeAt(0).getBoundingClientRect();
      const { top, left } = range;
      setButtonPosition({ x: left + 40, y: top });
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
    if (repoLink == null || repoLink == "") {
      return;
    }
    setRepoLoading(true);
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

  const LoadExp = async () => {
    setExpLoading(true);
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
            });
        } else {
          await axios
            .post("api/users/askgeminitext", { prompt: FilePrompt() })
            .then((res) => {
              setExplanations({
                ...explanations,
                selectedFile: res.data.message,
              });
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

  const AskFurtherExp = async () => {
    setSnippetBox(false);
    setExpLoading(true);
    try {
      await axios
        .post("api/users/askgeminitext", { prompt: SnippetPrompt() })
        .then((res) => {
          setExplanations({
            ...explanations,
            selectedFile: res.data.message,
          });
        });
    } catch (error) {}
    setExpLoading(false);
  };

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

  function SnippetPrompt() {
    const a =
      " Considering the provided code snippet, explain its functionality in detail. Break down the code line by line, explaining the purpose of each line and how they work together to achieve the desired outcome. Additionally, identify any variables, data structures, or control flow statements used in the code and explain their significance.      " +
      selectedText;
    return a;
  }

  function hasREADME(string: string) {
    const regex = /README\.md/i;
    return regex.test(string);
  }

  const downloadPDF = (content) => {
    const doc = new jsPDF();

    const margin = 10;
    const pageHeight = doc.internal.pageSize.height - 2 * margin;

    const lines = doc.splitTextToSize(
      content,
      doc.internal.pageSize.width - 2 * margin
    );

    let y = margin;
    let currentPage = 1;
    lines.forEach((line, index) => {
      if (y > pageHeight) {
        doc.addPage();
        currentPage++;
        y = margin;
      }
      doc.text(margin, y, line);
      y += doc.getTextDimensions(line).h + 5;
    });

    const pdfContent = doc.output();

    const blob = new Blob([pdfContent], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "content.pdf";
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
      link.remove();
    }, 100);
  };

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
          className=" px-4 py-2 mt-8 h-10 min-w-[400px] bg-[#1e293b] rounded-md text-[#8f9eb3] focus:outline-none focus:ring focus:ring-opacity-60"
        />
        {repLoading ? (
          <>
            <Button
              disabled
              variant="anibutton"
              className="h-10 mt-8 min-w-[100px] text-md font-semibold"
              onClick={(e) => {
                e.preventDefault();
                setData(null);
                GetRepo();
              }}
            >
              <span className="relative z-10">Loading...</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="anibutton"
              className="h-10 mt-8 min-w-[100px] text-md font-semibold"
              onClick={(e) => {
                e.preventDefault();
                setData(null);
                GetRepo();
              }}
            >
              <span className="relative z-10">Get Repo</span>
            </Button>
          </>
        )}
      </div>

      {data != null ? (
        <div className="">
          <div className="grid grid-cols-8">
            <div className="bg-[#264F9460] col-span-2 m-6 mr-0 mb-0 rounded-2xl flex justify-center">
              <div className="text-white w-5/6 m-2 mr-2 h-[550px] rounded-2xl flex flex-col">
                <p className="text-xl p-2 font-mono">
                  {" "}
                  <PiCode className="inline h-7 w-7" />{" "}
                  {repoName && repoName.toUpperCase()}
                </p>
                <hr className="mb-5" />
                <div className="flex flex-col h-[550px] text-[#b5daff] gap-1 overflow-y-auto custom-scrollbar">
                  {data &&
                    Object.keys(data).map((key) => {
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const a = key.split(".")[key.split(".").length - 1];
                            if (
                              !InvalidFiles.includes(a.toLowerCase()) &&
                              !InvalidFiles.includes(a.toUpperCase())
                            ) {
                              setSelectedFile(key);
                            }
                          }}
                          key={key}
                        >
                          {" "}
                          <p
                            className={` ${
                              key == selectedFile
                                ? " bg-blue-500 "
                                : " bg-[#40506a] "
                            } text-left pl-3 py-1 rounded-md hover:border`}
                          >
                            {key}
                          </p>{" "}
                        </button>
                      );
                    })}
                </div>
              </div>
              <div></div>
            </div>
            <div className="bg-[#264F9460] col-span-3 m-6 mr-0 rounded-2xl text-white h-[550px] p-4 overflow-y-auto custom-scrollbar hover:border">
              {data &&
                Object.keys(data).map((key) => {
                  if (key == selectedFile)
                    return (
                      <pre
                        className="whitespace-pre-wrap font-sans"
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
                {selectedText && (
                  <div
                    className=""
                    style={{
                      position: "absolute",
                      top: buttonPosition.y,
                      left: buttonPosition.x,
                    }}
                  >
                    <Button
                      className=" w-20 p-1"
                      variant="snipbutton"
                      onClick={() => {
                        setSnippetBox(true);
                      }}
                    >
                      Snip
                    </Button>
                    <Button
                      className=" w-20 p-1"
                      variant="snipbutton"
                      onClick={() => {
                        AskFurtherExp();
                      }}
                    >
                      Ask GPT
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#264F9460] col-span-3 m-6 rounded-2xl text-white h-[550px] overflow-y-auto custom-scrollbar hover:border">
              {snippetBox ? (
                <>
                  <Button
                    variant="snipbutton"
                    className="w-10 p-1 rounded-full m-3 mb-0 fixed"
                    onClick={() => {
                      setSnippetBox(false);
                    }}
                  >
                    {" "}
                    <IoMdClose className="h-5 w-5 inline" />{" "}
                  </Button>
                  <SnippetComponent code={selectedText} getHubLink={repoLink} />
                </>
              ) : (
                <>
                  {expLoading ? (
                    // <div ><HashLoader color="#2196f3" size={100} /></div>
                    <div className="flex items-center justify-center h-[550px]">
                      <RingLoader color="#2196f3" size={100} />
                    </div>
                  ) : (
                    <>
                      {explanations &&
                        Object.keys(explanations).map((key) => {
                          return (
                            <>
                              <Button
                                className=" w-20 p-1"
                                variant="snipbutton"
                                onClick={() => {
                                  downloadPDF(
                                    data[selectedFile] + explanations[key]
                                  );
                                }}
                              >
                                Download
                              </Button>
                              <div key={key} className="p-4">
                                <pre
                                  className="whitespace-pre-wrap font-sans"
                                  key={key}
                                >
                                  {explanations[key]}{" "}
                                </pre>
                              </div>
                            </>
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
        <div className="flex justify-center items-center">
          <Image
            src={search}
            alt={"search"}
            className="h-[800px] w-[800px]"
          ></Image>
        </div>
      )}
    </div>
  );
}

export default Page;
