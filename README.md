# Student Grades Management Using Blockchain
## Overview
This project serves research purposes and helps practice knowledge related to blockchain and smart contracts. In this project, I build a private blockchain using Geth to store student grades (on-chain data), while other academic-related information is stored in a MySQL database (off-chain).

Yes, this is a hybrid application that combines blockchain technology with traditional data storage. More information about the project can be found below. I hope this repository serves as a useful resource for anyone starting their journey into blockchain and the Web3 world.

If you have any ideas to contribute, feel free to connet me 😊.

# **Private Chain Architecture**

- **Type:** Private Chain ([What is a private blockchain and why use it?](https://www.dock.io/post/public-vs-private-blockchains#:~:text=A%20private%20blockchain%20is%20a%20decentralized%20ledger%20that%20is%20only,create%20data%20on%20the%20blockchain.))  
- **Consensus Mechanism:** Proof of Authority (PoA)  
- **Genesis Configuration:** See [`private-chain/genesis.json`](private-chain/genesis.json) for more details  

## **Network Node Design Model**  
![Private Chain Design](assets/readme/private-chain-design.png)

# Data Execution Flow for Adding/Updating Grades
![alt text](assets\readme\data-flow.png)

# Example Execution: Adding Score

### 1. Lecturer Signs the Transaction    
![Transaction Signed](assets/readme/adding-score.png)

### 2. Transaction Submitted   
![Transaction Submitted](assets/readme/transaction-submited.png)

### 3. Backend Listens for Confirmation  
![Transaction Success](assets/readme/transaction-success.png)

### 4. Verify on Block Explorer  
![Transaction Verified](assets/readme/transaction-verify.png)

<h1 align="center">
  Tech Stack
</h1>
<div align="center">
  <img alt="Next" src="https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp" height="75" />
  <img alt="Tailwind" src="https://velog.velcdn.com/images/js43o/post/3ab8d087-c4f4-46b5-8f65-6d5e1736b58e/image.png" height="75" />
  <img alt="Nest" src="https://ih1.redbubble.net/image.1084299841.8155/tst,small,507x507-pad,600x600,f8f8f8.jpg" height="75" />
  <img alt="Sodility" src="https://d3hi6wehcrq5by.cloudfront.net/itnavi-blog/Solidity%20l%C3%A0%20g%C3%AC%201.jpg" height="75" />
  <img alt="Sodility" src="https://iq.wiki/_next/image?url=https://ipfs.everipedia.org/ipfs/QmUCodnY99X6QY8GjSLjzW6yjxoZNNaCbo7arsc6LUwr1E&w=1200&q=95" height="75" />
    <img alt="Ether" src="https://cdn.prod.website-files.com/6433e6f821ae13dd37394322/64393ec631a32b4da0ee030c_ethersjs.png" height="75" />
</div>
<div height="75"></div>
