import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Button, Container, Grid, InputBase, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const requireAll = (context) => context.keys().map(context);
const tokenContext = require.context('../../Assets/tokens', false, /\.svg$/);
const tokenOptions = requireAll(tokenContext).map((path) => {
    const [, token] = path.match(/\/([^/]+)\.svg$/);
    const dotIndex = token.indexOf('.');
    return dotIndex !== -1 ? token.substring(0, dotIndex) : token;

});
// check that token names are correct
// console.log(tokenOptions); 

const SwapComponent = () => {

    const apiUrl = 'https://interview.switcheo.com/prices.json'; // url with price info

    const [fromCurrency, setFromCurrency] = useState('ETH');
    const [toCurrency, setToCurrency] = useState('BLUR');

    const [fromPlaceholder, setFromPlaceholder] = useState('0.002');
    const [toPlaceholder, setToPlaceholder] = useState('0.004');

    const [fromPrice, setFromPrice] = useState('0');
    const [toPrice, setToPrice] = useState('0');

    const [priceMap, setPrices] = useState({});
    
    useEffect(() => {
        // Fetch JSON data and update prices state
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                
                data.forEach((entry) => {
                priceMap[entry.currency] = entry.price;
                });
                setPrices(priceMap);

                // Set fromPrice and toPrice based on selected currencies
                if (fromCurrency in priceMap) {
                    setFromPrice(priceMap[fromCurrency]);
                } else {
                    setFromPrice('NA');
                }

                if (toCurrency in priceMap) {
                    setToPrice(priceMap[toCurrency]);
                } else {
                    setToPrice('NA');
                }

            })
            .catch((error) => {
                console.error('Error during fetch operation:', error);
            });   
    }, [apiUrl, fromCurrency, toCurrency, priceMap]);

    // console.log(priceMap);

    const handleSwap = () => {
        // Swap the currencies
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);

        // Swap the placeholders
        const tempPlaceholder = fromPlaceholder;
        setFromPlaceholder(toPlaceholder);
        setToPlaceholder(tempPlaceholder);

        // Swap the prices
        const tempPrice = fromPrice;
        setFromPrice(toPrice);
        setToPrice(tempPrice);
    };

    const checkSwap = () => {
        // Check if fromCurrency is equal to toCurrency
        if (fromCurrency === toCurrency) {
            alert('Cannot select the same currencies');
            return; // Prevent further execution if currencies are the same
        }

        // Check if fromCurrency is available
        if (fromPrice === 'NA') {
            alert(`${fromCurrency} is not available, please choose another currency.`);
            return;
        }

        // Check if toCurrency is available
        if (toPrice === 'NA') {
            alert(`${toCurrency} is not available, please choose another currency.`);
            return;
        }

        // Check if user keyed in anything 
        if (fromPlaceholder.length < 1 || toPlaceholder.length < 1 ) {
            alert('Please input a value for both From and To currencies.');
            return;
        }

        // Check if user is converting a value of "0" or "0.0"
        if (parseFloat(fromPlaceholder) <= 0 || parseFloat(toPlaceholder) <= 0) {
            alert('Please input a value greater than 0 for both From and To currencies.');
            return;
        }

        // to check if calculation is populated correctly
        // A bit redundant here, but idk how to implement it such that when user change toPlaceholder, the fromPlaceholder changes too.
        // Tried to do the 2-way auto calculation, but once I swap, the values start flickering. 
        // Also, the 2-way auto calculation will change my input value before I could finish typing my input, which is annoying. 
        // So, I removed the 2-way auto calculation. That's why need this extra validation. 
        if (parseFloat(fromPlaceholder) > 0 && parseFloat(toPrice) > 0) {
            const calculatedToPlaceholder = (parseFloat(fromPlaceholder) * parseFloat(fromPrice) * 0.99) / parseFloat(toPrice);
            setToPlaceholder(calculatedToPlaceholder.toFixed(5).toString());
        }
        
    }
    
    const handleInputChange = (value, placeholderSetter) => {
        // Use regex to check if the input is a valid number with at most one dot
        const isValidInput = /^\d*\.?\d*$/.test(value);

        // If the input is valid, update the placeholder
        if (isValidInput) {
            // Check if a dot is pressed without a preceding zero and add a zero in front
            if (value === '.' || (value.startsWith('.') && value.length > 1 )) {
                placeholderSetter(`0${value}`);
            } else {
                // Check if the input starts with "0" and has more than one character
                if (value.startsWith("0") && value.length > 1 && value[1] !== '.') {
                    value = value.substring(1); // Remove the leading zero
                }
                placeholderSetter(value);
            }
        } else {
            // If the input is not valid, you can handle it accordingly, e.g., show an alert
            alert('Invalid input. Please enter a valid number.');
        }
    };

    // to handle icon click, such that clicking icon can open currency menu too
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const selectRefFrom = useRef(null);
    const selectRefTo = useRef(null);
    const handleIconClickFrom = () => {
        setOpenFrom(!openFrom);
    };
    const handleIconClickTo = () => {
        setOpenTo(!openTo);
    };
    useEffect(() => {
        const handleClickOutsideFrom = (event) => {
            if (selectRefFrom.current && !selectRefFrom.current.contains(event.target)) {
                setOpenFrom(false);
            }
        };

        const handleClickOutsideTo = (event) => {
            if (selectRefTo.current && !selectRefTo.current.contains(event.target)) {
                setOpenTo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideFrom);
        document.addEventListener('mousedown', handleClickOutsideTo);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideFrom);
            document.removeEventListener('mousedown', handleClickOutsideTo);
        };
    }, []);

    // to handle currency exchange calculation
    useEffect(() => {
        // Calculate and update toPlaceholder based on the formula
        if (parseFloat(fromPlaceholder) > 0 && parseFloat(toPrice) > 0) {
            const calculatedToPlaceholder = (parseFloat(fromPlaceholder) * parseFloat(fromPrice) * 0.99) / parseFloat(toPrice);
            setToPlaceholder(calculatedToPlaceholder.toFixed(5).toString());
        }
    }, [fromPlaceholder, fromPrice, toPrice]);
    
    return (
        <div>
            <Box bgcolor='#0a1929' paddingY='4rem'>
                <Container maxWidth='lg'>
                    <Grid container>
                        <Grid item md={5} xs={12} margin='auto'>
                            <Box bgcolor='#17293d' padding='2rem' borderRadius='12px'>
                                <Box bgcolor='#0a1929' padding='1.3rem' borderRadius='12px'>
                                    <Box marginBottom='10px' display='flex' alignItems='center' justifyContent='space-between'>
                                        <Typography color='#fff' >
                                            From
                                        </Typography>
                                        <Typography color='#fff' >
                                            Price: {fromPrice * fromPlaceholder < 0.00001
                                                ? "<$0.00001"
                                                : `$${(fromPrice * fromPlaceholder).toFixed(5)}`}
                                        </Typography>
                                    </Box>
                                    <Box className='baseinputbox' flexDirection='row' display='flex' alignItems='center' width='100%'>
                                        <Box paddingX='1rem'>
                                            <Box alignItems='center'>

                                                {/* dropdown selection of tokens */}
                                                <Select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}
                                                    displayEmpty
                                                    input={<InputBase inputProps={{ 'aria-label': 'Without label' }} />}
                                                    MenuProps={{ PaperProps: { style: { backgroundColor: 'darkgrey', paddingRight:'0px' } } }}
                                                    open={openFrom}
                                                    onClose={() => setOpenFrom(false)}
                                                    onOpen={() => setOpenFrom(true)}
                                                    ref={selectRefFrom}
                                                >
                                                    {tokenOptions.map((token) => (
                                                        <MenuItem key={token} value={token}>
                                                            <img src={require(`../../Assets/tokens/${token}.svg`)} width='20px' alt='token' />
                                                            <span style={{color: 'white', marginLeft: '8px', marginRight: '0px' }}>{token}</span>
                                                            <span onClick={handleIconClickFrom} style={{ cursor: 'pointer', marginLeft: '0px', marginRight:'0px' }}>
                                                                <ArrowDropDownIcon sx={{ color: '#fff' }} />
                                                            </span>
                                                        </MenuItem>
                                                        
                                                    ))}
                                                           
                                                </Select>
                                                
                                            </Box>
                                            
                                        </Box>
                                        <Box width='100%'>
                                            <InputBase
                                                type='text'
                                                id=''
                                                placeholder={fromPlaceholder}
                                                className='baseinput'
                                                inputProps={{ style: { color: '#fff' } }}
                                                value={fromPlaceholder}
                                                onChange={(e) => handleInputChange(e.target.value, setFromPlaceholder)}
                                            />
                                            
                                        </Box>
                                    </Box>
                                </Box>
                                <Box marginY='2rem'>
                                    <Box textAlign='center' onClick={handleSwap} style={{ cursor: 'pointer' }}>
                                        <SwapVertIcon sx={{ color: '#fff' }} />
                                    </Box>
                                </Box>
                                <Box bgcolor='#0a1929' padding='1.3rem' borderRadius='12px'>
                                    <Box marginBottom='10px' display='flex' alignItems='center' justifyContent='space-between'>
                                        <Typography color='#fff'>
                                            To
                                        </Typography>
                                        <Typography color='#fff'>
                                        Price: {toPrice * toPlaceholder < 0.00001
                                                ? "<$0.00001"
                                                : `$${(toPrice * toPlaceholder).toFixed(5)}`}
                                        </Typography>
                                    </Box>
                                    <Box className='baseinputbox' flexDirection='row' display='flex' alignItems='center' width='100%'>
                                        <Box paddingX='1rem'>
                                            <Box alignItems='center'>
                                                
                                                {/* dropdown selection of tokens */}
                                                <Select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}
                                                    displayEmpty
                                                    input={<InputBase inputProps={{ 'aria-label': 'Without label' }} />}
                                                    MenuProps={{ PaperProps: { style: { backgroundColor: 'darkgrey', paddingRight:'0px' } } }}
                                                    open={openTo}
                                                    onClose={() => setOpenTo(false)}
                                                    onOpen={() => setOpenTo(true)}
                                                    ref={selectRefTo}
                                                >
                                                    {tokenOptions.map((token) => (
                                                        <MenuItem key={token} value={token}>
                                                            <img src={require(`../../Assets/tokens/${token}.svg`)} width='20px' alt='token' />
                                                            <span style={{color: 'white', marginLeft: '8px', marginRight: '0px' }}>{token}</span>
                                                            <span onClick={handleIconClickTo} style={{ cursor: 'pointer', marginLeft: '0px', marginRight:'0px' }}>
                                                                <ArrowDropDownIcon sx={{ color: '#fff' }} />
                                                            </span>
                                                        </MenuItem>
                                                    ))}
                                                    
                                                </Select>
                                                
                                            </Box>
                                        </Box>
                                        <Box width='100%'>
                                            <InputBase
                                                type='text'
                                                id=''
                                                placeholder={toPlaceholder}
                                                className='baseinput'
                                                inputProps={{ style: { color: '#fff' } }}
                                                value={toPlaceholder}
                                                onChange={(e) => handleInputChange(e.target.value, setToPlaceholder)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box marginTop='2rem' display="flex" justifyContent="center">
                                    <Typography color='grey'>
                                        1 {fromCurrency} = {(fromPrice/toPrice).toFixed(8)} {toCurrency} 
                                    </Typography>
                                </Box>
                                <Box marginY='1rem' display="flex" justifyContent="space-between">
                                    {/* Left column */}
                                    <Box display="flex" flexDirection="column" textAlign="left">
                                        <Typography color='grey'>
                                            Platform fee
                                        </Typography>
                                        <Typography color='grey'>
                                            Network cost (1%)
                                        </Typography>
                                    </Box>
                                    {/* Right column */}
                                    <Box display="flex" flexDirection="column" textAlign="right">
                                        <Typography color='grey'>
                                            $0
                                        </Typography>
                                        <Typography color='grey'>
                                            ${(fromPlaceholder*fromPrice*0.01).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* <Box bgcolor='#17293d' padding='1.3rem' borderRadius='12px'>
                                </Box> */}

                                <Box marginTop='2rem' textAlign='center' width='100%'>
                                    <Button sx={{ width: '100%' }} variant='contained' className='btn-theme1' onClick={checkSwap} >
                                        Swap
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default SwapComponent;
