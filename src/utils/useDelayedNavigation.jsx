import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useDelayedNavigation = () => {
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    const handleDelayNavigation = (page) => {
        setAnimate(true);
        setTimeout(() => {
            navigate(`/${page}`);
            setAnimate(false);
        }, 900);
    };

    return { animate, handleDelayNavigation };
};

export default useDelayedNavigation;
