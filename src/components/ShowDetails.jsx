import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShowDetails = () => {
  const { showId } = useParams();
  const [showData, setShowData] = useState(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        const data = await response.json();
        setShowData(data);
      } catch (error) {
        console.error(`Error fetching show data for ID ${showId}:`, error);
      }
    };
    fetchShowData();
  }, [showId]);

  if (!showData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{showData.title}</h1>
      <p>{showData.description}</p>
      <p>Seasons: {showData.seasons}</p>
      <img src={showData.image} alt={showData.title} />
      {/* Add more show details here */}
    </div>
  );
};

export default ShowDetails;