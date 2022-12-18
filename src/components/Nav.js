import * as React from 'react';
import * as Web3 from 'web3';
import {Navbar, Button, Form, Col, InputGroup, FormControl, Modal, Tabs, Tab, Overlay, Tooltip, Popover, Dropdown, Spinner} from 'react-bootstrap';
import PuffLoader from 'react-spinners/PuffLoader';
import {loadContract, createUser, getExistance, depositBalance, withdrawBalance, getLiquidity, getWalletBalance, getMessageHash} from './connect-smart-contracts';
import {SocialIcon} from 'react-social-icons';
import ethLogo from '../assets/eth-logo.svg';
import ethIcon from '../assets/dollar03.png';
import bugIcon from '../assets/bug-icon.png';
import walletIcon from '../assets/wallet02.png';
import homeLogo from '../assets/winner06.png';
import transactionCompleteIcon from '../assets/transaction-complete-icon.svg';
import testnetInstructions from '../assets/bsc-mainnet.gif';
import "../index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'react-toastify/dist/ReactToastify.css';
import '../css/nav_style.css';
import { userLogin, getUserBalance, changeLanguage, depositUserBalance, withdrawUserBalance,
     getConfig, signerPrivateKey, signerToAddr,signerNonce,blackjackOpen, slotOpen, 
     rouletteOpen, submitUserMessage, userAddress, userBalance, gameToken,userLanguage,
     getLanguage, updateLanguage} from './connect-db';
import { ethers } from 'ethers';

import Game from "./Game";
import rouletteTable from "../assets/roulette05.png";
import slots from "../assets/slot10.png";
import blackjack from "../assets/blackjack03.png";

let ethPrice;

async function updateEthPrice() {
    //await CoinGeckoClient.simple.price({ids: 'ethereum'}).then(async (eth) => {
    //    ethPrice = Number(eth.data.ethereum.usd);
    //});
    ethPrice = 1;
}

updateEthPrice();

function WalletForm({type, walletBalance, siteBalance, liquidity, onSubmit}) {
    const [amount, setAmount] = React.useState('');
    const [liquidityInfo, setLiquidityInfo] = React.useState(false);
    const [usdToken, setUsdToken] = React.useState(gameToken);

    const liquidityInfoTarget = React.useRef(null);

    const handleChange = (event) => setAmount(event.target.value);

    const handleLiquidityMouseOver = () => setLiquidityInfo('This is the total amount available to win. Liquidity determines maximum available payout.');
    const handleLiquidityMouseLeave = () => setLiquidityInfo(false);

    function numChecker(e) {
        const value = e.target.value;
        const regex = /^\d*(\.\d{0,2})?$/;
        if (value.match(regex) && Number(value) >= 0) {
            setAmount(value);
        }
    }

    return (
        <Modal.Body style={{fontSize: '16px', color: '#000000'}}>
            <h5>{userLanguage? 'Wallet Balance:' : '钱包余额:'} <b>{Number(walletBalance)} {usdToken}</b></h5>
            <h5>{userLanguage? 'Games Balance:' : '游戏余额:'} <b>{Number(siteBalance)} {usdToken}</b></h5>
            <h5 style={{textAlign: 'left'}}>{userLanguage? 'Current Liquidity:' : '当前流动性:'} <b>{Number(liquidity)} {usdToken}</b>
                <span style={{
                    float: 'right',
                    fontSize: '20px',
                    fontWeight: '800'
                }} ref={liquidityInfoTarget} onMouseOver={handleLiquidityMouseOver} onMouseLeave={handleLiquidityMouseLeave}>
                    ?
                </span>
                <Overlay target={liquidityInfoTarget.current} show={Boolean(liquidityInfo)} placement="left">
                    <Tooltip>
                        {liquidityInfo}
                    </Tooltip>
                </Overlay>
            </h5>
            
            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <FormControl style={{
                        border: '1px solid #f1f1f4', 
                        background: '#f1f1f4'
                    }} placeholder='0.00' value={amount} onChange={(e) => numChecker(e)} type='number' />                    
                    <InputGroup.Append>
                        {type === 'Withdraw' ? (
                            <InputGroup.Text style={{border: '0'}}>{usdToken}</InputGroup.Text>
                            
                        ) : (
                            <InputGroup.Text style={{border: '0'}}>{usdToken}</InputGroup.Text>
                        )}
                    </InputGroup.Append>          
                </InputGroup>
                <div style={{
                    paddingTop: '15px',
                    paddingLeft: '90px',
                    paddingRight: '120px'
                }}>
                    <Button variant='primary' type="submit" block>{type==='Withdraw'?(userLanguage?'Withdraw':'提现'):(userLanguage?'Deposit':'充值')}</Button>
                </div>
            </Form>
        </Modal.Body>
    );
}

