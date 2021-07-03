// fetch rates from list of coins
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

export async function fetchRates(coinsList, currency = "usd") {
  const formattedCoinListForAPI = coinsList.join("%2C");
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=" +
        formattedCoinListForAPI +
        "&vs_currencies=" +
        currency.toLowerCase()
    );
    //
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    if (response) {
      const rates = await response.json();
      return rates;
    }
  } catch (error) {
    return error;
  }
}

export async function fetchNews(coinsList) {
  const coinsListFormatted = coinsList.join(",");
  const newsDataURL = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=${coinsListFormatted}&pageNumber=1&pageSize=10&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null`;
  try {
    const response = await fetch(newsDataURL, {
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
        "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      },
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    if (response) {
      const news = await response.json();
      return news;
    }
  } catch (error) {
    return error;
  }
}
