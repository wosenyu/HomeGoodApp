// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     fetch('/api/hello')
    //         .then(res => res.json())
    //         .then(data => setMessage(data.message));
    // }, []);

    useEffect(() => {
        fetch('/ping')
            .then(res => res.json())
            .then(data => setMessage(data.message));
    }, []);
    return (
        <div>
            <h1>Full Stack App with Next.js and Express</h1>
            <p>Message from API: {message}</p>
        </div>
    );
}