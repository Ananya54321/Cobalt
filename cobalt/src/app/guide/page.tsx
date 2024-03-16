"use client";
import React, { useEffect, useState } from "react";
import fetchDirectoryContents from "@/helpers/github/gitApi";
import CircularProgress from "@mui/material/CircularProgress";
import { generateResponse } from "@/helpers/generateResponse";
import axios from "axios";

function page() {
  const [repo, setRepo] = useState(String);
  const [data, setData] = useState<object>();
  const [userName, setUserName] = useState(String);
  const [repoName, setRepoName] = useState(String);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(String);
  const[explaination,setExplanation] = useState(String);

  const getRepo = async () => {
    setLoading(true);
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
    setLoading(false);
  };


  useEffect(()=>{
    localStorage.clear();
    if(data){
        Object.keys(data).map((key)=>{
            if(hasREADME(key)){
                setSelectedFile(key);
                if(data[key]){
                    console.log(data[key]);
                    // axios.post('api/users/askgeminitext', {prompt: data[key] })
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
        {loading ? (
          <>
            <CircularProgress color="secondary" />
          </>
        ) : (
          <>
            <div>
              {data &&
                Object.keys(data).map((key) => {
                  return <div  key={key} className="flex flex-col">
                <button onClick={()=>{setSelectedFile(key);console.log(key)} }> <p >{key}</p> </button>
                  </div> 
                })}
            </div>
            <div>{data && Object.keys(data).map((key:any)=>{
                if(selectedFile == key)
                {
                    console.log(data)
                return  <pre key={key} >{data[selectedFile]} </pre>
            }
                
            }) }</div>
            <div> {explaination && <>
            
            
            </>} </div>
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