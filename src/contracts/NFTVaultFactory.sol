// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTVaultFactory
 * @dev Kullanıcıların kendi NFT kasalarını oluşturmalarını sağlar.
 * Her kasa bağımsız bir kontrat olarak deploy edilir ve auction + lottery sistemi ile çalışır.
 */
contract NFTVaultFactory is Ownable {
    // Vault bilgisi
    struct VaultInfo {
        uint256 id;
        address vaultAddress;
        address creator;
        string title;
        string[] nftContracts; // Seçilen NFT'lerin contract adresleri
        uint256 minPriceMon;
        uint256 durationMinutes; // Dakika olarak süre
        uint256 createdAt;
        bool active;
        uint256 auctionId; // Bu vault için auction ID
    }

    // vaultId => VaultInfo
    mapping(uint256 => VaultInfo) public vaults;
    // creator => vaultId[]
    mapping(address => uint256[]) public userVaults;

    uint256 public vaultCount;
    
    // Contract addresses
    address public auctionContract;
    address public lotteryContract;

    event VaultCreated(
        uint256 indexed vaultId,
        address indexed vaultAddress,
        address indexed creator,
        string title,
        uint256 minPriceMon,
        uint256 durationMinutes
    );

    event VaultDeactivated(uint256 indexed vaultId, address indexed creator);

    constructor(address _auctionContract, address _lotteryContract) Ownable(msg.sender) {
        require(_auctionContract != address(0), "Invalid auction contract");
        require(_lotteryContract != address(0), "Invalid lottery contract");
        auctionContract = _auctionContract;
        lotteryContract = _lotteryContract;
    }

    /**
     * @dev Yeni kasa oluşturur. Sayfadan alınan parametrelerle kasa deploy eder.
     * @param _title Kasa başlığı
     * @param _nftContracts Seçilen NFT'lerin contract adresleri
     * @param _minPriceMon Minimum fiyat (MON)
     * @param _durationMinutes Dakika olarak süre (5, 15, 30, 60)
     */
    function createVault(
        string memory _title,
        string[] memory _nftContracts,
        uint256 _minPriceMon,
        uint256 _durationMinutes
    ) external returns (uint256 newVaultId) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_nftContracts.length > 0, "Must select at least one NFT");
        require(_minPriceMon > 0, "Minimum price must be greater than 0");
        require(
            _durationMinutes == 5 || _durationMinutes == 15 || 
            _durationMinutes == 30 || _durationMinutes == 60,
            "Invalid duration"
        );

        vaultCount++;
        newVaultId = vaultCount;

        // NFTVault kontratını deploy etmek yerine, bilgileri kaydet
        // Gerçek implementasyonda burada yeni NFTVault kontratı deploy edilir
        address vaultAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            newVaultId
        )))));

        // Bilgileri kaydet
        vaults[newVaultId] = VaultInfo({
            id: newVaultId,
            vaultAddress: vaultAddress,
            creator: msg.sender,
            title: _title,
            nftContracts: _nftContracts,
            minPriceMon: _minPriceMon,
            durationMinutes: _durationMinutes,
            createdAt: block.timestamp,
            active: true,
            auctionId: 0 // Auction henüz başlatılmadı
        });

        userVaults[msg.sender].push(newVaultId);

        emit VaultCreated(
            newVaultId,
            vaultAddress,
            msg.sender,
            _title,
            _minPriceMon,
            _durationMinutes
        );

        return newVaultId;
    }

    /**
     * @dev Vault için auction başlat
     */
    function startAuction(uint256 _vaultId, uint256 _startingPrice) external returns (uint256 auctionId) {
        VaultInfo storage vault = vaults[_vaultId];
        require(vault.creator == msg.sender, "Not vault creator");
        require(vault.active, "Vault not active");
        require(vault.auctionId == 0, "Auction already started");

        // Vault'ta NFT olduğunu kontrol et
        require(vault.nftContracts.length > 0, "No NFTs in vault");

        // Mock auction ID - gerçek implementasyonda VaultAuction kontratından gelir
        auctionId = uint256(keccak256(abi.encodePacked(block.timestamp, _vaultId)));
        vault.auctionId = auctionId;
        
        return auctionId;
    }

    /**
     * @dev Bir kullanıcının sahip olduğu tüm kasaları döner.
     */
    function getVaultsByUser(address user) external view returns (VaultInfo[] memory) {
        uint256[] memory ids = userVaults[user];
        VaultInfo[] memory result = new VaultInfo[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = vaults[ids[i]];
        }

        return result;
    }

    /**
     * @dev Belirli bir vault'un bilgilerini döner
     */
    function getVault(uint256 _vaultId) external view returns (VaultInfo memory) {
        return vaults[_vaultId];
    }

    /**
     * @dev Auction ve Lottery kontrat adreslerini günceller (sadece owner).
     */
    function updateContracts(address _auctionContract, address _lotteryContract) external onlyOwner {
        require(_auctionContract != address(0), "Invalid auction address");
        require(_lotteryContract != address(0), "Invalid lottery address");
        auctionContract = _auctionContract;
        lotteryContract = _lotteryContract;
    }

    /**
     * @dev Kasa'yı devre dışı bırakır (örneğin dolandırıcılık tespiti, acil durum vs.)
     */
    function deactivateVault(uint256 _vaultId) external onlyOwner {
        VaultInfo storage v = vaults[_vaultId];
        require(v.active, "Vault already inactive");
        v.active = false;
        emit VaultDeactivated(_vaultId, v.creator);
    }

    /**
     * @dev Aktif kasa sayısını döner.
     */
    function getActiveVaultCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= vaultCount; i++) {
            if (vaults[i].active) count++;
        }
    }

    /**
     * @dev Rastgele NFT contract adresleri üretir (demo için)
     */
    function generateRandomNFTContracts(uint256 count) external pure returns (string[] memory) {
        string[] memory contracts = new string[](count);
        
        // Demo amaçlı rastgele contract adresleri
        string[10] memory baseContracts = [
            "0x1234567890123456789012345678901234567890",
            "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            "0x1111222233334444555566667777888899990000",
            "0xfedcba9876543210fedcba9876543210fedcba98",
            "0x0000111122223333444455556666777788889999",
            "0x9999888877776666555544443333222211110000",
            "0xaabbccddeeff00112233445566778899aabbccdd",
            "0x1122334455667788990011223344556677889900",
            "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
            "0xcafebabecafebabecafebabecafebabecafebabe"
        ];

        for (uint256 i = 0; i < count && i < 10; i++) {
            contracts[i] = baseContracts[i];
        }

        return contracts;
    }
}