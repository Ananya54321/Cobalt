'use client'
import React, { useState ,useEffect} from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function SnippetComponent({code}){
  

    const router = useRouter()

  useEffect(()=>{
    if(code){
      setSnippetData({...snippetData,code:code})
    }
  },[])


    let [snippetData,setSnippetData]=useState({
        title:"",
        description:"",
        code:"",
        tags: [] 
    })
    const [tagInput, setTagInput] = useState('');
  
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
      };
  
    const addTag = (e) => {
        e.preventDefault();
        
        if (tagInput.trim() !== '') {
            setSnippetData((prevData:any) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()] 
            }));
            setTagInput('');
        }
    };
    
    let handleInputChange=(event)=>{
        let fieldName=event.target.name;
        let newValue=event.target.value;
       setSnippetData((currData)=>{
        
        return {...currData,
        [fieldName]:newValue};
       });
    };
    
    useEffect(()=>{
        console.log(snippetData.tags);
    },[snippetData.tags]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await axios.post('api/users/addsnippet', snippetData).then((res)=>{
            if(res.data.success == false){
                toast.error("Please Login")
                router.push('/login')
                return
              }
          })
            console.log('Sending data to MongoDB:', snippetData);
            
        } catch (error) {
            console.error('Error storing data in MongoDB:', error);
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Add Snippet</button>
            </form>
       </div>
       );
}