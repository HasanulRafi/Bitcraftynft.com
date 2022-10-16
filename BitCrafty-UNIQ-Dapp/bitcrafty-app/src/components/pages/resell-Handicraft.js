import React, {useEffect, useState} from 'react';
import '../style/post-handicraft-for-sale.css';
import {ethers} from 'ethers'
import {marketplaceAddress, tokenAddress} from '../../config'

import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'
import Uniq from 'contracts/UNIQ.json'

function ResellHandicraft() {
    const [input, updateInput] = useState({handicraftImage: '', handicraftPrice: ''})
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const tokenURI = params.tokenURI;
    const tokenId = params.tokenId;

    useEffect(() => {
        loadHandicraft()
    }, [])

    async function loadHandicraft() {
        fetch(tokenURI).then(value => value.json()).then(data => updateInput(state => ({
            ...state,
            handicraftImage: data.image
        })))
    }

    async function listHandicraftForSale() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        const tokenContract = new ethers.Contract(tokenAddress, Uniq.abi, provider.getSigner())
        let priceInEther = null
        try {
            priceInEther = ethers.utils.parseUnits(input.handicraftPrice, 'ether')
        } catch (e) {
            alert("Please enter a decimal value for price")
            window.location.reload();
            return
        }
        try {
            let listingPrice = await contract.getListingPrice(priceInEther)
            let transactionForApproval = await tokenContract.approve(marketplaceAddress, listingPrice);
            await transactionForApproval.wait()
            const transaction = await contract.resellHandicraft(tokenId, priceInEther)
            await transaction.wait()
        } catch (error) {
            alert(error.data.message);
            return
        }
        window.location.assign('/')
    }


    return (
        <div>
            <br/>
            <input
                placeholder="Asset Price in UNIQ"
                className="assetPrice"
                onChange={e => updateInput({...input, handicraftPrice: e.target.value})}
            />
            <br/>
            {
                input.handicraftImage && (
                    <img className="rounded mt-4" width="350" src={input.handicraftImage} alt="Product Reselling"/>
                )
            }
            <br/>
            <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={listHandicraftForSale}>List Item for Sale
            </button>
        </div>
    )
}

export default ResellHandicraft;