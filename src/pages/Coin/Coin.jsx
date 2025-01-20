import { useParams } from "react-router-dom";
import "./Coin.css";
import { useState, useEffect, useContext } from "react";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loadingCoinData, setLoadingCoinData] = useState(true);
  const [loadingHistoricalData, setLoadingHistoricalData] = useState(true);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      setLoadingCoinData(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-PpNJDibPYSnZnRM7WRBMoNXP",
        },
      };
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
    } finally {
      setLoadingCoinData(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      setLoadingHistoricalData(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-PpNJDibPYSnZnRM7WRBMoNXP",
        },
      };
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error("Error fetching historical data:", err);
    } finally {
      setLoadingHistoricalData(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, [coinId]);

  useEffect(() => {
    fetchHistoricalData();
  }, [currency, coinId]);

  if (loadingCoinData || loadingHistoricalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!coinData || !historicalData) {
    return (
      <div className="error">
        <p>Error loading coin or historical data.</p>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img
          src={coinData.image?.large || ""}
          alt={coinData.name || "Coin"}
        />
        <p>
          <b>
            {coinData.name} ({coinData.symbol?.toUpperCase()})
          </b>
        </p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>
      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour Low </li>
          <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
