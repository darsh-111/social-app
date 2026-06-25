import { Outlet } from 'react-router-dom'

import Footer from '../Footer/Footer';
import MyNavbar from '../Navbar/Navbar';


export default function Layout() {
    return (

        <>
            <MyNavbar />
            <div className="w-full px-4 lg:px-0 lg:max-w-3xl xl:max-w-5xl mx-auto min-h-screen">
                <Outlet />

            </div>
            <Footer />
        </>
    )
}
