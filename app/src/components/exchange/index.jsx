import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { HiSwitchVertical } from 'react-icons/hi';
import { formatNumber } from '@src/utils/formatNumber';
import ReactLoading from 'react-loading';

export default function Exchange() {
  const [isLoading, setIsLoading] = useState(true);

  const [fromToken, setFromToken] = useState({
    img: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png',
    symbol: 'wXCR',
    address: '0x0d1F718A3079d3B695C733BA2a726873A019299a',
  });

  const [toToken, setToToken] = useState({
    img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    symbol: 'XCR',
    address: '0x0000000000000000000000000000000000000000',
  });

  const [inputData, setInputData] = useState({
    pay: 1,
    rate: 1,
    receive: 1,
  });

  const handleChange = (e) => {
    const newInputData = { ...inputData, [e.target.name]: e.target.value };
    if (e.target.name === 'pay' || e.target.name === 'rate') {
      newInputData.receive = formatNumber(newInputData.pay * newInputData.rate, 18);
    } else if (e.target.name === 'receive') {
      newInputData.rate = formatNumber(newInputData.receive / newInputData.pay, 18);
    }

    setInputData(newInputData);
  };

  const handleSwitchToken = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };


  const handleSubmit = async () => {
    try {
      console.log('submit')
    } catch (error) {
      console.error('error', error)
    }
  };

  const initData = async () => {
    try {
      setIsLoading(true);
      setIsLoading(false);
    } catch (error) {
      console.log('init', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [fromToken, toToken]);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loading}>
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles.title}>OTC</div>
      <div className={styles.inputControl}>
        <div className={styles.label}>Pay</div>
        <div className={styles.inputWrap}>
          <input type="number" value={inputData.pay} name="pay" onChange={handleChange} required />
          <div className={styles.tokenWrap}>
            <img src={fromToken.img} />
            <span>{fromToken.symbol}</span>
          </div>
        </div>
      </div>
      <div className={styles.switchToken}>
        <HiSwitchVertical size={24} color="#fff" cursor="pointer" onClick={handleSwitchToken} />
      </div>
      <div className={styles.inputControl}>
        <div className={styles.label}>Receive</div>
        <div className={styles.inputWrap}>
          <input type="number" value={inputData.receive} name="receive" onChange={handleChange} required />
          <div className={styles.tokenWrap}>
            <img src={toToken.img} />
            <span>{toToken.symbol}</span>
          </div>
        </div>
      </div>
      <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
        Swap
      </button>
    </div>
  );
}