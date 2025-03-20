/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const CursorAnimation = ({ parentRef }) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFD633'];
    let prevX = 0;
    let prevY = 0;

    const createCrackler = (x, y, direction) => {
        const crackler = document.createElement('div');
        crackler.classList.add('crackler');
        parentRef.current.appendChild(crackler);

        crackler.style.left = `${x}px`;
        crackler.style.top = `${y}px`;

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        crackler.style.backgroundColor = randomColor;

        const randomAngle = direction === 'vertical' ? Math.random() * 180 : Math.random() * 180 + 90;
        const randomDistance = Math.random() * 20 + 10;
        const size = Math.random() * 5 + 1;
        const duration = Math.random() * 0.08 + 0.1;

        const radianAngle = randomAngle * (Math.PI / 180);
        const offsetX = Math.cos(radianAngle) * randomDistance;
        const offsetY = Math.sin(radianAngle) * randomDistance;

        const randomRotation = Math.random() * 360;

        crackler.style.width = `${size}px`;
        crackler.style.height = `${size * 2}px`;

        gsap.to(crackler, {
            opacity: 1,
            x: offsetX,
            y: offsetY,
            rotation: randomRotation,
            duration: duration,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(crackler, {
                    opacity: 0,
                    duration: 0.1,
                    onComplete: () => crackler.remove()
                });
            }
        });
    };

    useEffect(() => {
        const burstCrackers = (x, y) => {
            const deltaX = x - prevX;
            const deltaY = y - prevY;

            let direction;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = 'vertical';
            } else {
                direction = 'horizontal';
            }

            for (let i = 0; i < 3; i++) {
                createCrackler(x, y, direction);
            }

            prevX = x;
            prevY = y;
        };

        let timeout;

        const handleMouseMove = (e) => {
            const rect = parentRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            burstCrackers(x, y);

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                prevX = x;
                prevY = y;
            }, 100);
        };

        const parentElement = parentRef.current;
        parentElement.addEventListener('mousemove', handleMouseMove);

        return () => {
            parentElement.removeEventListener('mousemove', handleMouseMove);
        };
    }, [parentRef]);

    return null;
};

export default CursorAnimation;
