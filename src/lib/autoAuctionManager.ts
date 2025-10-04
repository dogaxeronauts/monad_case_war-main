import { ethers } from 'ethers';

// AutoAuctionContract ABI
const AUTO_AUCTION_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "minPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      }
    ],
    "name": "AuctionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "finalPrice",
        "type": "uint256"
      }
    ],
    "name": "AuctionEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "BidPlaced",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_treasuryAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_nftContracts",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_minPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationMinutes",
        "type": "uint256"
      }
    ],
    "name": "createAuction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "getAuction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "nftContracts",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "minPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "highestBidder",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "ended",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "getAuctionBids",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "auctionId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bidder",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "playerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "treasuryAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct AutoAuctionContract.Bid[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentAuctionId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserAuctions",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "isAuctionActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_playerAddress",
        "type": "address"
      }
    ],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Monad Testnet Configuration
const MONAD_TESTNET_CONFIG = {
  chainId: 84532,
  name: 'Monad Testnet',
  rpcUrl: 'https://rpc.testnet.monad.xyz',
  blockExplorerUrl: 'https://explorer.testnet.monad.xyz',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
};

// Interface definitions
interface PlayerUpdateData {
  playerAddress: string;
  treasuryAddress: string;
  bidAmount: number;
  auctionId: string;
  timestamp: number;
}

interface AuctionDetails {
  id: number;
  creator: string;
  treasuryAddress: string;
  title: string;
  nftContracts: string[];
  minPrice: bigint;
  currentPrice: bigint;
  endTime: number;
  highestBidder: string;
  playerAddress: string;
  ended: boolean;
}

interface AutoBidResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: bigint;
}

export class AutoAuctionManager {
  private provider: ethers.JsonRpcProvider;
  private gameWallet: ethers.Wallet | null = null;
  private auctionContract: ethers.Contract | null = null;
  private contractAddress: string;

  constructor(contractAddress?: string) {
    // Initialize provider for Monad testnet
    this.provider = new ethers.JsonRpcProvider(MONAD_TESTNET_CONFIG.rpcUrl);
    this.contractAddress = contractAddress || process.env.VITE_AUTO_AUCTION_CONTRACT_ADDRESS || '';
    
    this.initializeGameWallet();
  }

  /**
   * Initialize game wallet from environment variable
   */
  private initializeGameWallet(): void {
    try {
      const privateKey = process.env.VITE_GAME_WALLET_PRIVATE_KEY;
      
      if (!privateKey) {
        console.warn('Game wallet private key not found in environment variables');
        return;
      }

      // Create wallet from private key
      this.gameWallet = new ethers.Wallet(privateKey, this.provider);
      
      // Initialize contract instance
      if (this.contractAddress) {
        this.auctionContract = new ethers.Contract(
          this.contractAddress,
          AUTO_AUCTION_ABI,
          this.gameWallet
        );
      }

      console.log('Game wallet initialized:', this.gameWallet.address);
    } catch (error) {
      console.error('Failed to initialize game wallet:', error);
    }
  }

  /**
   * Set the auction contract address
   */
  setContractAddress(address: string): void {
    this.contractAddress = address;
    if (this.gameWallet) {
      this.auctionContract = new ethers.Contract(
        address,
        AUTO_AUCTION_ABI,
        this.gameWallet
      );
    }
  }

