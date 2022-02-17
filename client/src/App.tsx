import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './pages/register';
import styled from 'styled-components';

function App() {
  return (
    <Main>
      <Circle1 />
      <Circle2 />
      <Circle3 />
      <Circle4 />
      <Circle5 />
      <Circle6 />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </Main>
  )
}

export default App;

const Main = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #00467f; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #00467f, #a5cc82); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #00467f, #a5cc82); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    overflow: hidden;
`
const Circle1 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 20vh;
  left: 5vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`

const Circle2 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 20vh;
  left: 75vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`

const Circle4 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 70vh;
  left: 35vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`

const Circle5 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 10vh;
  left: 90vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff); 

`

const Circle6 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 80vh;
  left: 55vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff); 

`


const Circle3 = styled.div`
  width: 20vh;
  height: 20vh;
  background-color: red;
  position: absolute;
  top: 50vh;
  left: 15vw;
  border-radius: 50%;
  background: linear-gradient(to right, #076585, #fff);

`

