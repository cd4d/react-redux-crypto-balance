import { React, useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import { Button } from 'primereact/button';
import { fetchNews } from "../../../API/API-calls";
import newsSample from "../../../news-sample.json";
export default function BalanceNews(props) {
  const newsPerPage = 5;
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [indexFirstNews, setIndexFirstNews] = useState(0);
  const [indexLastNews, setIndexLastNews] = useState(newsPerPage);
  const [newsData, setNewsData] = useState(newsSample);

  let currentBalance = props.balance;
  let coinsList = currentBalance.map((coin) => coin.name);

  async function refreshNews() {
    setisLoading(true)
    if (coinsList) {
      const response = await fetchNews(coinsList);
      if (response) {
        setNewsData(response);
        setisLoading(false)
      }
    }
  }
  function onCloseError() {
    return;
  }
  function paginate(e) {
    setIndexFirstNews(e.page * newsPerPage + 1);
    setIndexLastNews(e.page === 0 ? newsPerPage : (e.page + 1) * newsPerPage);
  }
  return (
    <>
      <p>Balance News</p>
      <div className="row">
        <div className="col-md-5">
          <h3>News</h3>
        </div>

        <div className="col-md-2">
          <Button
            icon="pi pi-refresh"
            className="p-button-sm"
            onClick={refreshNews}
          ></Button>
        </div>
      </div>
      {isLoading && (
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">
          <p>{error}</p>
          <button className="btn btn-danger" onClick={onCloseError}>
            Close
          </button>
        </div>
      )}
      {!isLoading && <div> {newsData.value
        .slice(indexFirstNews, indexLastNews)
        .map((element, idx) => (
          <div key={idx} className="list-group">
            <a href={element.url}>{element.title}</a>
            <p className="news-description">{ }</p>
          </div>
        ))}
        <Paginator
          first={indexFirstNews}
          rows={newsPerPage}
          totalRecords={newsData.value.length}
          onPageChange={paginate}
        ></Paginator>
      </div>}

    </>
  );
}
