"use client";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import React, { useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import CodeEditor from "@uiw/react-textarea-code-editor";

function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const UploadToCloudinary = async () => {
    try {
      if (
        selectedFile?.type === "image/png" ||
        selectedFile?.type === "image/jpeg" ||
        selectedFile?.type === "image/jpg"
      ) {
        const formdata = new FormData();
        formdata.append("file", selectedFile);
        formdata.append("upload_preset", "cvrhackthon");
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dvudkkxl4/image/upload",
          {
            method: "POST",
            body: formdata,
          }
        );
        const uploadedImageData = await uploadResponse.json();
        const imageUrl = uploadedImageData.url;
        return imageUrl;
      } else {
        console.log("Please upload only images");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <input type="file" onChange={handleFileInput} />
      <button
        onClick={(e) => {
          e.preventDefault();
          UploadToCloudinary();
        }}
      >
        Add File
      </button> */}
      <div className="h-screen flex flex-col">
        <div>
          <input type="text" placeholder="enter repo link" />
          <button className="bg-slate-300">getrepo</button>
        </div>
        <ResizablePanelGroup className="h-full flex" direction={"horizontal"}>
          <ResizablePanel defaultSize={15} maxSize={15} className="bg-[#264F9460]  h-full border">
            <div className="text-right w-full p-2">
              <button className="w-7 h-7 rounded-full bg-white">
                {" "}
                <ArrowBackIosNewIcon className="w-4 h-4" />{" "}
              </button>{" "}
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={30} className="bg-[#264F9460] h-full  text-white overflow-y-auto custom-scrollbar border">
            <CodeEditor
              autoFocus
              autoComplete="off"
              language="js"
              className="w-[100%] h-[100%] bg-  border backdrop-blur-xl border-black rounded-md"
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={30} className="resizable bg-[#264F9460]  h-full text-white overflow-y-auto custom-scrollbar border">
            <ul className="flex text-center gap-1 p-1">
              <li className="bg-slate-500 w-[25%] rounded-md p-2">
                Explanation
              </li>
              <li className="bg-slate-500  w-[25%] rounded-md p-2">Snippet</li>
              <li className="bg-slate-500 w-[25%] rounded-md p-2">
                components
              </li>
              <li className="bg-slate-500 w-[25%] rounded-md p-2">
                optimization
              </li>
            </ul>
            <hr />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default Page;
