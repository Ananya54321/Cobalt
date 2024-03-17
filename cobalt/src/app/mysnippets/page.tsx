'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Page() {

    const [snippets,setSnippets]= useState<Array<object>>();
    const [filteredSnippets,setFilteredSnippets]= useState<Array<object>>();
    const [selectedSnippet,setSelectedSnippet] = useState<object>();
    const [filter,setFilter] = useState<object>()

    async function getSnippets(){
        try {
          await axios.get('api/users/mysnippets').then((res)=>{
            console.log(res.data.snippets)
            setSnippets(res.data.snippets)
          })      
        } catch (error) {
            
        }
    }

    useEffect(()=>{
            getSnippets();
    },[])


    function FilterSnippets(){
      try {
        const a:any = []
        snippets?.forEach((snippet)=>{
          if(snippet.title.includes(filter.title)){
            if(!a.includes(snippet))
            a.push(snippet);
          }
          if(snippet.description.includes(filter.description)){
            if(!a.includes(snippet))
            a.push(snippet);
          }
          if(filter.tag != ""){
            snippet.tags.forEach((tag)=>{
              if(tag.includes(filter.tag)){
                if(!a.includes(snippet)){
                  a.push(snippet);
                }
              }
            })
          }
          
          if(a.length > 0){
            setFilteredSnippets(a)
          }else{
            setFilteredSnippets(null);
          }
        })
      } catch (error) {
      }
    }

    useEffect(()=>{
      if( filter && (filter.tag == '' || filter.tag == undefined || filter.tag == null) && (filter.description == '' || filter.description == undefined || filter.description == null) && (filter.title == '' || filter.title == undefined || filter.title == null)){
        setFilteredSnippets(null);
      }else{
        FilterSnippets();
      }
      },[filter])
    return (
    <>
    <div>
      <input type="text" onChange={(e)=>{setFilter({...filter,title:e.target.value})}}  name="" id="" />
      <input type="text" onChange={(e)=>{setFilter({...filter,description:e.target.value})}}  name="" id="" />
      <input type="text" onChange={(e)=>{setFilter({...filter,tag:e.target.value})}}  name="" id="" />
    </div>
        <div>
          {(filteredSnippets || snippets ) && <>
          
        {filteredSnippets?.length>0 ? <>
          filtered
          {filteredSnippets && filteredSnippets.map((snippet)=>{
            if(selectedSnippet == snippet){
                return <div className=' border' onClick={()=>{setSelectedSnippet(null)}}   key={snippet._id} >
                <p> {snippet.title} </p>
                <p> {snippet.description} </p>
                <ol>{snippet.tags && snippet.tags.map((tag)=>{
                    return <li key={tag} >{tag}</li>
                })}</ol>
                <pre> {snippet.code}  </pre>
            </div>
            }else{
                return <div className=' border' onClick={()=>{setSelectedSnippet(snippet)}}   key={snippet._id} >
                <p> {snippet.title} </p>
                <p> {snippet.description} </p>
                <ol>{snippet.tags && snippet.tags.map((tag)=>{
                    return <li key={tag} >{tag}</li>
                })}</ol>
            </div>
            }
            
        })}
        
         </> : <>
         non filtered
         
         {snippets && snippets.map((snippet)=>{
            if(selectedSnippet == snippet){
                return <div className=' border' onClick={()=>{setSelectedSnippet(null)}}   key={snippet._id} >
                <p> {snippet.title} </p>
                <p> {snippet.description} </p>
                <ol>{snippet.tags && snippet.tags.map((tag)=>{
                    return <li key={tag} >{tag}</li>
                })}</ol>
                <pre> {snippet.code}  </pre>
            </div>
            }else{
                return <div className=' border' onClick={()=>{setSelectedSnippet(snippet)}}   key={snippet._id} >
                <p> {snippet.title} </p>
                <p> {snippet.description} </p>
                <ol>{snippet.tags && snippet.tags.map((tag)=>{
                    return <li key={tag} >{tag}</li>
                })}</ol>
            </div>
            }
            
        })}

          </>}
          </>
          
          }


       
    </div>
    </>

  )
}

export default Page