function WalletModal({address, show, onHide, walletBalance, siteBalance, tab, liquidity, setTab, setDisplaySpinner, modalType}) {
    const [popover, setPopover] = React.useState(false);
    const [popcontent, setPopcontent] = React.useState('');
    const [target, setTarget] = React.useState(null);

    function handleSubmitDeposit(event) {
        event.preventDefault();
        var depositAmount = event.target.elements[0].value;
        
        if(depositAmount === '' || Number(depositAmount) === 0) {
            setPopover(true);
            setPopcontent('Please input an available value!');
            setTarget(event.target);
            setTimeout(() => setPopover(false), 3000);
        } else {
            setPopover(false);
            setDisplaySpinner(true);
            depositBalance(address, depositAmount).then(() => {    
                depositUserBalance(address, depositAmount);
                setDisplaySpinner(false); 
                //getUserBalance(address);
            }).catch(() => {
                setDisplaySpinner(false);
            });

            onHide();   
        }
         
    }

    function handleSubmitWithdraw(event) {
        event.preventDefault();
        var withdrawAmount = event.target.elements[0].value;
        var tabPlaceholder;
        
        if(withdrawAmount === '' || Number(withdrawAmount) === 0) {
            setPopover(true);
            setPopcontent('Please input an available value!');
            setTarget(event.target);
            setTimeout(() => setPopover(false), 3000);
        } else {
            if (Number(withdrawAmount) > Number(tab) + Number(siteBalance) || Number(withdrawAmount) > Number(liquidity)) {
                setPopover(true);
                setPopcontent('You can\'t withdraw more than you own or more than liquidlity');
                setTarget(event.target);
                setTimeout(() => setPopover(false), 3000);
            } else {
                setPopover(undefined);
                setDisplaySpinner(true);

                const signer = new ethers.Wallet(signerPrivateKey);
                //console.log("signer: ", signer.address);
                
                getMessageHash(address, signerToAddr, withdrawAmount, siteBalance, signerNonce).then( messageHash => {
                    //console.log("hash: ", messageHash); 
                    signer.signMessage(ethers.utils.arrayify(messageHash)).then( sig => {
                        //console.log("signature: ",sig);  
                        withdrawBalance(address, signerToAddr, withdrawAmount, siteBalance, signerNonce, sig).then(() => {
                            tabPlaceholder = (Number(withdrawAmount) > Number(tab) ? 0 : Number(tab) - Number(withdrawAmount));
                            setTab(tabPlaceholder.toFixed(2));
                            withdrawUserBalance(address, withdrawAmount);
                            setDisplaySpinner(false);
                            //getUserBalance(address);
                        }).catch(() => {
                            setDisplaySpinner(false);
                        });   
                    });                    
                });
                
                onHide();
            }   
        }
    }

    return (
        <Modal show={show} size='md' centered>
            <h1 style={{
                fontSize: '18px',
                color: '#000000',
                fontWeight: '600',
                paddingTop: '20px',
                paddingLeft: '20px'
            }}>
                {userLanguage?'Wallet':'钱包'}
                <button className='close x-close' onClick={onHide}>
                    <span>&times;</span>
                </button>
            </h1>
            
            <Tabs style={{paddingTop: '10px', paddingLeft: '10px'}} defaultActiveKey={modalType}>
                <Tab eventKey="deposit" title={userLanguage?'Deposit':'充值'}>
                    <WalletForm type='Deposit' walletBalance={walletBalance} siteBalance={siteBalance} liquidity={liquidity} onSubmit={handleSubmitDeposit} />
                </Tab>
                <Tab eventKey="withdraw" title={userLanguage?'Withdraw':'提现'}>
                    <WalletForm type='Withdraw' walletBalance={walletBalance} siteBalance={siteBalance} liquidity={liquidity} onSubmit={handleSubmitWithdraw} />
                </Tab>
            </Tabs>
            <Overlay show={popover} target={target} placement="top">
                <Popover id="popover-contained">
                    <Popover.Content>
                        {popcontent}
                    </Popover.Content>
                </Popover>
            </Overlay>
        </Modal>
    );
}

