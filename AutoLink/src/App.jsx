import {Routes, Route} from  'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'


function App() {
  

  return (
    <Routes>
      <Route path='/register'element={<Register></Register>} />
      <Route path='/login'element={<Login></Login>} />
     
    </Routes>
  )
}

export default App
