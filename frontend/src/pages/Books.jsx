import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Constants } from "../constants";
import "../style/Books.css";

const Books = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`${Constants.Books}/${params.id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [params.id]);

  const reserver = (book_id) => {
    axios
      .post(`${Constants.BorrwedBooks}`, {
        member_id: 1,
        book_id: book_id,
      })
      .then((response) => {
        alert(`Book Id N${book_id} reserver au member Id N${1}`);
        console.log(response);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deletebook = (book_id) => {
    axios
      .delete(`${Constants.Books}/${book_id}`)
      .then((response) => {
        alert(`Book with Id ${book_id} a ete supprimer`);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.response.data.error}</div>;
  }

  return (
    <div className="Books">
      <div className="Card">
        <h1>Books ID #{data.id}</h1>
        <h2>{data.author}</h2>
        <h3>Copies : {data.copies}</h3>
      </div>

      <div className="buttons">
        <button
          onClick={() => {
            reserver(data.id);
          }}
        >
          reserver
        </button>
        <button
          onClick={() => {
            deletebook(data.id);
          }}
        >
          supprimer
        </button>
      </div>
    </div>
  );
};

export default Books;
