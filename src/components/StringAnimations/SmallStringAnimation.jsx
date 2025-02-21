/* eslint-disable no-unused-vars */
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'

const SmallStringAnimation = () => {
    const string1Ref = useRef(null);
    const defaultPath = "M 1 50 Q 150 50 350 50";
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setIsMouseOver(true);
            const svgElement = string1Ref.current.querySelector('svg');
            if (svgElement) {
                const boundingBox = svgElement.getBoundingClientRect();
                const relativeX = event.clientX - boundingBox.left;
                const relativeY = event.clientY - boundingBox.top;

                const newPath = `M 1 50 Q ${relativeX} ${relativeY} 350 50`;

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
            <div ref={string1Ref} id="string1" className='lg:flex items-center justify-center mt-[-6vh] w-full overflow-visible z-[5] hidden'>
                <svg id="str1" width="350" height="100" className='z-[5]'>
                    <path d="M 1 50 Q 170 50 340 50" stroke="#33333355" fill="transparent" />
                </svg>
            </div>
        </div>
    )
}

export default SmallStringAnimation
