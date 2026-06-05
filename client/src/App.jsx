import React from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import BestProperties from "./components/BestProperties";
import FeatureSection from "./components/FeatureSection";
import LuxuryProperties from "./components/LuxuryProperties";
// import View360 from "./components/View360";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Aboutus from "./components/pages/Aboutus";
import Property from "./components/pages/Property";
import Contactus from "./components/pages/Contactus";

import PostProperty from "./components/pages/PostProperty";

import Propertydetails from "./components/pages/Propertydetails";
import Blog from "./components/pages/Blog";
import BlogDetails from "./components/pages/Blogdetails";
import AdminEnquiries from "./components/pages/AdminEnquiries";
import AdminLogin from "./components/pages/AdminLogin";
import AdminProperties from "./components/pages/AdminProperties";
import AddEditProperty from "./components/pages/AddEditProperty";
import AdminLayout from "./components/pages/AdminLayout";
import AdminDashboard from "./components/pages/AdminDashboard";
import PropertyGrid from "./components/pages/PropertyGrid";
import AdminCustomersList from "./components/pages/AdminCustomersList";
import AdminCustomersGrid from "./components/pages/AdminCustomersGrid";
import AdminContacts from "./components/pages/AdminContacts";
import AdminTestimonials from "./components/pages/AdminTestimonials";
import AdminBlogs from "./components/pages/AdminBlogs";
import AdminAddBlog from "./components/pages/AdminAddBlog";
import AdminEditBlog from "./components/pages/AdminEditBlog";
import UserDashboard from "./components/pages/UserDashboard";
import UserLogin from "./components/pages/UserLogin";
import UserRegister from "./components/pages/UserRegister";
import UserAddBlog from "./components/pages/UserAddBlog";
import MyBlogs from "./components/pages/MyBlogs";
import MyProperties from "./components/pages/MyProperties";
import UserLayout from "./components/pages/UserLayout";
import AdminUserProperties from "./components/pages/AdminUserProperties";
import AdminUserBlogs from "./components/pages/AdminUserBlogs";
import AdminUsers from "./components/pages/AdminUsers";
import UserAddProperty from "./components/pages/UserAddProperty";

const Home = () => (
  <>
  <Helmet>
      <link rel="icon" href="/R3developer.png" />
    </Helmet>
    
    <Navbar />
    <Hero />

    <BestProperties />
    <FeatureSection />
    <LuxuryProperties />
    {/* <View360 /> */}
    <Testimonials />
    <Footer />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/location/:locationName" element={<Property />} />

      <Route path="/post-property" element={<PostProperty />} />

      <Route path="/about" element={<Aboutus />} />
      <Route path="/property" element={<Property />} />

      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="add-property" element={<UserAddProperty />} />
        <Route path="edit-property/:id" element={<UserAddProperty />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="user-add-blog" element={<UserAddBlog />} />
        <Route path="edit-blog/:id" element={<UserAddBlog />} />  
        <Route path="my-blogs" element={<MyBlogs />} />
      </Route>

      {/* Dynamic route with property ID */}
      <Route path="/property-details/:slug" element={<Propertydetails />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-details/:id" element={<BlogDetails />} />

      <Route path="/contact" element={<Contactus />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="property-grid" element={<PropertyGrid />} />
        <Route path="add-property" element={<AddEditProperty />} />
        <Route path="edit-property/:id" element={<AddEditProperty />} />
        <Route path="customers-list" element={<AdminCustomersList />} />
        <Route path="customers-grid" element={<AdminCustomersGrid />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="user-properties" element={<AdminUserProperties />} />
        <Route path="user-blogs" element={<AdminUserBlogs />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="add-blog" element={<AdminAddBlog />} />
        <Route path="edit-blog/:id" element={<AdminEditBlog />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
      </Route>
    </Routes>
    </HelmetProvider>
  );
}

export default App;
