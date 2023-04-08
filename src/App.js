import './App.css';
import { Routes, Route } from 'react-router-dom'
import Main from './pages/Main'
import Repository from './pages/Repository'
import Issues from './pages/Issues'

function App() {
  return (
    <div className="App">
     <Routes>
      <Route path='/' element={ <Main /> }/>
      <Route path='/repository/:repository' element={ <Repository /> }/>
      <Route path='repository/:repository/issues' element={ <Issues /> }/>
     </Routes>
    </div>
  );
}

export default App;
