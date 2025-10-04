// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title AutoAuctionContract
 * @dev Auction contract with automatic bidding functionality
 * Includes treasury (kasa) address and player address for each bid
 */
contract AutoAuctionContract is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    struct Auction {
        uint256 id;
        address creator;
        address treasuryAddress; // Kasa contract address
        string title;
        string[] nftContracts;
        uint256 minPrice;
        uint256 currentPrice;
        uint256 increment;
        uint256 endTime;
        address highestBidder;
        address playerAddress; // Current highest bidder's player address
        bool ended;
        bool exists;
    }

    struct Bid {
        uint256 auctionId;
        address bidder;
        address playerAddress; // Player address associated with this bid
        address treasuryAddress; // Treasury address for this bid
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    uint256 private _auctionIdCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(address => uint256[]) public userAuctions;
    
    // Events
    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed creator,
        address indexed treasuryAddress,
        string title,
        uint256 minPrice,
        uint256 endTime
    );
    
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        address indexed playerAddress,
        address treasuryAddress,
        uint256 amount,
        uint256 timestamp
    );
    
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        address indexed playerAddress,
        uint256 finalPrice
    );

    constructor() {}

    /**
     * @dev Create a new auction
     * @param _treasuryAddress The treasury (kasa) contract address
     * @param _title Auction title
     * @param _nftContracts Array of NFT contract addresses
     * @param _minPrice Minimum starting price
     * @param _durationMinutes Auction duration in minutes
     */
    function createAuction(
        address _treasuryAddress,
        string memory _title,
        string[] memory _nftContracts,
        uint256 _minPrice,
        uint256 _durationMinutes
    ) external returns (uint256) {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_minPrice > 0, "Minimum price must be greater than 0");
        require(_durationMinutes > 0, "Duration must be greater than 0");
        require(_nftContracts.length > 0, "Must have at least one NFT contract");

        _auctionIdCounter++;
        uint256 auctionId = _auctionIdCounter;

        auctions[auctionId] = Auction({
            id: auctionId,
            creator: msg.sender,
            treasuryAddress: _treasuryAddress,
            title: _title,
            nftContracts: _nftContracts,
            minPrice: _minPrice,
            currentPrice: _minPrice,
            increment: _minPrice.div(10), // 10% of min price as increment
            endTime: block.timestamp + (_durationMinutes * 60),
            highestBidder: address(0),
            playerAddress: address(0),
            ended: false,
            exists: true
        });

        userAuctions[msg.sender].push(auctionId);

        emit AuctionCreated(
            auctionId,
            msg.sender,
            _treasuryAddress,
            _title,
            _minPrice,
            block.timestamp + (_durationMinutes * 60)
        );

        return auctionId;
    }

    /**
     * @dev Place a bid on an auction
     * @param _auctionId The auction ID
     * @param _playerAddress The player address associated with this bid
     */
    function placeBid(
        uint256 _auctionId,
        address _playerAddress
    ) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.exists, "Auction does not exist");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(!auction.ended, "Auction is already ended");
        require(_playerAddress != address(0), "Invalid player address");
        
        uint256 minBidAmount = auction.currentPrice.add(auction.increment);
        require(msg.value >= minBidAmount, "Bid amount too low");

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.currentPrice);
        }

        // Update auction
        auction.currentPrice = msg.value;
        auction.highestBidder = msg.sender;
        auction.playerAddress = _playerAddress;

        // Record bid
        Bid memory newBid = Bid({
            auctionId: _auctionId,
            bidder: msg.sender,
            playerAddress: _playerAddress,
            treasuryAddress: auction.treasuryAddress,
            amount: msg.value,
            timestamp: block.timestamp
        });

        auctionBids[_auctionId].push(newBid);

        emit BidPlaced(
            _auctionId,
            msg.sender,
            _playerAddress,
            auction.treasuryAddress,
            msg.value,
            block.timestamp
        );

        // Auto-extend auction if bid is placed in last 5 minutes
        if (auction.endTime.sub(block.timestamp) < 300) {
            auction.endTime = block.timestamp.add(300); // Extend by 5 minutes
        }
    }

    /**
     * @dev End an auction and transfer funds
     * @param _auctionId The auction ID
     */
    function endAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.exists, "Auction does not exist");
        require(block.timestamp >= auction.endTime, "Auction is still active");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            // Transfer funds to auction creator
            payable(auction.creator).transfer(auction.currentPrice);
            
            emit AuctionEnded(
                _auctionId,
                auction.highestBidder,
                auction.playerAddress,
                auction.currentPrice
            );
        }
    }

    /**
     * @dev Get auction details
     * @param _auctionId The auction ID
     */
    function getAuction(uint256 _auctionId) external view returns (
        uint256 id,
        address creator,
        address treasuryAddress,
        string memory title,
        string[] memory nftContracts,
        uint256 minPrice,
        uint256 currentPrice,
        uint256 endTime,
        address highestBidder,
        address playerAddress,
        bool ended
    ) {
        Auction storage auction = auctions[_auctionId];
        require(auction.exists, "Auction does not exist");
        
        return (
            auction.id,
            auction.creator,
            auction.treasuryAddress,
            auction.title,
            auction.nftContracts,
            auction.minPrice,
            auction.currentPrice,
            auction.endTime,
            auction.highestBidder,
            auction.playerAddress,
            auction.ended
        );
    }

    /**
     * @dev Get all bids for an auction
     * @param _auctionId The auction ID
     */
    function getAuctionBids(uint256 _auctionId) external view returns (Bid[] memory) {
        require(auctions[_auctionId].exists, "Auction does not exist");
        return auctionBids[_auctionId];
    }

    /**
     * @dev Get user's auction IDs
     * @param _user The user address
     */
    function getUserAuctions(address _user) external view returns (uint256[] memory) {
        return userAuctions[_user];
    }

    /**
     * @dev Get current auction counter
     */
    function getCurrentAuctionId() external view returns (uint256) {
        return _auctionIdCounter;
    }

    /**
     * @dev Emergency withdrawal function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Check if auction is active
     * @param _auctionId The auction ID
     */
    function isAuctionActive(uint256 _auctionId) external view returns (bool) {
        Auction storage auction = auctions[_auctionId];
        return auction.exists && !auction.ended && block.timestamp < auction.endTime;
    }
}