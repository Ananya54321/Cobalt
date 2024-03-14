'use client';
import React, { useState ,useEffect} from "react";
export default function SnippetComponent(){
   
    let [snippetData,setSnippetData]=useState({
        title:"",
        description:"",
        code:"",
        
    })
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState('');
  
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
      };
  
    const addTag = (e) => {
        e.preventDefault();
        
      if (tagInput.trim() !== '') {
        setTags(prevTags => {
          if (prevTags !== '') {
            return `${prevTags}#${tagInput.trim()}`;
          } else {
            return `#${tagInput.trim()}`;
          }
        });
        setTagInput('');
        
      }
    };
    let handleInputChange=(event)=>{
        let fieldName=event.target.name;
        let newValue=event.target.value;
       setSnippetData((currData)=>{
        
        return {...currData,
        [fieldName]:newValue};
       }


       )
    }
    useEffect(()=>{
        console.log(tags);
    },[tags])
    return(
        <div>
            <form>
            <label htmlFor="title">Title</label>
            <input placeholder="Enter name" type="text" value={snippetData.title} onChange={handleInputChange} id="title" name="title"></input>
            <label htmlFor="code">Add the code snippet</label>
            <textarea placeholder="Your code"  value={snippetData.code} onChange={handleInputChange} id="code" name="code"></textarea>
            <label htmlFor="description">Description</label>
            <textarea placeholder="What is the snippet about" value={snippetData.description} onChange={handleInputChange} id="description" name="description"></textarea>

            <input
        type="text"
        value={tagInput}
        onChange={handleTagInputChange}
        placeholder="Enter a tag"
      />
      <button onClick={addTag}>Add Tag</button>
      
        <button>Add Snippet</button>

            </form>
            
    </div>
    );
   
    
   

    
  
    

   
}