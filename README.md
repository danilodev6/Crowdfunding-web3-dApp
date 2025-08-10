# Crowdfunding Web3 dApp 🚀

A decentralized crowdfunding application enabling creators to raise funds transparently through smart contracts built with **thirdweb** platform.

## 🌟 Features

- **Decentralized Fundraising**: Create and manage crowdfunding campaigns on the blockchain
- **Transparent Transactions**: All donations and withdrawals are recorded on-chain
- **Smart Contract Security**: Funds are held securely in smart contracts until goals are met
- **Creator Dashboard**: Campaign creators can track progress and manage their projects
- **Donor Protection**: Transparent fund allocation and automatic refunds for failed campaigns
- **MetaMask Integration**: Seamless Web3 wallet connectivity
- **Responsive Design**: Mobile-friendly interface for all devices

## 🛠️ Tech Stack

- **Frontend**: React.js, JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: thirdweb SDK
- **Smart Contracts**: Solidity
- **Wallet Connection**: MetaMask, WalletConnect
- **Blockchain**: Ethereum (or compatible networks)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension
- A thirdweb account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/danilodev6/Crowdfunding-web3-dApp.git
cd Crowdfunding-web3-dApp
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
REACT_APP_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
REACT_APP_NETWORK=ethereum
```

To get your thirdweb Client ID:
1. Visit [thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or use an existing one
3. Copy your Client ID from the project settings

### 4. Deploy Smart Contract (if not already deployed)

1. Visit [thirdweb Deploy](https://thirdweb.com/deploy)
2. Upload your crowdfunding smart contract
3. Configure the contract parameters
4. Deploy to your preferred network
5. Copy the contract address to your `.env` file

### 5. Start Development Server

```bash
# Using npm
npm start

# Or using yarn
yarn start
```

The application will open in your browser at `http://localhost:3000`

## 📱 Usage

### For Campaign Creators

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Create Campaign**: 
   - Fill in campaign details (title, description, goal amount, deadline)
   - Upload campaign image
   - Set funding goal in ETH
   - Submit transaction to create campaign
3. **Manage Campaign**: Track donations, update supporters, and withdraw funds when goal is reached

### For Donors

1. **Browse Campaigns**: Explore active crowdfunding campaigns
2. **View Details**: Check campaign progress, description, and creator information
3. **Make Donation**: 
   - Select campaign to support
   - Enter donation amount
   - Confirm transaction in MetaMask
4. **Track Contributions**: View your donation history and campaign updates

## 🏗️ Project Structure

```
crowdfunding-web3-dapp/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── CampaignCard.jsx
│   │   ├── CreateCampaign.jsx
│   │   └── CampaignDetails.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── CampaignPage.jsx
│   ├── context/
│   │   └── index.jsx
│   ├── utils/
│   │   └── constants.js
│   ├── assets/
│   └── App.js
├── contracts/
│   └── CrowdFunding.sol
├── package.json
└── README.md
```

## 🔧 Smart Contract Functions

### Main Contract Functions

- `createCampaign()`: Creates a new crowdfunding campaign
- `donateToCampaign()`: Allows users to donate to a specific campaign  
- `getDonators()`: Retrieves list of donators for a campaign
- `getCampaigns()`: Returns all active campaigns
- `getUserCampaigns()`: Gets campaigns created by specific user
- `withdrawFunds()`: Allows campaign creator to withdraw funds when goal is met

## 🌐 Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism  
- Base
- Other thirdweb supported networks

## 🔒 Security Features

- **Smart Contract Auditing**: Contracts follow OpenZeppelin standards
- **Transparent Fund Management**: All transactions are publicly verifiable
- **Automatic Refunds**: Failed campaigns automatically enable refunds
- **Access Control**: Only campaign creators can withdraw their funds
- **Deadline Enforcement**: Time-based campaign restrictions

## 🚀 Deployment

### Deploy to Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**:
   - **Vercel**: Connect your GitHub repository
   - **Netlify**: Drag and drop the `build` folder
   - **IPFS**: Use thirdweb's decentralized hosting

3. **Update environment variables** in your hosting platform

### Deploy Smart Contract

Using thirdweb Deploy:
```bash
npx thirdweb deploy
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**:
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Clear browser cache and restart

2. **Transaction Failures**:
   - Check if you have sufficient ETH for gas fees
   - Ensure contract is deployed on the correct network
   - Verify contract address in environment variables

3. **Campaign Not Loading**:
   - Confirm thirdweb client ID is correct
   - Check network connection
   - Verify smart contract is properly deployed

## 📚 Resources

- [thirdweb Documentation](https://portal.thirdweb.com/)
- [React.js Documentation](https://reactjs.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [thirdweb](https://thirdweb.com/) for the amazing Web3 development platform
- [OpenZeppelin](https://openzeppelin.com/) for smart contract security standards
- The Web3 community for continuous support and feedback

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Join the [thirdweb Discord](https://discord.gg/thirdweb)
- Check the [thirdweb documentation](https://portal.thirdweb.com/)

---

**Made with ❤️ by [danilodev6](https://github.com/danilodev6)**

*Empowering creators through decentralized crowdfunding* 🌍
