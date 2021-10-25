import './App.css';
import React, { Children } from 'react';
import { useState,useEffect } from "react";
import { Container,Form,Row,Button,Col,InputGroup,Table,ProgressBar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [username,setUsername] = useState("")
  const [code, setCode] = useState("")
  const [bool_user,setBoolUser] = useState(false)
  const [bool_code,setBoolCode] = useState(false)

  const [game,setGame] = useState({})

  const [code_error,setCodeErorro] = useState("")
  const [input_error,setInputError] = useState("")

  async function handleCode(e) {
    if (code.length > 6) {
      setCodeErorro("Code lenght must be six")
      return
    }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"username":username,"game_code":code})
  };
  await fetch("http://127.0.0.1:8000/api/game",requestOptions)
  .then((response) => response.json())
  .then((data) => {
    if(data.detail===undefined){
      setGame(data)
      console.log(data)
      setBoolCode(true)
      return
    }
    setInputError(data.detail)
    setBoolCode(false)
    setUsername("")
    setCode("")
    setCodeErorro("")
    setBoolUser(false)
  })
  }

  const [qNumber,setNumber] = useState(0)
  const [answer,setAnswer] = useState(0)

  const [stats,setStats] = useState({})
  const [allStats,setAllStats] = useState([])

  async function handleAnsewer(e) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      "answer":answer,
      "game_code":code,
      "question":qNumber+1,
      "username":username})
    };
    await fetch("http://127.0.0.1:8000/api/answer",requestOptions)
    .then((response) => {
      if(!response.ok){
        setInputError("something went wrong, try again")
        setBoolCode(false)
        setUsername("")
        setCode("")
        setCodeErorro("")
        setBoolUser(false)
      }
    })
    setNumber(qNumber+1)
    setAnswer(0)
    if(qNumber+1===game.questions.length){
        await fetch("http://127.0.0.1:8000/api/stats?username="+username+"&game_code="+code)
        .then(response => {
          if (!response.ok){
          setInputError("something went wrong, try again")
          setBoolCode(false)
          setUsername("")
          setCode("")
          setCodeErorro("")
          setBoolUser(false)
          }
          return response.json()
        })
        .then(data => setStats(data))
    }
    await fetch("http://127.0.0.1:8000/api/all-stats?game_code="+code)
    .then(response => {
      if (!response.ok){
      setInputError("something went wrong, try again")
      setBoolCode(false)
      setUsername("")
      setCode("")
      setCodeErorro("")
      setBoolUser(false)
      }
      return response.json()
    })
    .then(data => setAllStats(data))
  }





  const [create,setCreate] = useState(false)
  const [select,SetSelect] = useState(true)

  const [newQ,setNewQ] = useState([])

  const [QName,setQName] = useState("")
  const [a1,setA1] = useState("")
  const [a2,setA2] = useState("")
  const [a3,setA3] = useState("")

  const [gameName,setGameName] = useState("")

  const [QCreateMsg,setQCreateMsg] = useState("")

  const [newCode,setNewCode] = useState(undefined)

  if(select){
    return(
      <div className="data-form">
        <h1>
          Quiz Game
        </h1>
        <Button className="buttons" size="lg" as="input" type="button" value="Create Game" onClick={(e) => 
          {SetSelect(false)
          setCreate(true)}}/>
        <Button className="buttons" size="lg" as="input" type="button" value="Join Game" onClick={(e) => {SetSelect(false)}}/>
      </div>
    )
  }

 

  const createQuestion = () => {
    if(QName.length<1){
      setQCreateMsg("Question Name Too sort")
      return
    }
    if(a1.length<1){
      setQCreateMsg("Answer 1 Name Too sort")
      return
    }
    if(a2.length<1){
      setQCreateMsg("Answer 2 Name Too sort")
      return
    }
    if(a3.length<1){
      setQCreateMsg("Answer 3 Name Too sort")
      return
    }
    if(answer===0){
      setQCreateMsg("Select Correct Answer")
      return
    }
    const array = newQ
    console.log(a1,a2,a3)
    array.push({"question":QName,"answer1":a1,"answer2":a2,"answer3":a3,"correct_answer":answer})
    setNewQ(array)
    setQCreateMsg("Question Added")
    setA1("")
    setA2("")
    setA3("")
    setQName("")
    
  }

  async function CreateGame(e){
    if(gameName.length<3){
      setQCreateMsg("Game Name Too Sort")
      return 
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      "name":gameName,
      "questions":newQ
      })
    };
    await fetch("http://127.0.0.1:8000/api/create-game",requestOptions)
    .then((response) => {
      if(!response.ok){
        setQCreateMsg("something went wrong, try again")
        return undefined
      }
      return response.json()
    })
    .then((data) => {
      if(data!=undefined){
        setNewCode(data.code)
        console.log(data)
      }
    })

  }

  if(newCode!=undefined){
    return (
      <div className="data-form">
        <Container>
          <Row>
            <Col>
            <h2>Game Created</h2>
            </Col>
          </Row>
          <Row>
            <Col>
            Game Code: {newCode}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }


  if(create){
    return(
      <div className="data-form-create">
        <Container>
        <Row>
          <Col>
            <h1>Create Game</h1>
          </Col>
          </Row>
        <Row className="justify-content-md-center">
          <Col xs={12}>
      <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Quiz name"
      onChange={(e) => setGameName(e.target.value)}
      value={gameName}
    />
    <label htmlFor="floatingInputCustom">Quiz name</label>
  </Form.Floating>
  </Col>
  </Row>
  <Row>
    <Col>
    <div>
        <h5>Add Question</h5>
        <Col sm={8}>
        <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Quiz name"
      onChange={(e) => setQName(e.target.value)}
      value={QName}
    />
    <label htmlFor="floatingInputCustom">Question</label>
  </Form.Floating>
  </Col>
  <Col sm={5}>
  <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Quiz name"
      onChange={(e) => setA1(e.target.value)}
      value={a1}
    />
    <label htmlFor="floatingInputCustom">Answer 1</label>
  </Form.Floating>
  </Col>
  <Col sm={5}>
  <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Quiz name"
      onChange={(e) => setA2(e.target.value)}
      value={a2}
    />
    <label htmlFor="floatingInputCustom">Answer 2</label>
  </Form.Floating>
  </Col>
  <Col sm={5}>
  <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Quiz name"
      onChange={(e) => setA3(e.target.value)}
      value={a3}
    />
    <label htmlFor="floatingInputCustom">Answer 3</label>
  </Form.Floating>
  </Col>
  <h4>
    What Is Correct Answer
  </h4>
  <Form.Group as={Row} value="1"  className="justify-content-md-center" onChange={(e) => setAnswer(e.target.id)}>
        <Col sm={2}>
        <Form.Check
          className="checkbox"
          type="radio"
          label="1"
          name="formHorizontalRadios"
          id="1"
          
          
        />
        </Col>
        <Col sm={2}>
        <Form.Check
        className="checkbox"
          type="radio"
          label="2"
          name="formHorizontalRadios"
          id="2"
          
        />
        </Col>
        <Col sm={2}>
        <Form.Check
        className="checkbox"
          type="radio"
          label="3"
          name="formHorizontalRadios"
          id="3"
          
        />
        </Col>
      </Form.Group>
      </div>
    </Col>
  </Row>
  <Row>
    <Col>
    {QCreateMsg}
    <Button className="button" as="input" onClick={createQuestion} type="button" value="Add Question" />
    <Button className="button" as="input" onClick={CreateGame} disabled={newQ.length<1} active={newQ.length<2} type="button" value="Create" />
    </Col>
  </Row>
        </Container>
      </div>
    )
  }




  if(bool_user===false){
    return (
    <div className="data-form">
      <Container fluid="md">
        <Row>
          <Col>
            <h1>Guiz Game</h1>
          </Col>
          </Row>
        <Row className="justify-content-md-center">
          <Col xs={12}>
      <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Your username"
      onChange={(e) => setUsername(e.target.value)}
      value={username}
    />
    <label htmlFor="floatingInputCustom">Your username</label>
  </Form.Floating>
  </Col>
  </Row>
  <Row>
    <Col>
      {input_error}
    </Col>
  </Row>
  <Row>
    <Col>
  <Button  as="input" disabled={username.length<2} active={username.length<2} type="button" value="Continue" onClick={(e) => setBoolUser(true)} />
    </Col>
  </Row>
  </Container>
    </div>
    )
    };

  

  if(bool_code===false){
    return (
      <div className="data-form">
      <Container fluid="md">
        <Row>
          <Col>
            <h1>Guiz Game</h1>
          </Col>
          </Row>
        <Row className="justify-content-md-center">
          <Col xs={12}>
      <Form.Floating className="mb-3">
    <Form.Control
      id="floatingInputCustom"
      placeholder="Enter the game code"
      onChange={(e) => setCode(e.target.value)}
      value={code}
    />
    <label htmlFor="floatingInputCustom">Enter the game code</label>
  </Form.Floating>
  </Col>
  </Row>
  <Row>
    <Col>
      {code_error}
    </Col>
  </Row>
  <Row>
    <Col>
  <Button as="input" disabled={code.length<6} active={code.length<6} type="button" value="Join" onClick={handleCode} />
    </Col>
  </Row>

  </Container>
    </div>
    )
  }


  const Question = (props) => {
    return (
      <div className="data-form">
        <ProgressBar now={qNumber} max={game.questions.length} label={`${((100/game.questions.length)*qNumber).toFixed(0)}%`}/>
        <h2>{game.questions[qNumber].question}</h2>
        <Form.Group as={Row}  className="justify-content-md-center" onChange={(e) => setAnswer(e.target.id)}>
        <Col sm={2}>
        <Form.Check
          className="checkbox"
          type="checkbox"
          label={game.questions[qNumber].answer1}
          name="formHorizontalRadios"
          id="1"
          
          
        />
        </Col>
        <Col sm={2}>
        <Form.Check
        className="checkbox"
          type="checkbox"
          label={game.questions[qNumber].answer2}
          name="formHorizontalRadios"
          id="2"
          
        />
        </Col>
        <Col sm={2}>
        <Form.Check
        className="checkbox"
          type="checkbox"
          label={game.questions[qNumber].answer3}
          name="formHorizontalRadios"
          id="3"
          
        />
        </Col>
      </Form.Group>
        {props.children}

      </div>
    )
  }

  if(qNumber<game.questions.length){
    return(  
    <div>
     <Question>
      <Button as="input" size="md" className="button" disabled={answer===0} active={answer===0} type="button" value="Send" onClick={handleAnsewer} />
    </Question>
    </div>
    )
  }

  
  return(
    <div>
      <div className="data-form">
        <Container>
          <Row>
            <Col>
            <h2>
              Quiz Name: {game.name}
            </h2>
            </Col>
          </Row>
          <Row>
            <Col className="score">
              {username}
            </Col>
            <Col className="score">
              score: {stats.score}/{game.questions.length}
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Well Done!</h3>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="score-board">
        <Container>
          <h3>Scoreboard</h3>
          <Row>
            <Col>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    {allStats.map((data,index) => (
    <tr key={index}>
      <td>
        {index+1}
      </td>
      <td>
        {data.name}
      </td>
      <td>
        {data.score}
      </td>
    </tr> 
    ))}
  </tbody>
</Table>
</Col>
</Row>
</Container>
      </div>
      
    </div>
  )
}

export default App;
