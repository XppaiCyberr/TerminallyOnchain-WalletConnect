# 🔗 Terminally Onchain - WalletConnect

A multi-chain Web3 dApp built with Next.js that allows users to send "GM" (Good Morning) messages across multiple blockchain networks and request test ETH from integrated faucets. The app features a sleek terminal-inspired UI and leverages Reown AppKit for seamless wallet connectivity.

## ✨ Features

### 📡 GM Protocol
- **Multi-Chain Support**: Send GM messages across 4 major blockchain networks:
  - Base (Chain ID: 8453)
  - Ethereum Mainnet (Chain ID: 1)
  - Optimism (Chain ID: 10)
  - Arbitrum (Chain ID: 42161)
- **Streak Tracking**: Maintain daily GM streaks on each network
- **GM Counter**: Track total GMs sent per network
- **Smart Contract Integration**: Interact with deployed GM contracts on each chain
- **Custom Messages**: Send personalized GM messages with your transactions

### 💧 ETH Faucet
- **Test ETH Distribution**: Request test ETH from faucets on:
  - Base Sepolia
  - Arbitrum Sepolia
- **Cooldown Timer**: Automatic cooldown period between requests
- **Balance Tracking**: View faucet balance and withdrawal limits
- **Smart Rate Limiting**: Built-in protection against abuse

### 🎨 User Experience
- **Terminal Aesthetic**: Dark, hacker-inspired UI with emerald and blue accents
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Real-time Updates**: Live transaction status and network state
- **Wallet Integration**: Seamless connection with Reown AppKit (WalletConnect v2)
- **Network Switching**: Easy switching between supported networks

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Web3 Libraries**:
  - [Reown AppKit](https://reown.com/) (WalletConnect v2)
  - [Wagmi](https://wagmi.sh/) v2.19.4
  - [Viem](https://viem.sh/) v2.39.3
  - [Ethers.js](https://ethers.org/) v6.15.0
- **State Management**: TanStack Query (React Query)
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Reown/WalletConnect Project ID ([Get one here](https://cloud.reown.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/XppaiCyberr/TerminallyOnchain-WalletConnect.git
cd TerminallyOnchain-WalletConnect
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button in the header
2. Select your preferred wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.)
3. Approve the connection request

### Sending GM Messages

1. Once connected, select a network card from the GM Protocol section
2. Switch to the desired network if prompted
3. Click **"Send GM"** to send a default message, or enter a custom message
4. Approve the transaction in your wallet
5. Watch your GM count and streak increase!

### Requesting Test ETH

1. Navigate to the ETH Faucet section
2. Select either Base or Arbitrum network
3. Click **"Request ETH"**
4. Wait for the cooldown period before requesting again

## 🏗️ Project Structure

```
wct/
├── app/
│   ├── components/
│   │   ├── FaucetNetworkCard.tsx  # Individual faucet network card
│   │   ├── FaucetTool.tsx         # Main faucet interface
│   │   ├── GmNetworkCard.tsx      # Individual GM network card
│   │   ├── GmTool.tsx             # Main GM protocol interface
│   │   └── Header.tsx             # Navigation with wallet connect
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Main landing page
├── config/
│   └── index.tsx                   # Wagmi/AppKit configuration
├── context/
│   └── index.tsx                   # Web3 context provider
├── public/                         # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 📜 Smart Contracts

### GM Protocol Contracts

- **Base**: `0xFbA531cD5CE42CA4e4F6e30cFBcF3Db2556121B9`
- **Ethereum**: `0x6446D1c1629aF33378210fe5fefA7AC8f316F070`
- **Optimism**: `0x701b2c96BD7695dFcD933d382B028E934DFd9D9a`
- **Arbitrum**: `0xE2278AD2De00B570CD6AdED056e57FF4E6F18Efc`

### Faucet Contracts

- **Base Sepolia**: `0x3f8e7255FaD842d0cd19Ccc22149Ab7718f7cb80`
- **Arbitrum Sepolia**: `0x82cb8863311506049963Bf93644509309d76204d`

## 🎯 Features in Detail

### Daily Streak System
The GM protocol tracks your daily activity on each network:
- Send one GM per day to maintain your streak
- Miss a day and your streak resets
- Streaks are tracked independently per network

### Transaction Fees
- Small fee required for each GM transaction
- Fees help prevent spam and support the network
- Amounts are clearly displayed before transaction

### Cooldown Mechanism
Faucets implement a cooldown system:
- Prevents users from draining faucet too quickly
- Timer displays exact time until next withdrawal
- Different cooldown periods per network

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Live Demo](https://your-deployment-url.vercel.app) *(coming soon)*
- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)

## 👤 Author

**XppaiCyberr**
- GitHub: [@XppaiCyberr](https://github.com/XppaiCyberr)

---

*Built with ❤️ for the Web3 community*
