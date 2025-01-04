import { useState, useEffect } from "react";
import axios from "axios";
import { Constants } from "../constants";
import "../style/Home.css";
import { Link } from "react-router";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(Constants.Books)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="Home">
      <h1>All Books</h1>
      {data && (
        <ul>
          {data.map((item) => (
            <Link key={item.id} to={`/${item.id}`}>
              <li>
                <h2>{item.title}</h2>
                <p>{item.author}</p>
                <p>Nombre de copies : {item.copies}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