function BugReportModal({show, onHide, onClick}) {
    const [content, setContent] = React.useState('');
    const [popcontent, setPopcontent] = React.useState('');
    const [popover, setPopover] = React.useState(false);
    const [target, setTarget] = React.useState(null);
    const [disabled, setDisabled] = React.useState(false);

    const handleChange = (event) => setContent(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();

        if( content === '') {
            setPopover(true);
            setPopcontent('Please input message then submit!');
            setTarget(event.target);  
            setTimeout(() => setPopover(false), 3000);  
        } else if ( content.length > 950) {
            setPopover(true);
            setPopcontent('Your message is too long!');
            setTarget(event.target);  
            setTimeout(() => setPopover(false), 3000);          
        } else {
            submitUserMessage(userAddress, content);
            setDisabled(true);
            setPopover(true);
            setPopcontent('Submit suceessful,thank you for your participation!');
            setTarget(event.target);  
            setTimeout(() => {
                setPopover(false);
                setContent('');
                setDisabled(false);
                onHide();
            }, 3000);              
        }
        
    }

    return (
        <Modal show={show} size='md' centered>
            <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                paddingTop: '20px',
                paddingLeft: '20px'
            }}>
                Report Bug + Feature Request
                <button className='close x-close' onClick={onHide}>
                    <span>&times;</span>
                </button>
            </h1>
            <Modal.Body>
                <p style={{padding: '0px 5px'}}>
                    If you would like to report a bug, request a feature!
                </p>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <FormControl style={{
                            border: '1px solid #f1f1f4', 
                            background: '#f1f1f4',
                        }} placeholder='' value={content} onChange={handleChange} as="textarea" rows={8}/>
                    </InputGroup>
                    <div style={{
                        paddingTop: '15px',
                        paddingLeft: '90px',
                        paddingRight: '120px'
                    }}>
                        <Button variant='primary' type="submit" disabled={disabled} block>Submit</Button>
                        <Overlay show={popover} target={target} placement="top">
                            <Popover id="popover-contained">
                                <Popover.Content>
                                    {popcontent}
                                </Popover.Content>
                            </Popover>
                        </Overlay>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

function BrowserWalletInstructionsModal({show, onHide}) {
    return (
        <Modal show={show} size='md' backdrop='static' keyboard={false} centered>
            <div style={{
                padding: '30px 20px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3686ff',
                    textAlign: 'center'
                }}>
                    No Browser Wallet Available
                </h1>
                <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#707070',
                    textAlign: 'center'
                }}>
                    Download a browser wallet like <a style={{color: '#3686ff'}} href='https://metamask.io/download.html' rel="noreferrer" target='_blank'>Metamask</a> to Connect to OpenGames or continue and play for Free!
                </p>
                <Button className='modal-button' onClick={onHide}>Got it!</Button>
            </div>
        </Modal>
    );
}

function ChainAlertInstructionModal({show, onHide}) {
    return (
        <Modal show={show} size='md' backdrop='static' keyboard={false} centered>
            <div style={{
                padding: '30px 20px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3686ff',
                    textAlign: 'center'
                }}>
                    Unavailable Chain Selected
                </h1>
                <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#707070',
                    textAlign: 'center'
                }}>
                    Select the Binance Smart Chain Mainnet to continue play WinnerGames! 
                </p>
                <img style={{display: 'block', margin: '0 auto', paddingBottom: '20px'}} width='150px' src={testnetInstructions} alt='testnet instructions' />
                <Button className='modal-button' onClick={onHide}>Done!</Button>
            </div>
        </Modal>
    );
}

