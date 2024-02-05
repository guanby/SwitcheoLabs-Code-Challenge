interface WalletBalance {
  currency: string;
  amount: number; 
}

// Extend from WalletBalance, so that we don't have to repeat currency and amount and it is easier to maintain in the future.
interface FormattedWalletBalance extends WalletBalance { 
  formatted: string;
}

class Datasource {

  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getPrices(): Promise<any> { 
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) { // if the HTTP response status is not in the range 200-299
        throw new Error(`Failed to fetch prices. Status: ${response.status}`);
      }

      // return the json data from the API
      const prices = await response.json(); 
      return prices;

    } catch (error) { // general error, for unforseen issues
      throw new Error(`Error fetching prices: ${error.message}`);
    }
  }
}

// BoxProps should extend Props, since BoxProps is more specific.
interface BoxProps extends Props {

}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); // calling a custom hook
	const [prices, setPrices] = useState({}); // initialises a state variable named prices

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json"); // Datasource class shld take in one argument
    
    datasource.getPrices().then(prices => { // Datasoure class has .getPrices() function!
      setPrices(prices);
    }).catch(error => {
      console.err(error);
    });
  }, []);

  const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	};

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);

      // where did this lhsPriority come from? is there a typo?
      if (lhsPriority > -99 && balance.amount <= 0) { // combine the if conditions here
		    return true;
		  }
		  return false;
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  } else { // added this since missing one condition where rightPriority = leftPriority
        return 0
      }
    });
  }, [balances, prices]);

  // make use of the FormattedWalletBalance interface defined above
  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  });

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  )
};