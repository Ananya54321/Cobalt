"use client"
import React, { useState } from 'react'
import fetchDirectoryContents from '@/helpers/github/gitApi'

function page() {
    const [repo , setRepo] = useState(String);
    const [data, setData] = useState<object>();
    const [userName, setUserName] = useState(String);
    const[repoName, setRepoName] = useState(String);

  
    const getRepo = async()=>{
        if(repoName==null || userName == null){
            return null;
        }
        const c = localStorage.getItem(`${userName}/${repoName}`)
        if(c == null){
            try {
                await fetchDirectoryContents(userName,repoName).then((content)=>{
                    if(content==null){
                        console.log('error fetching')
                    }else{
                        setData(content);
                        localStorage.setItem(`${userName}/${repoName}`, JSON.stringify(content))
                    }
                })
            } catch (error) {
                console.log('error fetching')
            }
        }else{
            setData(JSON.parse(c));
        }
        
    }

    return (
    <>
    
    <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} name="" id="" />
    <input type="text" value={repoName} onChange={(e)=>setRepoName(e.target.value)} name="" id="" />

    <button onClick={getRepo}  > get </button>

    {data && Object.keys(data).map((key) =>{
        return <p key={ key}>{key}</p>
    })}



    </>
  )
}

export default page