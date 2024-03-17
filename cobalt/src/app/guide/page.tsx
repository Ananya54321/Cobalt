"use client"
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import fetchDirectoryContents from '@/helpers/github/gitApi'
import Link from 'next/link';
import SnippetComponent from './SnippetComponent';

function Page() {
  const [data,setData]= useState<object>();
  const [explanations,setExplanations]= useState<object>()
  const [repoName,setRepoName]= useState<string>("")
  const [userName,setUserName]= useState<string>("")
  const [selectedFile,setSelectedFile]= useState<string>()
  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [snippetBox, setSnippetBox] = useState(false)
  const [repLoading,setRepoLoading] = useState(false)
  const [expLoading,setExpLoading] = useState(false);
  const [recentRepos,setRecentRepos] = useState<Array<String>>();

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



  const GetRepo =async()=>{
    if(userName==null || repoName==null ){
      return
    }
    setRepoLoading(true)
    setRecentRepos([...recentRepos,`${userName}/${repoName}`])
    const d = localStorage.getItem(`${userName}/${repoName}`)
    if(d==null){
      try {
        await fetchDirectoryContents(userName,repoName).then((data)=>{
          if(data==null){
            console.log("Cannot fetch")
          }else{
            setData(data)
            console.log(data)
            localStorage.setItem(`${userName}/${repoName}`,JSON.stringify(data))
            Object.keys(data).forEach((key)=>{
              if(hasREADME(key)){
                setSelectedFile(key);
              }
            })
          }
        })
      } catch (error) {
        
    }
  }else{
    setData(JSON.parse(d))
  }
    setRepoLoading(false)
  }

  useEffect(()=>{
    localStorage.setItem("recentRepos",JSON.stringify(recentRepos));
  },[recentRepos])

  const LoadExp = async()=>{
    setExpLoading(true)
    // const cache = localStorage.getItem(`${selectedFile}`)
    const cache = null
    if(selectedFile==null){
      return
    }
    if(cache == null){
      try {
        if(hasREADME(selectedFile)){
          await axios.post('api/users/askgeminitext',{prompt:readMePrompt()}).then((res)=>{
            const d = explanations 
            // d[`${selectedFile}`] = res.data.message
            // setExplanations({...d})
            setExplanations({...explanations,selectedFile:res.data.message})
            localStorage.setItem(`${selectedFile}`,res.data.message)
          })
        }else{
          await axios.post('api/users/askgeminitext',{prompt:FilePrompt()}).then((res)=>{
            setExplanations({...explanations,selectedFile:res.data.message})
            localStorage.setItem(`${selectedFile}`,res.data.message)
          })
        }
      } catch (error) {
        
      }
    }else{
      setExplanations({...explanations,selectedFile:cache})
    }
    setExpLoading(false)
  }

  useEffect(()=>{
    if(selectedFile !=null){
      setExplanations(null);  
      LoadExp()
    }
  },[selectedFile])


  function readMePrompt() {
    const a = "Analyze the given README.md file and provide a comprehensive explanation of the project it describes. Include details about the project's purpose, functionalities, installation instructions, usage steps, and any relevant contributing guidelines. Additionally, identify any links or references mentioned in the Readme that could be helpful for further exploration. give in plain text ,remove all highlighting" + data[selectedFile]
    return a
  }

  
  function FilePrompt() {
    const a = " Analyze the code in <selected file> and provide detailed explanations for each function defined within the file. Explain the purpose of each function, its parameters, return values (if any), and the logic it implements. Additionally, identify any internal function calls or dependencies between functions.. give in plain text ,remove all highlighting" + data[selectedFile]
    return a
  }

  function hasREADME(string: string) {
    const regex = /README\.md/i;
    return regex.test(string);
  }


  useEffect(()=>{
    setRecentRepos(localStorage.getItem('recentRepos')|| null)
  },[])

  return (
    <>
    <input  value={userName} onChange={(e)=>{setUserName(e.target.value)}} type="text" name="" id="" />
    <input value={repoName} onChange={(e)=>{setRepoName(e.target.value)}} type="text" name="" id="" />
    {repLoading ? <>
  <button disabled onClick={(e)=>{e.preventDefault();setData(null);GetRepo()}}>getrepo</button>
    </> :<>
  <button onClick={(e)=>{e.preventDefault();setData(null);GetRepo()}}>getrepo</button>
    </>}

{repLoading ? <>

repo loading......

</> : <>

<div className='flex flex-row'>
    <div>
    {data && Object.keys(data).map((key)=>{
      if(expLoading){
        return <button disabled onClick={(e)=>{e.preventDefault();setSelectedFile(key)}} key={key} > <p>{key}</p> </button>
      }else{
        <button onClick={(e)=>{e.preventDefault();setSelectedFile(key)}} key={key} > <p>{key}</p> </button>
      }
    })}
    </div>


    <div>
      {data && Object.keys(data).map((key)=>{
          if(key == selectedFile)
          return <pre onMouseUp={handleSelection} onMouseDown={()=>{setSelectedText(null)}} key={key}> {data[key]} </pre>
      })}
      {selectedText && (
        <div className='bg-slate-700' style={{ position: 'absolute', top: buttonPosition.y, left: buttonPosition.x }}>
          <button onClick={()=>{setSnippetBox(true)}}>Action</button>
        </div>
      )}
    </div>

    <div>
      {snippetBox ? <>
      <button onClick={()=>{setSnippetBox(false)}}> close </button>
      <SnippetComponent code={selectedText}  /> 
      </> : 
      <>
      {
        expLoading ? <>
        
        Exp Loading.......
        </> : <>
        
        {explanations && Object.keys(explanations).map((key)=>{
        return <pre  key={key}>{explanations[key]} </pre>
      })}
      </>}
        </>
      }
      
    </div>
</div>

</>}


    </>
  )
}

export default Page

