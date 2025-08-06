"use client"

import { useEffect } from 'react';

export default function ScrollHandler() {
    useEffect(() => {
        const handleScroll = function(ev) {
            document.body.toggleAttribute('scroll', true);
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                document.body.toggleAttribute('scroll');
            }, 500);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return null;
}