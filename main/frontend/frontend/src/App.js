import './App.css';
import React, { Children } from 'react';
import { useState,useEffect } from "react";
import { Container,Form,Row,Button,Col,InputGroup,Table} from 'react-bootstrap';
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
  }

  const Question = (props) => {
    return (
      <div className="data-form">
        <h2>{game.questions[qNumber].question}</h2>
        <Form.Group as={Row} className="mb-3" onChange={(e) => setAnswer(e.target.id)}>
        <Col sm={10}>
        <Form.Check
          type="checkbox"
          label={game.questions[qNumber].answer1}
          name="formHorizontalRadios"
          id="1"
          
          
        />
        <Form.Check
          type="checkbox"
          label={game.questions[qNumber].answer2}
          name="formHorizontalRadios"
          id="2"
          
        />
        <Form.Check
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

const [stats,setStats] = useState({})

  const GameEnd = (props) => {
    useEffect(() => {
    async function getStats() {
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
    getStats()
  },[])
    return (
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
            <Col>
              {username}
            </Col>
            <Col>
              score: {stats.score}/{game.questions.length}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  const [allStats,setAllStats] = useState([])

  const ScoreBoard = () => {
    useEffect(() => {
      async function getStatsAll() {
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
      getStatsAll()
      console.log("toiiii")
    },[])
    return (
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
        {index}
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
  <Button as="input" disabled={username.length<2} active={username.length<2} type="button" value="Continue" onClick={(e) => setBoolUser(true)} />
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

  if(qNumber<game.questions.length){
    return(
    <Question>
      <Button as="input" disabled={answer===0} active={answer===0} type="button" value="Send" onClick={handleAnsewer} />
      </Question>
    )
  }

  
  return(
    <div>
      <GameEnd/>
      <ScoreBoard/>
    </div>
  )
}

export default App;
