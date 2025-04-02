/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import FormLogin from './../components/Login/FormLogin';
import { getOwnerProfile } from '../utils/OwnerService';
import useDelayedNavigation from '../utils/useDelayedNavigation';

const LogIn = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    useEffect(() => {
        const handleOwnerLoggedIn = async () => {
            try {
                const response = await getOwnerProfile();

                if (response.success && response.data) {
                    handleDelayNavigation("ownerProfile")
                }
            } catch (error) {
                console.error("getting Owner Error: ", error)
            }
        }

        handleOwnerLoggedIn();
    }, [])

    return (
        <div>
            <FormLogin />
            {/* <WrappedLogin /> */}
        </div>
    )
}

export default LogIn
