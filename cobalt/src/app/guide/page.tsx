"use client";
import React, { useEffect, useState } from "react";
import fetchDirectoryContents from "@/helpers/github/gitApi";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

function page() {
  const [data, setData] = useState<object>();
  const [userName, setUserName] = useState(String);
  const [repoName, setRepoName] = useState(String);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const[explaination,setExplanation] = useState<object>();
  const [expLoading, setExpLoading] = useState(false);
  

  const getRepo = async () => {
    setDataLoading(true);
    if (repoName == null || userName == null) {
      return null;
    }
    const c = localStorage.getItem(`${userName}/${repoName}`);
    if (c == null) {
      try {
        await fetchDirectoryContents(userName, repoName).then((content) => {
          if (content == null) {
            console.log("error fetching");
          } else {
            setData(content);
            localStorage.setItem(
              `${userName}/${repoName}`,
              JSON.stringify(content)
            );
          }
        });
      } catch (error) {
        console.log("error fetching");
      }
    } else {
      setData(JSON.parse(c));
    }
    setDataLoading(false);
    localStorage.clear();
  };

  function ReadMePrompt(readme){
    const a = "explain the project and what it does and technology from the given read me section \n give the response as a HTML markup with proper html tags \n" + readme
    return a
  }

  function FilePrompt(file){
    const a = "explain the project and what it does and technology from the given read me section \n" + file
    return a
  }


 async function ExpLoad(d,type){
  setExpLoading(true)
    if(type=="README"){
      await axios.post('api/users/askgeminitext', {prompt: ReadMePrompt(d) }).then((response)=>{
        setExplanation({...explaination,"README.md":response.data.message})
        })
    }
    else if(type=="FILE"){
      await axios.post('api/users/askgeminitext', {prompt: FilePrompt(d) }).then((response)=>{
        setExplanation({...explaination,d:response.data.message})
        })
    }
    setExpLoading(false)
  }

  const FileChange = async()=>{
    if(selectedFile !=null){
      await ExpLoad(selectedFile,"FILE")
    }else if(selectedFile !=null && hasREADME(selectedFile)){
      await ExpLoad(selectedFile,"README");
    }
  }


  useEffect(()=>{
    FileChange()
  },[selectedFile])





  useEffect(()=>{
    if(data){
        Object.keys(data).map(async (key)=>{
            if(hasREADME(key)){
                setSelectedFile(key);
                if(data[key]){
                  await ExpLoad(data[key],"README");
                }
            }
            return null
        })
    }
  },[data])

  return (
    <>
      <input
        type="text"
        placeholder="username"
        value={userName}
        onChange={(e) => {e.preventDefault();setUserName(e.target.value)}}
        name=""
        id=""
      />
      <input
        type="text"
        placeholder="repo name"
        value={repoName}
        onChange={(e) => {e.preventDefault();setRepoName(e.target.value)}}
        name=""
        id=""
      />
      <button onClick={getRepo}> get </button>

      <div className=" flex flex-row">
        {dataLoading ? (
          <>
            <CircularProgress color="secondary" />
          </>
        ) : (
          <>
            <div>
              {data &&
                Object.keys(data).map((key) => {
                  return <div  key={key} className="flex flex-col">
                <button onClick={(e)=>{e.preventDefault();setSelectedFile(key)} }> <p >{key}</p> </button>
                  </div> 
                })}
            </div>
            <div>{data && Object.keys(data).map((key:any)=>{
                if(selectedFile == key)
                {
                return  <pre key={key} >{data[selectedFile]} </pre>
            }
                
            }) }</div>
            <div> 
              {expLoading ? <>
              dataLoading.....
              </> : <> 
                { explaination && 
                  Object.keys(explaination).map((key) => {
                    return <div dangerouslySetInnerHTML={{__html:explaination[key]}} key={key}></div>
                  })
                }
              </>}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default page;


function hasREADME(string: string) {
    const regex = /README\.md/i; // i flag for case-insensitive search
    return regex.test(string);
}


