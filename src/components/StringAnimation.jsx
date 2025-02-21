/* eslint-disable no-unused-vars */
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'

const StringAnimation = () => {
    const string1Ref = useRef(null);
    const defaultPath = "M 10 100 Q 700 100 1440 100";
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setIsMouseOver(true);
            const svgElement = string1Ref.current.querySelector('svg');
            if (svgElement) {
                const boundingBox = svgElement.getBoundingClientRect();
                const relativeX = event.clientX - boundingBox.left;
                const relativeY = event.clientY - boundingBox.top;

                const newPath = `M 10 100 Q ${relativeX} ${relativeY} 1440 100`;

                gsap.to(svgElement.querySelector('path'), {
                    attr: { d: newPath },
                    duration: 0.6,
                    ease: 'power3.out',
                });
            }
        };

        const handleMouseLeave = () => {
            setIsMouseOver(false);
            gsap.to(string1Ref.current.querySelector('svg path'), {
                attr: { d: defaultPath },
                duration: 3,
                ease: 'elastic.out(0.85, 0.11)',
            });
        };

        const string1Element = string1Ref.current;

        if (string1Element) {
            string1Element.addEventListener('mousemove', handleMouseMove);
            string1Element.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (string1Element) {
                string1Element.removeEventListener('mousemove', handleMouseMove);
                string1Element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div>
            <div ref={string1Ref} id="string1" className='lg:flex items-center justify-center h-[6vh] w-full overflow-visible z-[5] hidden mb-8'>
                <svg id="str1" width="1440" height="200" className='z-[5]'>
                    <path d="M 10 100 Q 700 100 1440 100" stroke="#fff" fill="transparent" />
                </svg>
            </div>
        </div>
    )
}

export default StringAnimation
