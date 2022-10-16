**Prerequisite:**

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

**Borrowed Code:**

1. We build our UNIQ token using ERC-20. Borrowed code from ERC-20 documentation and modified it to come up with our own unique token. In the file ERC20 standard is imported from @openzeppline/contracts library and the contract file class is extended with ERC 20.
In order to instantiate the name and symbol of a new token ERC20 constructor is called with name and symbol in argument (both UNIQ in our case)

**How it Works:**

Interaction of UNIQ contract with BitCrafty:

Using ERC-20 standard to implement UNIQ token:

1. A solidity file with the token name UNIQ.sol is created.

2. In the file ERC20 standard is imported from @openzeppline/contracts library and the contract file class is extended with ERC 20.
In order to instantiate the name and symbol of a new token ERC20 constructor is called with name and symbol in argument (both UNIQ in our case).

3. Owner is set to contract address along with that _mint function of ERC20 is called to invoke totalSupply internally and make contract the owner of the total supply.

4. Function airdrop is implemented to transfer 1000 UNIQ tokens to new user from the contract owner.

Interaction of UNIQ contract with BitCrafty:

1. Because the marketplace is supposed to use new type of fungible token the constructor of BitCrafty must have a instance of UNIQ where tokens are minted to the owner already.

2. The deployer gives the “token” address (which is deployed UNIQ address) as input.

3. The instance of UNIQ is obtained using that address and all the transaction-based functions like transfer will be called which is from UNIQ.

Important ERC-20 based functions: 

● registrationReward( ):
This is a key function when it comes to marketplace operation using custom tokens. It allows new users to get 1000 UNIQ tokens as a joining bonus. Just like any other economy every buyer/seller needs some starting money and this method provides that.

● function_transfer( ):
This function is called to transfer tokens from one address to another. In our case from owner to user during airdrop. We are not calling approve here since we don’t need any approval from the smart contract itself.

● fetchHandicrafts( ):
This is one of the key functions in the application which shows all the listed handicrafts from all the sellers. The user can buy any handicraft from this page if they have enough tokens and gas in their wallet to pay.

The front-end JavaScript file invokes the function in the contract and fetches all the listed handicrafts available for sale and then shows handicraft image, price, and description as a card on the web page as well as the current account balance in UNIQ. There is also an option to buy any handicraft using the Buy button.

1. In contract, first the number of unsold items is calculated by subtracting the number of all the handicrafts posted till date with the number of handicrafts which are already sold.
2. All the unsold handcraft map is maintained in the map “idToHandicraft” which takes id as key and returns Handicraft Object as value.
3. A loop for the number obtained in step 1 above is executed and all the Handicrafts obtained are saved into an array.
4. The function checks if the handicrafts are owned by the contract and then the list of items is returned.
The array is then processed by the web page to show all the items.
UNIQ Token balance:

● balanceOf(address account): Returns the amount of tokens owned by the
account.
Token balance will be displayed in the frontend by invoking balanceOf(address account) function by passing the current user account address.

● createMarketSale(handicraftId):
This is a crucial feature of the marketplace where it lets users buy one handicraft at a time and debits transaction tokens from their wallet with totaling amount of product and gas price.

● function approve(address spender, uint256 amount):
This function is called from the session, to approve the smart contract to spend the approved amount on the user's behalf. This will in turn increase the allowance between the user and the smart contract address.

● function transferFrom( ):
This is used to transfer the token from one user to another which also involves
approval.

● fetchRewards() and redeemReward(uint reward):
This is an additional feature of the marketplace that makes it unique by giving users 1%
reward for purchases more than 10 UNIQ to encourage more user participation.

Contract Description:

mapping(uint256 => Handicraft) idToHandicraft : Map used to store all the handicrafts with
handicraftId as key and Handicraft Object as value.
mapping(uint256 => string) tokenUriMapping : Map used to store all the tokenURI with handicraftId as key and URI string as value.
mapping(address => uint256) totalPurchaseValue: Map used to store total purchase amount of a user with user as key and amount integer as value.
struct Handicraft {uint256 handicraftId;address payable seller;address payable owner;uint256 price;bool sold;} : Handicraft object
uint private handicraftsSold: Counter to count number of sold handicrafts.
uint private handicraftIds: Counter to count number of listed handicrafts.
event HandicraftCreated (uint256 indexed handicraftId,address seller,address owner,uint256 price,bool sold): Event to be stored on the blockchain with all the needed data for the handicraft object.
event Transfer(address seller, address owner, uint256 handicraftId): event to transfer ownership of the NFT from seller to owner with handicraftId and record that transaction on blockchain.
event Mint(address to, uint256 handicraftId): event to initialize ownership of the NFT to the seller with handicraftId and record that transaction on blockchain.
modifier priceGreaterThanZero(uint256 price): Modifier to check if the price of listed item is more than 0.
 
 modifier onlyItemOwner(uint256 handicraftId): Modifier to ensure only an item owner can post an item to resell.
modifier amountSpentIsGreaterThan10(): Modifier to ensure that amount spent is more than 10 UNIQ to be eligible for reward.
function createHandicraftToken(string memory tokenURI, uint256 price) payable (uint):
Creates a token based on tokenURI and price and calls mint function to persist that transaction into blockchain.
function getTokenURI(uint256 handicraftId) view (string memory): Function to get handicraftId as input and return tokenURI as output querying the tokenURI map.
function getListingPrice(uint256 price) pure (uint256): Function to calculate and return the listing price of a Handicraft based on the selling price i.e.: 2% of selling price.
function createMarketSale(uint256 handicraftId) payable: Function to transfer ownership of sold handicraft by calling emit Transfer and record the transaction on blockchain.
function resellHandicraft(uint256 handicraftId, uint256 price) payable: Function to relist an owned handicraft for a different price including the listing price from the user.
function fetchHandicrafts() view (Handicraft[] memory): Function to return a list of all handicrafts listed by all the users on the marketplace which are available to buy.
function fetchMyHandicrafts() view (Handicraft[] memory): Function to return list of all handicrafts owned by the user.
function fetchMyListedHandicrafts() view (Handicraft[] memory): Function to return list of all handicrafts listed by user on marketplace which are available to buy.
function fetchRewards() view (uint256): Function to fetch the amount of reward a user is eligible based on his purchases.

function redeemReward(uint reward) payable: Function to credit reward amount to the user wallet.
function transferTokens(uint256 amount, address to, address from) public payable: Invokes transferFrom function of ERC20 to transfer amount from address to “to” address.