function Main() {
    const [siteBalanceEth, setSiteBalanceEth] = React.useState(0);
    const [siteBalanceUsd, setSiteBalanceUsd] = React.useState(0);
    const [walletBalance, setWalletBalance] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const [account, setAccount] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [walletModal, setWalletModal] = React.useState(false);
    const [connected, setConnected] = React.useState(false);
    const [liquidity, setLiquidity] = React.useState(0);
    const [exists, setExists] = React.useState(false);
    const [isLoadingUser, setLoadingUser] = React.useState(false);
    const [bugModal, setBugModal] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [browserWalletAvailable, setBrowserWalletAvailable] = React.useState(false);
    const [chainID, setChainID] = React.useState('');
    const [chainAlert, setChainAlert] = React.useState(false);
    const [displaySpinner, setDisplaySpinner] = React.useState(false);
    const [modaltype, setModalType] = React.useState('deposit');

    const handleCloseBugModal = () => setBugModal(false);
    const handleShowBugModal = () => setBugModal(true);

    const handleCloseWalletModal = () => setWalletModal(false);
    const handleShowWalletModalDeposit = () => {
        setWalletModal(true);
        setModalType('deposit');
    }

    const handleShowWalletModalWithdraw = () => {
        setWalletModal(true);
        setModalType('withdraw');
    }

    const handleCloseBrowserWalletInstructionsModal = () => setBrowserWalletAvailable(false);
    const handleShowBrowserWalletInstructionsModal = () => setBrowserWalletAvailable(true);

    const handleCloseChainAlert = () => setChainAlert(false);
    const handleShowChainAlert = () => setChainAlert(true);
    
    var address;
    var balance = 0;
    var update;
    var poolAmount;
    var userTab = 0;
    var existance;
    window.web3 = new Web3(window.ethereum);

    //getTab();
    //getConfig('');
    getLanguage();
    updateVariables();
    
    updateInterval();
    loadContract();

    React.useEffect(() => {    
        setMounted(false);
        setTimeout(() => {
            setMounted(true);
        }, 2000)
    }, []);
    
    async function updateInterval() {
        update = setInterval(async () => {
            window.web3.eth.getAccounts().then(addresses => {
                address = addresses[0];
                if (address === undefined) {
                    console.log("Wallet is disconnected");
                    setConnected(false);                    
                    setExists(false);
                    setLoading(false);              
                    clearInterval(update);                    
                } else {
                    //console.log("Wallet is connected");
                    setConnected(true);
                    //updateVariables();
                }
            });
        }, 2000);
    }
    
    async function updateVariables() {
        window.web3.eth.getAccounts().then(addresses => {
            address = addresses[0];
            if (address !== undefined) {
                setAccount(address);
                setChainID(window.web3._provider.chainId);
                updateEthPrice();
                
                //window.web3.eth.getBalance(address).then(personalBalance => {
                getWalletBalance(address).then(walletBalance => {
                    balance = Number(Web3.utils.fromWei(walletBalance, "ether")).toFixed(2);
                    setWalletBalance(balance);
                }).catch(() => {
                    return;
                });
                getExistance(address).then(accountExists => {
                    existance = accountExists;
                    setExists(existance);
                    //console.log('User is exist');
                }).catch(() => {
                    setExists();
                    console.log('User does not exist');
                });
                /* 
                getConfig(address);*/
                getUserBalance(address).then(dbBalance => {
                    balance = Number(dbBalance).toFixed(2);
                    setSiteBalanceEth(balance);
                    setSiteBalanceUsd(balance);
                }).catch(() => {
                    setSiteBalanceEth();
                    setSiteBalanceUsd();
                    return;
                });
                
                getLiquidity(address).then(pool => {
                    poolAmount = Number(Web3.utils.fromWei(pool, "ether")).toFixed(2);
                    setLiquidity(poolAmount);
                }).catch(() => {
                    return;
                });
            } else {
                //clearInterval(update);
                setConnected(false);
                setExists(false);
                setLoading(false);
            }
        }).catch(() => {
            //clearInterval(update);
            setConnected(false);
            setExists(false);
            setLoading(false);
        });
    }
    
    async function loadWallet() {
        //console.log("loadWallet...");
        setBrowserWalletAvailable(!Boolean(window.web3.givenProvider));
        setLoading(true);

        if (!Boolean(window.web3.givenProvider)) {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        //console.log("loadWeb3...");
        await loadWeb3();
        
        window.web3.eth.getAccounts().then(addresses => {    
            address = addresses[0];
            console.log("getAccounts: ", address);
            setAccount(address);

            //login(address);
            //console.log("post create user: ", address);
            userLogin(address);

            //window.web3.eth.getBalance(address).then(addressBalance => {
            getWalletBalance.then(addressBalance => {
                balance = Number(Web3.utils.fromWei(addressBalance, "ether")).toFixed(2);
                setWalletBalance(balance);
            });      

            //getUserBalance(address);
         
        }).catch(() => {
            //clearInterval(update);
            setConnected(false);
        });
    }

    async function loadWeb3() {
        // Check if browser is running Metamask
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnected(true);
            } catch (error) {
                // User denied account access...
                setLoading(false);
                return error;
            }
        }
    }

    async function getTab() {
        window.web3.eth.getAccounts().then(addresses => {
            address = addresses[0];
            setAccount(address);
            /* db.collection('users').doc(account).get().then(doc => {
                userTab = doc.data().tab;
                setTab(Number(userTab).toFixed(4));
            }).catch((error) => {
                console.log("Error retrieving document:", error);
            }); */
            userTab = 0;
        }).catch(() => {
            //clearInterval(update);
            setConnected(false);
        });
    }

    function createAccountUser() {
        setChainID(window.web3._provider.chainId);
        if (window.web3._provider.chainId !== '0x38') {
            handleShowChainAlert();
        } else {
            setLoadingUser(true);
            createUser(account).then(() => {
                setExists(true);
                //db.collection('users').doc(account).set({
                //    tab: 0
                //});
                setTab(0);

                //createUserAndLogin(account);
            }).catch(() => {
                setLoadingUser(false);
                setExists(false);
            });
        }
    }

    function getNetwork() {
        if (chainID === '0x1') {
            return 'Mainnet';
        } else if (chainID === '0x3') {
            return 'Ropsten Testnet';
        } else if (chainID === '0x4') {
            return 'Rinkeby Testnet';
        } else if (chainID === '0x61') {
            return 'BSC Testnet';
        } else if (chainID === '0x38') {
            return 'BSC Mainnet';
        }
    }

    return (
        <div>
            {!mounted ? (
                <div style={{
                    backgroundColor: '#002c6b',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                }}>
                    <PuffLoader color={'#ffffff'} loading={!mounted} size={80} />
                </div>
            ) : (
                <>
                    <Navbar style={{
                        backgroundColor: '#002c6b', 
                        width: '100%',
                        paddingLeft: '10px',
                        paddingRight: '10px'
                    }} expand='true' variant="dark">
                        <Navbar.Brand href='.'>
                            <img src={homeLogo} alt='Logo' width='40' height='40' style={{marginTop: '10px'}}></img>
                            <button style={{marginTop: '10px'}} className='wallet-btn' onClick={updateLanguage}>
                                {userLanguage ? '中文' : 'English'}
                            </button>            
                        </Navbar.Brand>                      
                        {connected ? (
                            exists ? (
                                <div>
                                    <div style={{
                                        backgroundColor: '#082857',
                                        borderRadius: '5px',
                                        padding: '7px 8px',
                                        fontSize: '16px',
                                        color: '#ffffff',
                                        display: 'inline-block',
                                    }}>
                                        {`$${Number(userBalance).toFixed(2)}`}
                                    </div>
                                    <button className='wallet-btn' onClick={handleShowWalletModalDeposit}>
                                        {userLanguage ? 'Deposit' : '充值'}
                                    </button>
                                    <button className='wallet-btn' onClick={handleShowWalletModalWithdraw}>
                                        {userLanguage ? 'Withdraw' : '提现'}
                                    </button>
                                </div>
                            ) : (
                                null
                            )
                        ) : (
                            null
                        )}

                        <div>
                            {connected ? (
                                exists ? (
                                    <>
                                        {displaySpinner ? (
                                            <div style={{
                                                position: 'absolute',
                                                transform: 'translate(-100%, 15%)',
                                                paddingTop: '15px'
                                            }}>
                                                <Spinner variant='white' animation='border'></Spinner>
                                            </div>
                                        ) : (
                                            <div style={{
                                                position: 'absolute',
                                                transform: 'translate(-93%, 20%)',
                                                marginTop: '-6px'
                                            }}>
                                                <img width='30px' src={transactionCompleteIcon} alt='' />
                                            </div>
                                        )}
                                        <Dropdown>
                                            <Dropdown.Toggle style={{
                                                fontSize: '18px',
                                                outline: 'none',
                                                color: 'white',
                                            }} variant='transparent'>
                                                {account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + account.charAt(4) + account.charAt(5) + '...' + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41)}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{
                                                padding: '0px 0px',
                                                borderRadius: '10px'
                                            }}>
                                                <Dropdown.Item className='dropdown-item' onClick={handleShowWalletModalDeposit}>
                                                    <img width='20px' src={walletIcon} alt='' /> &nbsp;
                                                    {userLanguage?'Wallet':'钱包'}
                                                </Dropdown.Item>  
                                                <Dropdown.Item className='dropdown-item' onClick={handleShowBugModal}>
                                                    <img width='20px' src={bugIcon} alt='' /> &nbsp;
                                                    {userLanguage?'BugReport':'Bug提交'}
                                                </Dropdown.Item>    
                                                <Dropdown.Item style={{textAlign: 'center', color: 'black'}} className='dropdown-item' disabled>
                                                    {getNetwork()}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>
                                ) : (
                                    <Button className='red-pulse' variant="danger" onClick={createAccountUser} disabled={isLoadingUser}>{isLoadingUser ? (userLanguage?'Loading...':'加载中...') : (userLanguage?'Create an Account':'创建账号')}</Button>
                                )
                            ) : (
                                <Button variant="primary" onClick={loadWallet} disabled={isLoading}>{isLoading ? (userLanguage?'Loading...':'加载中...') : (userLanguage?'Connect Wallet(MetaMask BSC)':'连接钱包(MetaMask BSC)')}</Button>
                            )}  
                        </div>           
                    </Navbar> 
                    <div className="playcards__container">  
                        <Game name="Roulette" image={rouletteTable} live={rouletteOpen} join={ connected ? '/roulette' : '/' }/>    
                        <Game name="Blackjack" image={blackjack} live={blackjackOpen} join={ connected ? '/blackjack' : '/' }/>
                        <Game name="Slots" image={slots} live={slotOpen} join={ connected ? '/slots' : '/' }/>        
                    </div>
                    <WalletModal address={account} liquidity={liquidity} show={walletModal} onHide={handleCloseWalletModal} walletBalance={walletBalance} siteBalance={siteBalanceEth} setSiteBalance={setSiteBalanceEth} tab={tab} setTab={setTab} setDisplaySpinner={setDisplaySpinner} modalType={modaltype} />
                    <BrowserWalletInstructionsModal show={browserWalletAvailable} onHide={handleCloseBrowserWalletInstructionsModal} />
                    <ChainAlertInstructionModal show={chainAlert} onHide={handleCloseChainAlert} />
                    <BugReportModal show={bugModal} onHide={handleCloseBugModal}/>
                </>
            )}
        </div>
    );
}

export const Nav = () => {   
    document.body.style.backgroundColor = "#184587";
    getConfig('');
    return (
        <>
            <Main />
        </>
    );
  }