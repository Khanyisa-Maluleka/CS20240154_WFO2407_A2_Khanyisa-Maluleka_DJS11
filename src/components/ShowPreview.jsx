import { useState, useEffect } from 'react';
import { fetchShowPreviews } from '../api';

const ShowPreview = () => {
  const [showPreviews, setShowPreviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShowPreviews();
        setShowPreviews(data);
      } catch (error) {
        console.error('Error fetching show previews:', error);
      }
    };
    fetchData();
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
};

export default ShowPreview;