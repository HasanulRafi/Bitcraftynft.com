# Bitcraftynft.com
@BigRed Hacks 2022

# About

Bitcraftynft.com is a decentralized general-purpose marketplace where users can buy and sell environment friendly handcrafted products and homemade food which ingridiants are fresh local grown. 

Our solution is solving a microeconomic problem by creating a decentralized application and NFT based crypto-currency utilizing Blockchain technology. A part of our application is build upon Pi network utilizing Pi-Tokens. Our application is a micro service architechture based application deployed on AWS server. It utilizes IPFS infeura, a distributed decentralized public ledger to store data. With the help of Pi network and Pi currency we were able to deploy our application to mobile devices. We also developed our own ethereum smart contract based unique currency token named UNIQ.

**Prerequisite for BitCrafty:**

1. Node
2. Ganache
3. Metamask chrome extension
4. Truffle

**Steps to Start the project:**

1.  Go-To: Project Root Directory and Open Command Window.
2.  Run: "cd bitcrafty-app"
3.  Run: "npm install --force"
4.  Run: "cd .."
5.  Run: "cd bitcrafty-contract"
6.  Run: "npm install"
7.	Make sure metamask is connected to ropsten network and have the accounts added. 
8.	Go to the Open metamask and Go To: Security and Privacy in settings and click on �Reveal Secret Recovery Phrase� to get your 12-word security phrase if you don�t have it already.
9.	Go To: truffle-config.js file to paste the MNEMONIC on line 4 to the 12-word secret phrase you copied in previous step. 
10.	Run: "truffle migerate --network ropsten" or, "truffle migerate --reset"
11.	Copy both Contract Address and token address after file 2_deploy_contracts.js is executed from previous step and paste the address in config.js file located at BitCrafty-Dapp\bitcrafty-app\src\config.js
12.	Run: "cd .."
13.	Run: "cd bitcrafty-app"
14.	Run: "npm start"
15.	Visit http://localhost:3000/ .

Run Pi-Bakery: www.bitcraftynft.com
