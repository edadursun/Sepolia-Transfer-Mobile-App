# Sepolia Transfer – React Native Ethereum Wallet App

A cross-platform mobile app (iOS & Android) built with React Native and Expo that lets users send Ethereum on the **Sepolia testnet** to each other, either by connecting **MetaMask** or with a **built-in wallet**.

## Features

- User registration and login with Firebase
- MetaMask / WalletConnect integration
- ETH transfers using ethers.js and web3.js over the Infura RPC
- QR code for receiving payments
- Transaction history
- User profile

## Tech Stack

React Native · Expo · JavaScript · ethers.js · web3.js · wagmi · WalletConnect · Firebase · Infura

## Getting Started

### Prerequisites
- Node.js and npm
- Expo CLI
- An Infura project (Sepolia endpoint)
- A Firebase project

### Installation

```bash
git clone https://github.com/edadursun/Sepolia-Transfer-Mobile-App.git
cd Sepolia-Transfer-Mobile-App
npm install --legacy-peer-deps
```

### Environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_ETHEREUM_NETWORK=sepolia
EXPO_PUBLIC_INFURA_API_KEY=your_infura_api_key
EXPO_PUBLIC_SIGNER_PRIVATE_KEY=your_test_wallet_private_key
EXPO_PUBLIC_METAMASK_ADDRESS=your_wallet_address
```

> ⚠️ Use a **test wallet only**. Never commit real keys. `.env` should be listed in `.gitignore`.

### Run

```bash
npm start        # Expo dev server
npm run android  # Android
npm run ios      # iOS
```

## Note

This project runs on the Sepolia **testnet**. The ETH used has no real value. It was built for learning and demonstration purposes.

## Author

**Eda Dursun**, Computer Engineer · [GitHub](https://github.com/edadursun)
