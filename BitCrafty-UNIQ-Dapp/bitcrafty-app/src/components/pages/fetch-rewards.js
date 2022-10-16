import React, {useEffect, useState} from 'react';
import '../style/view-all-listed-handicrafts.css';
import {ethers} from 'ethers'

import {
    marketplaceAddress
} from '../../config'

import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'

function FetchRewards() {
    const [rewardState, setRewardState] = useState('zero')
    useEffect(() => {
        loadTokens()
    }, [])
    async function loadTokens() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        try{
            let reward = await contract.fetchRewards()
            reward = ethers.utils.formatUnits(reward.toString(), 'ether')
            if (reward >= 0.1){
                setRewardState(reward)
            }
        }
        catch (error){
            alert(error.data.message);
        }
    }

    async function redeemReward() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        let reward = ethers.utils.parseUnits(rewardState, 'ether')
        try{
            const transaction = await contract.redeemReward(reward)
            await transaction.wait()
        }
        catch (error){
            alert(error.data.message);
            return
        }
        window.location.assign('/')
    }

    if (rewardState === 'zero') return (<h1 className="px-20 py-10 text-3xl">Please buy items worth 10 ETH and come back to claim your rewards!</h1>)
    return (
        <>
            <div className="nftsListedBySellers">
                {
                        <div>
                            <h2>You have rewards worth {rewardState} UNIQ, Redeem for minimal gas!</h2>
                            <p>
                                <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => redeemReward()}>Redeem Now!</button>
                            </p>
                        </div>
                }
            </div>
        </>
    );
}

export default FetchRewards;
