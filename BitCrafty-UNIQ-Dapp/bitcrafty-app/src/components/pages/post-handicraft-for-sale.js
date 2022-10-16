import React, {useState} from 'react';
import '../style/post-handicraft-for-sale.css';
import {ethers} from 'ethers'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {marketplaceAddress, tokenAddress} from '../../config'

import HandicraftMarketPlace from 'contracts/BitCrafty_Contract.json'
import Uniq from 'contracts/UNIQ.json'


const ipfsClient = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function PostHandicraftForSale() {
    const [imageUrl, setImageUrl] = useState(null)
    const [input, updateInput] = useState({handicraftName: '', handicraftPrice: '', handicraftDescription: ''})

    async function onSubmit(event) {
        const file = event.target.files[0]
        const added = await ipfsClient.add(file)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setImageUrl(url)
    }

    async function uploadFile(name, description) {
        const data = JSON.stringify({
            name, description, image: imageUrl
        })
        const added = await ipfsClient.add(data)
        return `https://ipfs.infura.io/ipfs/${added.path}`
    }

    async function listHandicraftForSale() {
        const {handicraftName, handicraftDescription, handicraftPrice} = input
        if (!handicraftName || !handicraftDescription || !handicraftPrice || !imageUrl) {
            alert("Please enter all the values as they are compulsory")
            window.location.reload();
            return
        }
        let priceInEther = null
        try {
            priceInEther = ethers.utils.parseUnits(handicraftPrice, 'ether')
        } catch (e) {
            alert("Please enter a decimal value for price")
            window.location.reload();
            return
        }
        const url = await uploadFile(handicraftName, handicraftDescription)
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        const contract = new ethers.Contract(marketplaceAddress, HandicraftMarketPlace.abi, provider.getSigner())
        const tokenContract = new ethers.Contract(tokenAddress, Uniq.abi, provider.getSigner())
        try {
            let listingPrice = await contract.getListingPrice(priceInEther)
            let transactionForApproval = await tokenContract.approve(marketplaceAddress, listingPrice);
            await transactionForApproval.wait()
            let transaction = await contract.createHandicraftToken(url, priceInEther)
            await transaction.wait()
        } catch (error) {
            alert(error.data.message);
            return
        }
        window.location.assign('/')
    }

    return (<div>
            <br/>
            <input type="text"
                   id="AssetName"
                   className="AssetName"
                   name="Asset Name"
                   placeholder="Please type Asset Name here"
                   onChange={e => updateInput({...input, handicraftName: e.target.value})}/>
            <br/>
            <input type="text"
                   id="desc"
                   name="desc"
                   placeholder="Description"
                   className="AssetDescription"
                   onChange={e => updateInput({...input, handicraftDescription: e.target.value})}/>
            <br/>
            <input
                placeholder="Asset Price in UNIQ"
                className="assetPrice"
                onChange={e => updateInput({...input, handicraftPrice: e.target.value})}
            />
            <br/>
            <label htmlFor="myfile">Select an Image of Handicraft:</label>
            <br/>
            <input type="file" id="myfile" name="myfile" onChange={onSubmit}/>
            <br/>
            {imageUrl && (<img className="rounded mt-4" alt='myfile' width="350" src={imageUrl}/>)}
            <br/>
            <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={listHandicraftForSale}>List Item for Sale
            </button>
        </div>)
}