import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './User';
import Login from './Login';
import Register from './Register';
import { ToastContainer } from 'react-toastify';
import Appheader from './Appheader';
import Crud from './Crud';
import AdminHome from './AdminHome';
import ProtectedRoute from './ProtectedRoute';
import UserDetails from './UserDetails';
import CustomerHome from './CustomerHome';
import { AuthProvider } from './auth/AuthContext'; // Import AuthProvider

function App() {
  return (
    <div className="App">
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
      <Appheader></Appheader>
      <AuthProvider>
      
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<div>Not Authorised to access</div>} />
          <Route path='/register' element={<Register />} />
          <Route path='/:role/:id/crud' element={<ProtectedRoute allowedRoles={['customer','admin']}><Crud /></ProtectedRoute>} />
          <Route path='/customer/:id/customerhome' element={<ProtectedRoute allowedRoles={['customer']}><CustomerHome /></ProtectedRoute>} />
          <Route path='/user' element={<ProtectedRoute allowedRoles={['user']}><User /></ProtectedRoute>} />
          <Route path='/admin/:id/adminhome' element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
          <Route path='/admin/:id/userdetails' element={<ProtectedRoute allowedRoles={['admin']}><UserDetails /></ProtectedRoute>} />
         
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
