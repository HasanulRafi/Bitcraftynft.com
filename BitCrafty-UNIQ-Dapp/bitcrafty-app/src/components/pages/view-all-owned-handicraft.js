import React, {useEffect, useState} from 'react';
import '../style/view-all-listed-handicrafts.css';
import {ethers} from 'ethers'

import {
    marketplaceAddress
} from '../../config'

import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'

function ViewAllOwnedHandicrafts() {
    const [handicrafts, setHandicrafts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadMyOwnedHandicrafts()
    }, [])

    async function loadMyOwnedHandicrafts() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        try {
            const data = await contract.fetchMyHandicrafts()
            const items = await Promise.all(data.map(async value => {
                const tokenUri = await contract.getTokenURI(value.handicraftId)
                let price = ethers.utils.formatUnits(value.price.toString(), 'ether')
                let item = fetch(tokenUri).then(value => value.json()).then(data => {
                    let item = {
                        price,
                        handicraftId: value.handicraftId.toNumber(),
                        image: data.image,
                        name: data.name,
                        description: data.description,
                        tokenUri
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

    async function sellHandicraft(handicraft) {
        window.location.assign('/resell-nft?tokenId=' + handicraft.handicraftId + '&tokenURI=' + handicraft.tokenUri)
        loadMyOwnedHandicrafts()
    }

    if (loadingState === 'loaded' && !handicrafts.length) return (
        <h1 className="px-20 py-10 text-3xl">Please Buy a few items and come back later!!!</h1>)
    return (
        <>
            <div className="hanicraftsOwned">
                {
                    handicrafts.map((handicraft, index) =>
                        <div key={index} className="card">
                            <img src={handicraft.image} alt="Product Reselling" className="handicraftImage"/>
                            <h1>Name:{handicraft.name}</h1>
                            <p className="price">Price:{handicraft.price} UNIQ</p>
                            <p>Description:{handicraft.description}</p>
                            <p>
                                <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                                        onClick={() => sellHandicraft(handicraft)}>Sell Now
                                </button>
                            </p>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default ViewAllOwnedHandicrafts;
