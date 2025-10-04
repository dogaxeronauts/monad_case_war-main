import { useState, useCallback, useRef, useEffect } from 'react';
import { monadDeployer } from './monadDeployer';
import { autoAuctionManager } from './autoAuctionManager';

interface AutoBidConfig {
  enabled: boolean;
  playerAddress: string;
  treasuryAddress: string;
  maxBidAmount?: number;
  bidIncrement?: number;
}

interface UseAutoBidResult {
  isAutoBidding: boolean;
  autoBidConfig: AutoBidConfig;
  setAutoBidConfig: (config: Partial<AutoBidConfig>) => void;
  placeBid: (auctionId: string, bidAmount?: number) => Promise<boolean>;
  getPlayerAddress: () => Promise<string | null>;
  getGameWalletBalance: () => Promise<string>;
  error: string | null;
  clearError: () => void;
}

export function useAutoBid(): UseAutoBidResult {
  const [isAutoBidding, setIsAutoBidding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoBidConfig, setAutoBidConfigState] = useState<AutoBidConfig>({
    enabled: false,
    playerAddress: '',
    treasuryAddress: import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS || '',
    maxBidAmount: 100,
    bidIncrement: 1,
  });

  const bidInProgressRef = useRef(false);

  // Initialize player address on mount
  useEffect(() => {
    const initializePlayerAddress = async () => {
      try {
        const address = await monadDeployer.getWalletAddress();
        if (address && !autoBidConfig.playerAddress) {
          setAutoBidConfigState(prev => ({
            ...prev,
            playerAddress: address,
          }));
        }
      } catch (err) {
        console.warn('Failed to get wallet address:', err);
      }
    };

    initializePlayerAddress();
  }, [autoBidConfig.playerAddress]);

  const setAutoBidConfig = useCallback((config: Partial<AutoBidConfig>) => {
    setAutoBidConfigState(prev => ({ ...prev, ...config }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getPlayerAddress = useCallback(async (): Promise<string | null> => {
    try {
      return await monadDeployer.getWalletAddress();
    } catch (err) {
      console.error('Failed to get player address:', err);
      return null;
    }
  }, []);

  const getGameWalletBalance = useCallback(async (): Promise<string> => {
    try {
      return await monadDeployer.getGameWalletBalance();
    } catch (err) {
      console.error('Failed to get game wallet balance:', err);
      return '0';
    }
  }, []);

  const placeBid = useCallback(async (
    auctionId: string, 
    bidAmount?: number
  ): Promise<boolean> => {
    // Prevent concurrent bids
    if (bidInProgressRef.current) {
      console.log('Bid already in progress, skipping...');
      return false;
    }

    try {
      bidInProgressRef.current = true;
      setIsAutoBidding(true);
      setError(null);

      // Validate configuration
      if (!autoBidConfig.playerAddress) {
        throw new Error('Player address not configured');
      }

      if (!autoBidConfig.treasuryAddress) {
        throw new Error('Treasury address not configured');
      }

      // Parse auction ID to number
      const auctionIdNum = parseInt(auctionId.replace('auction-', ''));
      if (isNaN(auctionIdNum)) {
        // For demo auctions, create a mock auction ID
        console.log('Demo auction detected, using mock bidding');
        
        // Simulate bid delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Mock bid placed successfully', {
          auctionId,
          playerAddress: autoBidConfig.playerAddress,
          treasuryAddress: autoBidConfig.treasuryAddress,
          bidAmount: bidAmount || autoBidConfig.bidIncrement || 1,
        });
        
        return true;
      }

      // Get current auction details to calculate next bid
      const auctionDetails = await monadDeployer.getAuctionDetails(auctionIdNum);
      let finalBidAmount = bidAmount;

      if (!finalBidAmount && auctionDetails) {
        // Calculate next bid amount based on current price + increment
        const currentPriceMon = parseFloat(auctionDetails.currentPrice.toString()) / 1e18;
        finalBidAmount = currentPriceMon + (autoBidConfig.bidIncrement || 1);
      } else if (!finalBidAmount) {
        finalBidAmount = autoBidConfig.bidIncrement || 1;
      }

      // Check max bid limit
      if (autoBidConfig.maxBidAmount && finalBidAmount > autoBidConfig.maxBidAmount) {
        throw new Error(`Bid amount ${finalBidAmount} exceeds maximum allowed ${autoBidConfig.maxBidAmount}`);
      }

      console.log('Placing automatic bid:', {
        auctionId: auctionIdNum,
        playerAddress: autoBidConfig.playerAddress,
        treasuryAddress: autoBidConfig.treasuryAddress,
        bidAmount: finalBidAmount,
      });

      // Place the bid using monadDeployer
      const result = await monadDeployer.placeBid(
        auctionIdNum,
        autoBidConfig.playerAddress,
        finalBidAmount
      );

      if (result.success) {
        console.log('Automatic bid placed successfully:', result.transactionHash);
        
        // Create player update data for external systems
        const playerUpdateData = autoAuctionManager.createPlayerUpdateData(
          autoBidConfig.playerAddress,
          autoBidConfig.treasuryAddress,
          finalBidAmount,
          auctionId
        );
        
        console.log('Player update data:', playerUpdateData);
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to place bid');
      }

    } catch (err: any) {
      console.error('Auto bid failed:', err);
      setError(err.message || 'Failed to place automatic bid');
      return false;
    } finally {
      bidInProgressRef.current = false;
      setIsAutoBidding(false);
    }
  }, [autoBidConfig]);

  return {
    isAutoBidding,
    autoBidConfig,
    setAutoBidConfig,
    placeBid,
    getPlayerAddress,
    getGameWalletBalance,
    error,
    clearError,
  };
}

// Configuration hook for auction settings
export function useAuctionConfig() {
  const [config, setConfig] = useState({
    autoCreateAuctions: true,
    defaultTreasuryAddress: import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS || '',
    defaultBidIncrement: 1,
    maxAutoBidAmount: 100,
    autoBidDelay: parseInt(import.meta.env.VITE_AUTO_BID_DELAY_MS || '1000'),
  });

  const updateConfig = useCallback((newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return {
    config,
    updateConfig,
  };
}