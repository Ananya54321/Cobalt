"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import fetchDirectoryContents from '@/helpers/github/gitApi'

function Page() {
  const [data,setData]= useState<object>();
  const [explanations,setExplanations]= useState<object>()
  const [repoName,setRepoName]= useState<string>()
  const [userName,setUserName]= useState<string>()
  const [selectedFile,setSelectedFile]= useState<string>()

  const GetRepo =async()=>{
    if(userName==null || repoName==null ){
      return
    }
    const d = localStorage.getItem(`${userName}/${repoName}`)
    if(d==null){
      try {
        await fetchDirectoryContents(userName,repoName).then((data)=>{
          if(data==null){
            console.log("Cannot fetch")
          }else{
            setData(data)
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
    
  }

  const LoadExp = async()=>{
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
    const regex = /README\.md/i; // i flag for case-insensitive search
    return regex.test(string);
  }

useEffect(()=>{
localStorage.clear()
},[])



  return (
    <>
    <input  value={userName} onChange={(e)=>{setUserName(e.target.value)}} type="text" name="" id="" />
    <input value={repoName} onChange={(e)=>{setRepoName(e.target.value)}} type="text" name="" id="" />
  <button onClick={(e)=>{e.preventDefault();setData(null);GetRepo()}}>getrepo</button>


<div className='flex flex-col'>
    <div>
    {data && Object.keys(data).map((key)=>{
      return <button onClick={(e)=>{e.preventDefault();setSelectedFile(key)}} key={key} > <p>{key}</p> </button>
    })}
    </div>


    <div>
      {data && Object.keys(data).map((key)=>{
          if(key == selectedFile)
          return <pre key={key}> {data[key]} </pre>
      })}
    </div>

    <div>
      {explanations && Object.keys(explanations).map((key)=>{
        console.log(key , selectedFile)
        // return <div dangerouslySetInnerHTML={{ __html: explanations[key]}} />
        return <pre  key={key}>{explanations[key]} </pre>
      })}
    </div>

</div>

    </>
  )
}

export default Page

