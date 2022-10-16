import React, {useEffect, useState} from 'react';
import '../style/view-all-listed-handicrafts.css';
import {ethers} from 'ethers'

import {
    marketplaceAddress
} from '../../config'

import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'

function ViewUserListedHandicrafts() {
    const [handicrafts, setHandicrafts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadMyListedHandicrafts()
    }, [])

    async function loadMyListedHandicrafts() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        try {
            const data = await contract.fetchMyListedHandicrafts()
            const items = await Promise.all(data.map(async value => {
                const tokenUri = await contract.getTokenURI(value.handicraftId)
                let price = ethers.utils.formatUnits(value.price.toString(), 'ether')
                let item = fetch(tokenUri).then(value => value.json()).then(data =>{
                    console.log(data);
                    let item = {
                        price,
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

    if (loadingState === 'loaded' && !handicrafts.length) return (
        <h1 className="px-20 py-10 text-3xl">Please List a few items and come back later!!!</h1>)
    return (
        <>
            <div className="handicraftListedBySellers">
                {
                    handicrafts.map((handicraft, i) =>
                        <div key={i} className="card">
                            <img src={handicraft.image} alt="Product Selling" className="handicraftImage"/>
                            <h1>Name:{handicraft.name}</h1>
                            <p className="price">Price:{handicraft.price} UNIQ</p>
                            <p>Description:{handicraft.description}</p>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default ViewUserListedHandicrafts;
