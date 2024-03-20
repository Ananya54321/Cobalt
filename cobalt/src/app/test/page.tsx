"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import fetchDirectoryContents from "@/helpers/github/gitApi";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import jsPDF from "jspdf";
import SnippetComponent from "./SnippetComponent";
import { useRef } from "react";

const SIDEBOXTYPES = ["EXPLAIN", "MODEL", "SAVE", "OPTIMIZE"];
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
  const [directoryBox, setDirectoryBox] = useState(false);
  const [sideBox, setSideBox] = useState<String>("EXPLAIN");
  const [repoLink, setRepoLink] = useState<string>("");
  const [data, setData] = useState<object>();
  const [repoName, setRepoName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [repLoading, setRepoLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [explainations, setExplainations] = useState<object>();
  const [optimizations, setOptimizations] = useState<object>();
  const [detections, setDetections] = useState<object>();
  const [expLoading, setExpLoading] = useState(false);
  const [detLoading, setDetLoading] = useState(false);
  const [optLoading, setOptLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const textref = useRef(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      setSelectedText(selectedText);
      const range = selection.getRangeAt(0).getBoundingClientRect();
      const { top, left } = range;
      if (textref.current)
        setButtonPosition({
          x: textref.current.selectionEnd,
          y: textref.current.selectionStart,
        });
    }
  };

  useEffect(() => {
    if (selectedFile != null) {
      if (hasREADME(selectedFile)) {
        if (explainations) {
          if (Object.keys(explainations).includes(selectedFile)) {
          } else {
            PromptGemini("EXPLAINREADME");
          }
        } else {
          PromptGemini("EXPLAINREADME");
        }
        if (optimizations) {
          if (Object.keys(optimizations).includes(selectedFile)) {
          } else {
            PromptGemini("OPTIMIZEREADME");
          }
        } else {
          PromptGemini("OPTIMIZEREADME");
        }
      } else {
        if (explainations) {
          if (Object.keys(explainations).includes(selectedFile)) {
          } else {
            PromptGemini("EXPLAINCODE");
          }
        } else {
          PromptGemini("EXPLAINCODE");
        }
        if (optimizations) {
          if (Object.keys(optimizations).includes(selectedFile)) {
          } else {
            PromptGemini("OPTIMIZECODE");
          }
        } else {
          PromptGemini("OPTIMIZECODE");
        }
        if (detections) {
          if (Object.keys(detections).includes(selectedFile)) {
          } else {
            PromptGemini("OPTIMIZECODE");
          }
        } else {
          PromptGemini("DETECTCODE");
        }
      }
    }
  }, [selectedFile]);

  useEffect(() => {
    if (repoLink.startsWith("https://")) {
      setRepoLink(repoLink.replace("https://", ""));
    }
    setUserName(repoLink.split("/")[1]);
    setRepoName(repoLink.split("/")[2]);
  }, [repoLink]);

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
    const opt = localStorage.getItem(`OPT_${userName}/${repoName}`);
    const exp = localStorage.getItem(`EXP_${userName}/${repoName}`);
    const det = localStorage.getItem(`DET_${userName}/${repoName}`);

    if (opt) {
      setOptimizations(JSON.parse(opt));
    }
    if (exp) {
      setExplainations(JSON.parse(exp));
    }
    if (det) {
      setDetections(JSON.parse(det));
    }
  };

  function hasREADME(string: string) {
    const regex = /README\.md/i;
    return regex.test(string);
  }

  useEffect(() => {
    if (explainations) {
      localStorage.setItem(
        `EXP_${userName}/${repoName}`,
        JSON.stringify(explainations)
      );
    }
  }, [explainations]);
  useEffect(() => {
    if (detections) {
      localStorage.setItem(
        `DET_${userName}/${repoName}`,
        JSON.stringify(detections)
      );
    }
  }, [detections]);

  useEffect(() => {
    if (optimizations) {
      localStorage.setItem(
        `OPT_${userName}/${repoName}`,
        JSON.stringify(optimizations)
      );
    }
  }, [optimizations]);

  const PromptGemini = async (type: String) => {
    let Prompt = "";

    if (type == "EXPLAINREADME") {
      setExpLoading(true);
      Prompt =
        "Analyze the given README.md file and provide a comprehensive explanation of the project it describes. Include details about the project's purpose, functionalities, installation instructions, usage steps, and any relevant contributing guidelines. Additionally, identify any links or references mentioned in the Readme that could be helpful for further exploration " +
        data[selectedFile];
    }
    if (type == "EXPLAINCODE") {
      setExpLoading(true);
      Prompt =
        "Analyze the code in <selected file> and provide detailed explanations for each function defined within the file. Explain the purpose of each function, its parameters, return values (if any), and the logic it implements. Additionally, identify any internal function calls or dependencies between functions." +
        data[selectedFile];
    }

    if (type == "OPTIMIZECODE") {
      setOptLoading(true);
      Prompt = "Optimize the code" + data[selectedFile];
    }

    if (type == "OPTIMIZEREADME") {
      setOptLoading(true);
      Prompt = "Optimize the Readme" + data[selectedFile];
    }
    if (type == "PDFCONTENT") {
    }
    if (type == "EXPLAINSNIPPET") {
    }
    if (type == "DETECTCODE") {
      setDetLoading(true);
      Prompt = "" + data[selectedFile];
    }

    try {
      await axios
        .post("api/users/askgeminitext", { prompt: Prompt })
        .then((res) => {
          if (type == "EXPLAINREADME") {
            Object.keys(data).forEach((key) => {
              if (key == selectedFile) {
                setExplainations({ ...explainations, [key]: res.data.message });
              }
            });
            setExpLoading(false);
          }
          if (type == "EXPLAINCODE") {
            Object.keys(data).forEach((key) => {
              if(key == selectedFile)
              setExplainations({ ...explainations, [key]: res.data.message });
            });
            setExpLoading(false);
          }

          if (type == "OPTIMIZECODE") {
            Object.keys(data).forEach((key) => {
              if(key == selectedFile)
              setOptimizations({ ...optimizations, [key]: res.data.message });
            });
            setOptLoading(false);
          }

          if (type == "OPTIMIZEREADME") {
            Object.keys(data).forEach((key) => {
              if (key == selectedFile) {
                setOptimizations({ ...optimizations, [key]: res.data.message });
              }
            });
            setOptLoading(false);
          }
          if (type == "PDFCONTENT") {
          }
          if (type == "EXPLAINSNIPPET") {
          }
          if (type == "DETECTCODE") {
            Object.keys(data).forEach((key) => {
              if (key == selectedFile) {
                console.log(true);
                setDetections({ ...detections, [key]: res.data.message });
                setDetLoading(false);
              }
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        <NavBar />
        <div>
          <input
            type="text"
            value={repoLink}
            onChange={(e) => {
              setRepoLink(e.target.value);
            }}
            name=""
            id=""
            className=" px-4 py-2  h-10 min-w-[400px] bg-[#1e293b] rounded-md text-[#8f9eb3] focus:outline-none focus:ring focus:ring-opacity-60"
          />
          {repLoading ? (
            <>
              <Button
                disabled
                variant="anibutton"
                className="h-10 min-w-[100px] text-md font-semibold"
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
                className="h-10 min-w-[100px] text-md font-semibold"
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
        <div className="h-full flex">
          <div className="bg-[#264F9460] w-[250px] h-full border">
            <div className="text-right w-full p-2">
              <button className="w-7 h-7 rounded-full bg-white">&gt;</button>{" "}
            </div>
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
                        key == selectedFile ? " bg-blue-500 " : " bg-[#40506a] "
                      } text-left pl-3 py-1 rounded-md hover:border`}
                    >
                      {key}
                    </p>{" "}
                  </button>
                );
              })}
          </div>
          <div className="flex w-[100%]">
            <div className="bg-[#264F9460] w-[50%] h-full  text-white  overflow-y-auto custom-scrollbar border">
              {data &&
                Object.keys(data).map((key) => {
                  if (key == selectedFile)
                    return (
                      <CodeEditor
                        autoFocus
                        ref={textref}
                        autoComplete="off"
                        value={data[selectedFile]}
                        language={selectedFile.split(".")[1]}
                        className="w-[100%] h-[100%]  border backdrop-blur-xl border-black rounded-md"
                        spellCheck={false}
                        onMouseUp={handleSelection}
                        onMouseDown={() => {
                          setSelectedText(null);
                        }}
                        key={key}
                      >
                        {" "}
                        {data[key]}{" "}
                      </CodeEditor>
                    );
                })}
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
                      setSideBox("SAVE");
                    }}
                  >
                    Snip
                  </Button>
                  <Button
                    className=" w-20 p-1"
                    variant="snipbutton"
                    onClick={() => {}}
                  >
                    Ask GPT
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-[#264F9460] w-[50%] h-full text-white overflow-y-auto custom-scrollbar border">
              <ul className="flex text-center gap-1 p-1">
                <li
                  onClick={() => {
                    setSideBox("EXPLAIN");
                  }}
                  className="bg-slate-500 w-[25%] rounded-md p-2"
                >
                  Explanation
                </li>
                <li
                  onClick={() => {
                    setSideBox("SAVE");
                  }}
                  className="bg-slate-500  w-[25%]  p-2"
                >
                  Snippet
                </li>
                <li
                  onClick={() => {
                    setSideBox("MODEL");
                  }}
                  className="bg-slate-500 w-[25%] p-2"
                >
                  components
                </li>
                <li
                  onClick={() => {
                    setSideBox("OPTIMIZE");
                  }}
                  className="bg-slate-500 w-[25%] p-2"
                >
                  optimization
                </li>
              </ul>
              <div>
                {sideBox == "EXPLAIN" && (
                  <>
                    {expLoading ? (
                      <>exp loading...</>
                    ) : (
                      <>
                        {explainations &&
                          Object.keys(explainations).map((key) => {
                            if (key == selectedFile) {
                              return (
                                <div key={key} className="p-4">
                                  <pre
                                    className="whitespace-pre-wrap font-sans"
                                    key={key}
                                  >
                                    {explainations[key]}{" "}
                                  </pre>
                                </div>
                              );
                            }
                          })}
                      </>
                    )}
                  </>
                )}
                {sideBox == "MODEL" && (
                  <>
                    {detLoading ? (
                      <>det loading...</>
                    ) : (
                      <>
                        {detections &&
                          Object.keys(detections).map((key) => {
                            if (key == selectedFile) {
                              return (
                                <div key={key} className="p-4">
                                  <pre
                                    className="whitespace-pre-wrap font-sans"
                                    key={key}
                                  >
                                    {detections[key]}{" "}
                                  </pre>
                                </div>
                              );
                            }
                          })}
                      </>
                    )}
                  </>
                )}
                {sideBox == "SAVE" && (
                  <>
                    <SnippetComponent
                      code={selectedText}
                      getHubLink={repoLink}
                    />
                  </>
                )}
                {sideBox == "OPTIMIZE" && (
                  <>
                    {optLoading ? (
                      <>opt loading...</>
                    ) : (
                      <>
                        {optimizations &&
                          Object.keys(optimizations).map((key) => {
                            if (key == selectedFile) {
                              return (
                                <div key={key} className="p-4">
                                  <pre
                                    className="whitespace-pre-wrap font-sans"
                                    key={key}
                                  >
                                    {optimizations[key]}{" "}
                                  </pre>
                                </div>
                              );
                            }
                          })}
                      </>
                    )}
                  </>
                )}
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;

{
  /* <div className="h-screen flex flex-col">
        <div>
          <input type="text" placeholder="enter repo link" />
          <button className="bg-slate-300">getrepo</button>
        </div>
        <div className="h-full flex">
          <div className="bg-[#264F9460] w-[250px] h-full border">
            <div className="text-right w-full p-2"><button className="w-7 h-7 rounded-full bg-white">&gt;</button> </div>
          </div>
          <div className="flex w-[100%]">
            <div className="bg-[#264F9460] w-[50%] h-full  text-white overflow-y-auto custom-scrollbar border">
              <CodeEditor
                autoFocus
                autoComplete="off"
                language="js"
                className="w-[100%] h-[100%] bg-  border backdrop-blur-xl border-black rounded-md"
              />
            </div>
            <div className="bg-[#264F9460] w-[50%] h-full text-white overflow-y-auto custom-scrollbar border">
              <ul className="flex text-center gap-1 p-1">
                <li className="bg-slate-500 w-[25%] rounded-md p-2">Explanation</li>
                <li className="bg-slate-500  w-[25%]  p-2">Snippet</li>
                <li className="bg-slate-500 w-[25%] p-2">components</li>
                <li className="bg-slate-500 w-[25%] p-2">optimization</li>
              </ul>
              <hr />
            </div>
          </div>
        </div>
      </div> */
}
