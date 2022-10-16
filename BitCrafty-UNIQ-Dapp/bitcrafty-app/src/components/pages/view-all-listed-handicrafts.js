import React, { useEffect, useState } from 'react';
import '../style/view-all-listed-handicrafts.css';
import { ethers } from 'ethers'
import { marketplaceAddress, tokenAddress } from '../../config'
import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'
import UNIQ from 'contracts/UNIQ.json'

function ViewAllListedHandicrafts() {
    const [handicrafts, setHandicrafts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [loadTokens, setLoadingTokens] = useState('not-loaded')
    const [balance, setBalance] = useState('not-present')
    useEffect(() => {
        loadHandicrafts()
    }, [])

    async function loadHandicrafts() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        const tokenContract = new ethers.Contract(tokenAddress, UNIQ.abi, provider.getSigner())
        try {
            const currentAddress = window.web3.currentProvider.selectedAddress;
            let newUserCheck = await contract.getCheckIfAlreadyHaveBonus(currentAddress);
            if (newUserCheck) {
                setLoadingTokens("loaded");
            }
            let balanceOfUser = await tokenContract.balanceOf(currentAddress)
            let balanceInUniq = ethers.utils.formatUnits(balanceOfUser.toString(), 'ether')
            setBalance(balanceInUniq.toString())
            const data = await contract.fetchHandicrafts()
            const items = await Promise.all(data.map(async value => {
                const tokenUri = await contract.getTokenURI(value.handicraftId)
                let price = ethers.utils.formatUnits(value.price.toString(), 'ether')
                let item = fetch(tokenUri).then(value => value.json()).then(data => {
                    console.log(data);
                    let item = {
                        price,
                        handicraftId: value.handicraftId.toNumber(),
                        image: data.image,
                        name: data.name,
                        description: data.description,
                    }
                    return item;
                });
                return item;
            }));
            setHandicrafts(items)
        } catch (error) {
            alert(error.data.message);
            return
        }
        setLoadingState('loaded')
    }

    async function buyItem(handicraft) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        const tokenContract = new ethers.Contract(tokenAddress, UNIQ.abi, provider.getSigner())
        try {
            let priceInEther = ethers.utils.parseUnits(handicraft.price, 'ether')
            let transactionForApproval = await tokenContract.approve(marketplaceAddress, priceInEther)
            await transactionForApproval.wait()
            const transaction = await contract.createMarketSale(handicraft.handicraftId)
            await transaction.wait()
        } catch (error) {
            alert(error.data.message);
            return
        }

        loadHandicrafts()
    }

    async function fetchTokens() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        try {
            const transaction = await contract.getTokens()
            await transaction.wait()
        }
        catch (error) {
            alert(error.data.message);
        }
        setLoadingTokens("loaded");
        loadHandicrafts();
    }

    if (loadTokens === 'not-loaded' && loadingState === 'not-loaded')
        return (<h1 className="px-20 py-10 text-3xl">Checking if you have token, give us a moment!!!!</h1>);
    if (loadTokens === 'not-loaded')
        return (
            <>
                <div className="nftsListedBySellers">
                    {
                        <div>
                            <h2>You have not bought tokens for this marketplace, please get your joining bonus for 1000 UNIQ here, for a minimal gas price!</h2>
                            <p>
                                <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => fetchTokens()}>Get Your Token Now!</button>
                            </p>
                        </div>
                    }
                </div>
            </>
        );
    if (loadingState === 'loaded' && !handicrafts.length) return (
        <>
            <p>Your balance here is {balance} UNIQ</p>
        <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
            
            </>
    );
    return (
        <>
            <p>Your current account balance is {balance} UNIQ</p>
            <div className="handicraftsListedBySellers">
                {
                    handicrafts.map((handicraft, index) =>
                        <div key={index} className="card">
                            <img src={handicraft.image} className="handicraftImage" alt="Product Posted" />
                            <h1>Name:{handicraft.name}</h1>
                            <p className="price">Price:{handicraft.price} UNIQ</p>
                            <p>Description:{handicraft.description}</p>
                            <p>
                                <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                                    onClick={() => buyItem(handicraft)}>Buy
                                </button>
                            </p>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default ViewAllListedHandicrafts;
