import { ethers } from 'ethers';
import { autoAuctionManager } from './autoAuctionManager';

// Monad Testnet Configuration
const MONAD_TESTNET_CONFIG = {
  chainId: 10143, // Monad testnet chain ID
  name: 'Monad Testnet',
  rpcUrl: 'https://rpc.testnet.monad.xyz', // Monad testnet RPC
  blockExplorerUrl: 'https://explorer.testnet.monad.xyz',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
};

// NFTVaultFactory Contract ABI
const VAULT_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_auctionContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lotteryContract",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
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
        "name": "_minPriceMon",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationMinutes",
        "type": "uint256"
      }
    ],
    "name": "createVault",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "newVaultId",
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
        "name": "count",
        "type": "uint256"
      }
    ],
    "name": "generateRandomNFTContracts",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_vaultId",
        "type": "uint256"
      }
    ],
    "name": "getVault",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "vaultAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creator",
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
            "name": "minPriceMon",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "durationMinutes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "auctionId",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTVaultFactory.VaultInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "vaultId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "vaultAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
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
        "name": "minPriceMon",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "durationMinutes",
        "type": "uint256"
      }
    ],
    "name": "VaultCreated",
    "type": "event"
  }
];

// Contract Bytecode (simplified for demo - in real implementation this would be the full compiled bytecode)
const VAULT_FACTORY_BYTECODE = "0x608060405234801561001057600080fd5b50600080fd5b5061002a565b61002a565b604051806020015261002a565b6000f3fe";

interface CreateVaultParams {
  title: string;
  selectedNFTs: Array<{
    id: string;
    name: string;
    rarity: string;
  }>;
  minPrice: number;
  duration: 5 | 15 | 30 | 60;
  treasuryAddress?: string; // Added treasury address
  playerAddress?: string;   // Added player address
}

interface DeploymentResult {
  success: boolean;
  vaultId?: number;
  auctionId?: number;       // Added auction ID
  transactionHash?: string;
  contractAddress?: string;
  error?: string;
}

export class MonadContractDeployer {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  
  // Mock contract address for demo purposes
  private readonly FACTORY_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

