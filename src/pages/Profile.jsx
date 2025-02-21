/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Transition from "../Transition";
import useDelayedNavigation from "../utils/useDelayedNavigation";
import axios from "axios";
import BarLoader from "../components/Loaders/CustomLoader1";

const Profile = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isLoggedIn, setisLoggedIn] = useState(null);

    useEffect(() => {
        axios.get('/api/user/profile', { withCredentials: true })
            .then(response => {
                const user = response.data;
                if (response.success) {
                    setisLoggedIn(true);
                } else setisLoggedIn(null);
            })
            .catch(() => setisLoggedIn(null));
    }, []);

    if (isLoggedIn === null) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <>
                <Transition animate={animate} disableEntry={true} />

                <div>
                    <h1>This is Profile Route</h1>
                </div>
            </>
        );
    }


};

export default Profile;
