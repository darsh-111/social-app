import React from 'react'
import { Outlet } from 'react-router-dom'

import Footer from '../Footer/Footer';
import MyNavbar from '../Navbar/Navbar';


export default function Layout() {
    return (

        <>
            <MyNavbar />
            <div className="container min-h-screen  mx-auto w-[80%] ">
                <Outlet />

            </div>
            <Footer />
        </>
    )
}
