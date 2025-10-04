# Otomatik Auction Sistemi - Kullanım Kılavuzu

Bu doküman, otomatik auction kontrat sistemi ve teklif verme mekanizmasının nasıl kullanılacağını açıklar.

## 🚀 Sistem Özellikleri

### 1. Otomatik Auction Contract Oluşturma
- Her auction oluşturulduğunda otomatik olarak blockchain'de contract deploy edilir
- Treasury (kasa) contract adresi ve player address'i otomatik olarak dahil edilir
- Monad testnet üzerinde çalışır

### 2. Otomatik Teklif Verme
- Teklif ver butonuna her basıldığında otomatik olarak blockchain'e transaction gönderilir
- Game wallet kullanarak player address ile birlikte teklif gönderilir
- Treasury address her teklifte otomatik olarak dahil edilir

### 3. Game Wallet İntegrasyonu
- Private key env dosyasından otomatik yüklenir
- Tüm transactionlar bu wallet tarafından imzalanır
- Balance kontrolü ve gas fee yönetimi otomatik

## 🔧 Kurulum ve Konfigürasyon

### Environment Variables (.env)

```bash
# Game Wallet - Teklif işlemlerini yapacak wallet
VITE_GAME_WALLET_PRIVATE_KEY=your_private_key_here

# Contract Addresses
VITE_AUTO_AUCTION_CONTRACT_ADDRESS=deployed_auction_contract_address
VITE_TREASURY_CONTRACT_ADDRESS=your_treasury_contract_address

# Player Configuration
VITE_DEFAULT_PLAYER_ADDRESS=player_wallet_address

# Monad Testnet
VITE_MONAD_RPC_URL=https://rpc.testnet.monad.xyz
VITE_MONAD_CHAIN_ID=84532

# Auction Settings
VITE_DEFAULT_BID_INCREMENT_PERCENTAGE=10
VITE_AUTO_BID_DELAY_MS=1000
VITE_MAX_GAS_PRICE_GWEI=50
```

### Gerekli Dependencies

Sistem aşağıdaki paketleri kullanır:
- `ethers`: Ethereum/Monad blockchain etkileşimi
- `crypto-browserify`: Kriptografik işlemler
- `stream-browserify`: Stream işlemleri
- `buffer`: Buffer operations

## 📋 Kullanım Adımları

### 1. Auction Oluşturma

1. Create Auction sayfasına git
2. NFT'leri seç
3. Minimum fiyat ve süre belirle
4. "Create Auction" butonuna bas
5. Sistem otomatik olarak:
   - Treasury address'i ekler
   - Player address'i belirler
   - Blockchain'de contract oluşturur
   - Local auction'ı başlatır

### 2. Otomatik Teklif Verme

1. Auction sayfasında ayarlar butonuna (⚙️) tıkla
2. Otomatik Teklif Ayarları panelinde:
   - "Otomatik Teklif" checkbox'ını işaretle
   - Player Address'i doğrula
   - Treasury Address'i doğrula
   - Teklif artışı miktarını belirle
   - Maximum teklif limitini ayarla

3. "Teklif Ver" butonuna bastığında:
   - Sistem otomatik olarak blockchain'e transaction gönderir
   - Game wallet ile imzalar
   - Player address ve treasury address dahil edilir
   - Local state güncellenir

### 3. PlayerUpdate Data Yapısı

Sistem her teklif için aşağıdaki data yapısını oluşturur:

```typescript
interface PlayerUpdateData {
  playerAddress: string;      // Teklif veren player'ın wallet adresi
  treasuryAddress: string;    // Treasury (kasa) contract adresi
  bidAmount: number;          // Teklif miktarı (MON cinsinden)
  auctionId: string;          // Auction ID
  timestamp: number;          // İşlem zamanı
}
```

## 🏗️ Teknik Mimarı

### 1. Contract Struktur (AutoAuctionContract.sol)

```solidity
struct Auction {
    uint256 id;
    address creator;
    address treasuryAddress;    // Kasa contract adresi
    string title;
    string[] nftContracts;
    uint256 minPrice;
    uint256 currentPrice;
    uint256 increment;
    uint256 endTime;
    address highestBidder;
    address playerAddress;      // En yüksek teklifi veren player
    bool ended;
    bool exists;
}

struct Bid {
    uint256 auctionId;
    address bidder;             // Game wallet adresi
    address playerAddress;      // Player wallet adresi
    address treasuryAddress;    // Treasury contract adresi
    uint256 amount;
    uint256 timestamp;
}
```

### 2. Sistem Akışı

```
1. User: Auction Oluştur
   ↓
2. System: AutoAuctionContract.createAuction()
   - treasuryAddress dahil
   - NFT contracts dahil
   ↓
3. User: Teklif Ver butonuna bas
   ↓
4. System: AutoAuctionContract.placeBid()
   - gameWallet ile imzala
   - playerAddress dahil
   - treasuryAddress dahil
   ↓
5. System: PlayerUpdateData oluştur
   ↓
6. System: Local state güncelle
```

### 3. Dosya Yapısı

```
src/
├── contracts/
│   └── AutoAuctionContract.sol          # Ana auction contract
├── lib/
│   ├── autoAuctionManager.ts           # Blockchain etkileşim manager
│   ├── monadDeployer.ts               # Updated deployment logic
│   └── useAutoBid.ts                  # React hook for auto bidding
├── pages/
│   ├── AuctionPage.tsx                # Updated with auto-bid UI
│   └── CreateAuctionPage.tsx          # Updated with treasury integration
└── .env.example                       # Environment variables template
```

## 🔍 Monitoring ve Debug

### Console Logs

Sistem aşağıdaki önemli bilgileri console'a yazar:

```javascript
// Auction oluşturma
console.log('Auction başarıyla oluşturuldu:', {
  auctionId: auctionResult.auctionId,
  treasuryAddress,
  playerAddress,
  title: params.title
});

// Teklif verme
console.log('Otomatik teklif veriliyor:', {
  auctionId,
  playerAddress,
  treasuryAddress,
  bidAmount
});

// PlayerUpdate data
console.log('Player update data:', playerUpdateData);
```

### Error Handling

- Contract deployment hataları otomatik olarak mock mode'a geçer
- Insufficient funds durumunda kullanıcıya bilgi verilir
- Network errors gracefully handle edilir
- Gas estimation hataları yakalanır

## 🚨 Önemli Notlar

1. **Security**: Private key'i güvenli tutun, production'da secure vault kullanın
2. **Gas Fees**: Game wallet'ta yeterli MON token bulundurun
3. **Network**: Monad testnet bağlantısını kontrol edin
4. **Limits**: Max bid limits respect edilir
5. **Demo Mode**: MetaMask bağlı değilse sistem demo mode'da çalışır

## 🔄 Troubleshooting

### Common Issues

1. **"Game wallet not initialized"**
   - `.env` dosyasında `VITE_GAME_WALLET_PRIVATE_KEY` kontrolü yapın
   
2. **"Auction contract not initialized"**
   - `VITE_AUTO_AUCTION_CONTRACT_ADDRESS` kontrol edin
   - Contract'ın deploy edildiğinden emin olun

3. **"Bid amount too low"**
   - Current price + increment hesaplaması kontrol edin
   - Minimum bid requirements kontrol edin

4. **Transaction failures**
   - Game wallet balance kontrol edin
   - Gas price limits kontrol edin
   - Network connectivity kontrol edin

Bu sistem ile her teklif verme işlemi otomatik olarak blockchain'e gönderilir ve player address ile treasury address bilgileri dahil edilir.