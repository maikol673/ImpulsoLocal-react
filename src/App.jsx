
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';  


// Componentes comunes (se muestran en todas las páginas)
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Importación de páginas desde sus respectivas carpetas
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Ventures from './pages/Ventures/Ventures';
import Publish from './pages/Publish/Publish';
import Admin from './pages/Admin/Admin';
import VentureDetail from './pages/VentureDetail/VentureDetail';
import MyVentures from './pages/MyVentures/MyVentures';
import EditVenture from './pages/EditVenture/EditVenture';
import Profile from './pages/Profile/Profile';
import AddReview from './pages/AddReview/AddReview';
import CreateTestimonial from './pages/CreateTestimonial/CreateTestimonial';
import MyLikes from './pages/MyLikes/MyLikes';
import EditProfile from './pages/EditProfile/EditProfile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import MyOrders from './pages/MyOrders/MyOrders';  
import OrderDetail from './pages/OrderDetail/OrderDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import AddProduct from './pages/AddProduct/AddProduct';
import Settings from './pages/Settings/Settings';
import SettingsNotifications from './pages/SettingsNotifications/SettingsNotifications';
import ChatList from './pages/ChatList/ChatList';
import ChatDetail from './pages/ChatDetail/ChatDetail';
import ConfirmDeleteChat from './pages/ConfirmDeleteChat/ConfirmDeleteChat';
import MyEvents from './pages/MyEvents/MyEvents';
import MyCourses from './pages/MyCourses/MyCourses';
import CourseDetail from './pages/CourseDetail/CourseDetail';
import Courses from './pages/Courses/Courses';
import Networking from './pages/Networking/Networking';
import EditProduct from './pages/EditProduct/EditProduct';




function App() {
  return (
    <div className="App">
      {/* Header - Barra de navegación superior */}
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />           
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} /> 
        <Route path="/ventures" element={<Ventures />} /> 
        <Route path="/publish" element={<Publish />} />   
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/venture/:id" element={<VentureDetail />} />
        <Route path="/my-ventures" element={<MyVentures />} />
        <Route path="/edit-venture/:id" element={<EditVenture />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/add-review/:id" element={<AddReview />} />
        <Route path="/create-testimonial" element={<CreateTestimonial />} />
        <Route path="/my-likes" element={<MyLikes />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/add-product/:id" element={<AddProduct />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/notifications" element={<SettingsNotifications />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="/delete-chat/:id" element={<ConfirmDeleteChat />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/networking" element={<Networking />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
      
      {/* Footer - Pie de página */}
      <Footer />
    </div>
  );
}

export default App;