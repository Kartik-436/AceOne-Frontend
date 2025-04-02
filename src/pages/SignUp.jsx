/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import FormSignup from "../components/Signup/FormSignup"
import useDelayedNavigation from '../utils/useDelayedNavigation';
import { getOwnerProfile } from '../utils/OwnerService';

const SignUp = () => {
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
            <FormSignup />
            {/* <WrappedSignup/> */}
        </div>
    )
}

export default SignUp
