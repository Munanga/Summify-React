import React from "react";
import Header from "./Header";

export default function App() {

  const [formData, setFormData] = React.useState("")
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false)
  const [characterCount, setCharacterCount] = React.useState(0)
  const [summaryResponse, setSummaryResponse] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSummaryTextAreaVisible , setIsSummaryTextAreaVisible] = React.useState(false)
  const [infoText, setInfoText] = React.useState(false)

  function handleChange(event){
    const {value} = event.target
    setFormData(function(){
      return value;
    })
    setCharacterCount(value.length)
    
  }

  function handleSubmit(event){
    event.preventDefault()
    if (characterCount < 5){
      alert("Please enter more characters :)")
      return
    }
    setInfoText(true)
    setIsFormSubmitted(true)
    
  }

  React.useEffect(() => {
    if (isFormSubmitted){

      setSummaryResponse("")
      setIsLoading(true)

      const api_key = process.env.REACT_APP_SUMMIFY_API_KEY
      const end_point = process.env.REACT_APP_SUMMIFY_ENDPOINT
      
      fetch(`${end_point}/summarize?api_key=${api_key}`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"text" : formData}) 
        })
        .then(res => res.json())
        .then(data => {
          setIsSummaryTextAreaVisible(true)
          setSummaryResponse(data['summary'])
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false)
          alert(error)
        });
        setIsFormSubmitted(false)
    }
    
  }, [isFormSubmitted])

  return (
    <div className="App">
      <Header />

      <div className="container">
        <h5>Summify summaries essays, articles and text in general</h5>
        <div className="form-floating">
          <form onSubmit={handleSubmit}>
            <textarea 
                onChange={handleChange} 
                value={formData} maxLength="12000"
                className="form-control" style={{height: 280}} 
                placeholder="Enter your text here">
            </textarea>

            <text>Max Characters: 12,000 </text>
            {characterCount >= 12000 ? <text style={{ color: "red" }}>Current Characters: {characterCount} </text>: <text>Current Characters: {characterCount} </text>}

            <br></br>
            <button className="btn btn-primary">Summarize</button>
          </form>
      
        </div>
        
        <br></br>
        <div className="summary-container">
            {infoText && <h5 className="summary-heading">{isLoading ? "Generating Your":"Your" } Summary 😊</h5>}
            {isLoading && <div class="loader"></div>}
        </div>

        {isSummaryTextAreaVisible && <textarea className="form-control" style={{height: 200}} readOnly value={summaryResponse}></textarea>}
      
      </div>
      
    </div>
  );
}
