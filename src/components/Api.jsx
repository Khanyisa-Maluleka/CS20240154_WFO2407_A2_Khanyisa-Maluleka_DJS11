import { useState, useEffect } from 'react';

export default function Api() {
  const [showPreviews, setShowPreviews] = useState([]);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then((response) => response.json())
      .then((data) => {
        setShowPreviews(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      {showPreviews.map((show) => (
        <div key={show.id}>
          <h2>{show.title}</h2>
          <p>{show.description}</p>
          <img src={show.thumbnail} alt={show.title} />
        </div>
      ))}
    </div>
  );
}