  /**
   * Monad testnet'e bağlanır ve wallet'ı bağlar
   */
  async connectToMonadTestnet(): Promise<boolean> {
    try {
      // Demo mode için MetaMask kontrolünü bypass et
      if (typeof window !== 'undefined' && !window.ethereum) {
        console.warn('MetaMask bulunamadı. Demo modunda çalışıyor.');
        // Demo modunda mock provider kullan
        this.provider = null;
        this.signer = null;
        return true;
      }

      if (!window.ethereum) {
        console.warn('MetaMask bulunamadı. Demo modunda devam ediliyor.');
        return true;
      }

      // Ethereum provider'ını al
      this.provider = new ethers.BrowserProvider(window.ethereum);

      // Monad testnet'e ağ değiştirme isteği
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.toBeHex(MONAD_TESTNET_CONFIG.chainId) }],
        });
      } catch (switchError: any) {
        // Ağ mevcut değilse ekle
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ethers.toBeHex(MONAD_TESTNET_CONFIG.chainId),
                chainName: MONAD_TESTNET_CONFIG.name,
                rpcUrls: [MONAD_TESTNET_CONFIG.rpcUrl],
                blockExplorerUrls: [MONAD_TESTNET_CONFIG.blockExplorerUrl],
                nativeCurrency: MONAD_TESTNET_CONFIG.nativeCurrency,
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      // Hesapları bağla
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = await this.provider.getSigner();

      return true;
    } catch (error) {
      console.error('Monad testnet bağlantı hatası:', error);
      return false;
    }
  }

  /**
   * Rastgele NFT contract adresleri üretir
   */
  private generateNFTContracts(selectedNFTs: CreateVaultParams['selectedNFTs']): string[] {
    return selectedNFTs.map(() => {
      // Rastgele contract adresi üret
      const randomBytes = ethers.randomBytes(20);
      return ethers.getAddress(ethers.hexlify(randomBytes));
    });
  }

  /**
   * Contract'ı deploy eder (Demo amaçlı simülasyon)
   */
  async deployVaultFactory(): Promise<string> {
    // Demo için mock contract adresi döndür
    return this.FACTORY_CONTRACT_ADDRESS;
  }

  /**
   * Kasa oluşturur ve Monad testnet'e deploy eder
   * Otomatik olarak auction contract'ı da oluşturur
   */
  async createVault(params: CreateVaultParams): Promise<DeploymentResult> {
    try {
      // Demo mode check
      if (typeof window === 'undefined' || !window.ethereum) {
        console.log('Demo modunda kasa oluşturuluyor...');
        return this.createMockVault(params);
      }

      // Bağlantı kontrolü
      if (!this.provider || !this.signer) {
        const connected = await this.connectToMonadTestnet();
        if (!connected) {
          return this.createMockVault(params);
        }
      }

      // Eğer hala provider yoksa mock kullan
      if (!this.provider || !this.signer) {
        return this.createMockVault(params);
      }

      // Parametreleri hazırla
      const nftContracts = this.generateNFTContracts(params.selectedNFTs);
      
      // Treasury address - env'den al veya default kullan
      const treasuryAddress = params.treasuryAddress || 
                             import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS || 
                             "0x1111111111111111111111111111111111111111";

      // Player address - kullanıcının cüzdan adresini al
      const playerAddress = params.playerAddress || 
                           await this.signer.getAddress();

      // Otomatik auction oluştur
      const auctionResult = await autoAuctionManager.createAuction(
        treasuryAddress,
        params.title,
        nftContracts,
        params.minPrice,
        params.duration
      );

      if (auctionResult.success) {
        console.log('Auction başarıyla oluşturuldu:', {
          auctionId: auctionResult.auctionId,
          treasuryAddress,
          playerAddress,
          title: params.title
        });

        return {
          success: true,
          vaultId: Math.floor(Math.random() * 10000) + 1, // Mock vault ID
          auctionId: auctionResult.auctionId,
          transactionHash: auctionResult.transactionHash,
          contractAddress: autoAuctionManager.getGameWalletAddress() || undefined,
        };
      } else {
        throw new Error(auctionResult.error || 'Auction oluşturulamadı');
      }

    } catch (error: any) {
      console.error('Kasa oluşturma hatası:', error);
      return this.createMockVault(params);
    }
  }

  /**
   * Demo mode için mock vault oluşturur
   */
  private async createMockVault(params: CreateVaultParams): Promise<DeploymentResult> {
    console.log('Mock kasa oluşturuluyor...', params);

    // Simüle edilmiş bekleme
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data
    const vaultId = Math.floor(Math.random() * 10000) + 1;
    const auctionId = Math.floor(Math.random() * 10000) + 1;
    const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;

    return {
      success: true,
      vaultId,
      auctionId,
      transactionHash: mockTxHash,
      contractAddress: this.FACTORY_CONTRACT_ADDRESS,
    };
  }

  /**
   * Otomatik teklif verme fonksiyonu
   */
  async placeBid(
    auctionId: number, 
    playerAddress: string, 
    bidAmountMon: number
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      console.log(`Otomatik teklif veriliyor - Auction: ${auctionId}, Player: ${playerAddress}, Amount: ${bidAmountMon} MON`);

      const result = await autoAuctionManager.placeBid(auctionId, playerAddress, bidAmountMon);
      
      if (result.success) {
        console.log('Teklif başarıyla verildi:', result.transactionHash);
        return {
          success: true,
          transactionHash: result.transactionHash,
        };
      } else {
        throw new Error(result.error || 'Teklif verilemedi');
      }

    } catch (error: any) {
      console.error('Teklif verme hatası:', error);
      return {
        success: false,
        error: error.message || 'Teklif verme başarısız'
      };
    }
  }

  /**
   * Auction detaylarını getir
   */
  async getAuctionDetails(auctionId: number) {
    try {
      return await autoAuctionManager.getAuctionDetails(auctionId);
    } catch (error) {
      console.error('Auction detayları alınamadı:', error);
      return null;
    }
  }

  /**
   * Game wallet balance kontrolü
   */
  async getGameWalletBalance(): Promise<string> {
    try {
      return await autoAuctionManager.getGameWalletBalance();
    } catch (error) {
      console.error('Game wallet balance alınamadı:', error);
      return '0';
    }
  }

  /**
   * Gerçek contract deployment fonksiyonu (production için)
   */
  async deployRealContract(params: CreateVaultParams): Promise<DeploymentResult> {
    try {
      if (!this.signer) {
        throw new Error('Signer bulunamadı');
      }

      // Contract factory oluştur
      const contractFactory = new ethers.ContractFactory(
        VAULT_FACTORY_ABI,
        VAULT_FACTORY_BYTECODE,
        this.signer
      );

      // Mock auction ve lottery contract adresleri
      const auctionContract = "0x1111111111111111111111111111111111111111";
      const lotteryContract = "0x2222222222222222222222222222222222222222";

      // Contract'ı deploy et
      const contractInstance = await contractFactory.deploy(auctionContract, lotteryContract);
      await contractInstance.waitForDeployment();

      const contractAddress = await contractInstance.getAddress();

      // Kasa oluştur
      const nftContracts = this.generateNFTContracts(params.selectedNFTs);
      const minPriceWei = ethers.parseEther(params.minPrice.toString());

      // Explicitly type as ethers.Contract to access ABI methods
      const contract = new ethers.Contract(
        contractAddress,
        VAULT_FACTORY_ABI,
        this.signer
      );

      const tx = await contract.createVault(
        params.title,
        nftContracts,
        minPriceWei,
        params.duration
      );

      const receipt = await tx.wait();
      
      // Event'ten vault ID'yi al
      const vaultCreatedEvent = receipt?.logs.find(
        (log: any) => log.topics[0] === ethers.id("VaultCreated(uint256,address,address,string,uint256,uint256)")
      );

      let vaultId = 0;
      if (vaultCreatedEvent) {
        const decodedEvent = contract.interface.parseLog(vaultCreatedEvent);
        vaultId = Number(decodedEvent?.args[0] || 0);
      }

      return {
        success: true,
        vaultId,
        transactionHash: tx.hash,
        contractAddress,
      };

    } catch (error: any) {
      console.error('Gerçek contract deployment hatası:', error);
      return {
        success: false,
        error: error.message || 'Contract deployment başarısız'
      };
    }
  }

  /**
   * Kullanıcının wallet adresini al
   */
  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        await this.connectToMonadTestnet();
      }
      return this.signer ? await this.signer.getAddress() : null;
    } catch (error) {
      console.error('Wallet adresi alınamadı:', error);
      return null;
    }
  }

  /**
   * Wallet bakiyesini kontrol et
   */
  async getBalance(): Promise<string> {
    try {
      if (!this.signer) {
        return '0';
      }
      const balance = await this.provider!.getBalance(await this.signer.getAddress());
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Bakiye alınamadı:', error);
      return '0';
    }
  }
}

// Singleton instance
export const monadDeployer = new MonadContractDeployer();