  /**
   * Create a new auction automatically
   */
  async createAuction(
    treasuryAddress: string,
    title: string,
    nftContracts: string[],
    minPriceMon: number,
    durationMinutes: number
  ): Promise<{ success: boolean; auctionId?: number; transactionHash?: string; error?: string }> {
    try {
      if (!this.auctionContract || !this.gameWallet) {
        throw new Error('Auction contract or game wallet not initialized');
      }

      const minPriceWei = ethers.parseEther(minPriceMon.toString());

      // Estimate gas
      const gasEstimate = await this.auctionContract.createAuction.estimateGas(
        treasuryAddress,
        title,
        nftContracts,
        minPriceWei,
        durationMinutes
      );

      // Create auction transaction
      const tx = await this.auctionContract.createAuction(
        treasuryAddress,
        title,
        nftContracts,
        minPriceWei,
        durationMinutes,
        {
          gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
        }
      );

      console.log('Auction creation transaction sent:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Parse auction created event to get auction ID
      const auctionCreatedEvent = receipt.logs.find((log: any) => {
        try {
          return this.auctionContract!.interface.parseLog(log)?.name === 'AuctionCreated';
        } catch {
          return false;
        }
      });

      let auctionId = 0;
      if (auctionCreatedEvent) {
        const parsedEvent = this.auctionContract.interface.parseLog(auctionCreatedEvent);
        auctionId = Number(parsedEvent?.args[0] || 0);
      }

      return {
        success: true,
        auctionId,
        transactionHash: tx.hash,
      };

    } catch (error: any) {
      console.error('Failed to create auction:', error);
      return {
        success: false,
        error: error.message || 'Failed to create auction',
      };
    }
  }

  /**
   * Place an automatic bid on behalf of a player
   */
  async placeBid(
    auctionId: number,
    playerAddress: string,
    bidAmountMon: number
  ): Promise<AutoBidResult> {
    try {
      if (!this.auctionContract || !this.gameWallet) {
        throw new Error('Auction contract or game wallet not initialized');
      }

      // Validate auction is active
      const isActive = await this.auctionContract.isAuctionActive(auctionId);
      if (!isActive) {
        throw new Error('Auction is not active');
      }

      const bidAmountWei = ethers.parseEther(bidAmountMon.toString());

      // Get current auction details for validation
      const auctionDetails = await this.getAuctionDetails(auctionId);
      if (!auctionDetails) {
        throw new Error('Auction not found');
      }

      // Ensure bid is higher than current price + increment
      const minBidAmount = auctionDetails.currentPrice + (auctionDetails.currentPrice / BigInt(10));
      if (bidAmountWei < minBidAmount) {
        throw new Error(`Bid amount too low. Minimum: ${ethers.formatEther(minBidAmount)} MON`);
      }

      // Estimate gas
      const gasEstimate = await this.auctionContract.placeBid.estimateGas(
        auctionId,
        playerAddress,
        { value: bidAmountWei }
      );

      // Place bid transaction
      const tx = await this.auctionContract.placeBid(
        auctionId,
        playerAddress,
        {
          value: bidAmountWei,
          gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
        }
      );

      console.log('Bid transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed,
      };

    } catch (error: any) {
      console.error('Failed to place bid:', error);
      return {
        success: false,
        error: error.message || 'Failed to place bid',
      };
    }
  }

  /**
   * Get auction details
   */
  async getAuctionDetails(auctionId: number): Promise<AuctionDetails | null> {
    try {
      if (!this.auctionContract) {
        throw new Error('Auction contract not initialized');
      }

      const auctionData = await this.auctionContract.getAuction(auctionId);
      
      return {
        id: Number(auctionData[0]),
        creator: auctionData[1],
        treasuryAddress: auctionData[2],
        title: auctionData[3],
        nftContracts: auctionData[4],
        minPrice: auctionData[5],
        currentPrice: auctionData[6],
        endTime: Number(auctionData[7]),
        highestBidder: auctionData[8],
        playerAddress: auctionData[9],
        ended: auctionData[10],
      };

    } catch (error) {
      console.error('Failed to get auction details:', error);
      return null;
    }
  }

  /**
   * Get auction bids
   */
  async getAuctionBids(auctionId: number): Promise<any[]> {
    try {
      if (!this.auctionContract) {
        throw new Error('Auction contract not initialized');
      }

      const bids = await this.auctionContract.getAuctionBids(auctionId);
      return bids.map((bid: any) => ({
        auctionId: Number(bid.auctionId),
        bidder: bid.bidder,
        playerAddress: bid.playerAddress,
        treasuryAddress: bid.treasuryAddress,
        amount: bid.amount,
        timestamp: Number(bid.timestamp),
      }));

    } catch (error) {
      console.error('Failed to get auction bids:', error);
      return [];
    }
  }

  /**
   * Get game wallet address
   */
  getGameWalletAddress(): string | null {
    return this.gameWallet?.address || null;
  }

  /**
   * Get game wallet balance
   */
  async getGameWalletBalance(): Promise<string> {
    try {
      if (!this.gameWallet) {
        return '0';
      }

      const balance = await this.provider.getBalance(this.gameWallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return '0';
    }
  }

  /**
   * Listen for auction events
   */
  onAuctionEvents(callback: (event: any) => void): void {
    if (!this.auctionContract) {
      console.warn('Auction contract not initialized');
      return;
    }

    // Listen for AuctionCreated events
    this.auctionContract.on('AuctionCreated', (auctionId, creator, treasuryAddress, title, minPrice, endTime) => {
      callback({
        type: 'AuctionCreated',
        auctionId: Number(auctionId),
        creator,
        treasuryAddress,
        title,
        minPrice,
        endTime: Number(endTime),
      });
    });

    // Listen for BidPlaced events
    this.auctionContract.on('BidPlaced', (auctionId, bidder, playerAddress, treasuryAddress, amount, timestamp) => {
      callback({
        type: 'BidPlaced',
        auctionId: Number(auctionId),
        bidder,
        playerAddress,
        treasuryAddress,
        amount,
        timestamp: Number(timestamp),
      });
    });

    // Listen for AuctionEnded events
    this.auctionContract.on('AuctionEnded', (auctionId, winner, playerAddress, finalPrice) => {
      callback({
        type: 'AuctionEnded',
        auctionId: Number(auctionId),
        winner,
        playerAddress,
        finalPrice,
      });
    });
  }

  /**
   * Stop listening for events
   */
  removeAllListeners(): void {
    if (this.auctionContract) {
      this.auctionContract.removeAllListeners();
    }
  }

  /**
   * Create player update data structure (based on chopnad-game format)
   */
  createPlayerUpdateData(
    playerAddress: string,
    treasuryAddress: string,
    bidAmount: number,
    auctionId: string
  ): PlayerUpdateData {
    return {
      playerAddress,
      treasuryAddress,
      bidAmount,
      auctionId,
      timestamp: Date.now(),
    };
  }
}

// Singleton instance
export const autoAuctionManager = new AutoAuctionManager();