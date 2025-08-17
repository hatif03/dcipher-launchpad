'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config'
import { parseEther, formatEther, getAddress } from 'viem'

export function useContract() {
  const queryClient = useQueryClient()
  const { address: userAddress } = useAccount()

  // Read contract state
  const { data: nextSelectionId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'nextSelectionId',
  })

  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getBalance',
  })

  const { data: subscriptionId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'subscriptionId',
  })

  const { data: randomnessSender } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'randomnessSender',
  })

  // Contract write functions
  const { data: requestSelectionHash, writeContract: requestSelection, isPending: isRequestingSelection } = useWriteContract()
  const { data: fundContractHash, writeContract: fundContract, isPending: isFunding } = useWriteContract()
  const { data: cancelSelectionHash, writeContract: cancelSelection, isPending: isCancelling } = useWriteContract()
  const { data: createSubscriptionHash, writeContract: createSubscription, isPending: isCreatingSubscription } = useWriteContract()
  const { data: topUpSubscriptionHash, writeContract: topUpSubscription, isPending: isToppingUp } = useWriteContract()

  // Transaction receipts
  const { isLoading: isRequestingSelectionTx } = useWaitForTransactionReceipt({
    hash: requestSelectionHash,
  })

  const { isLoading: isFundingTx } = useWaitForTransactionReceipt({
    hash: fundContractHash,
  })

  const { isLoading: isCancellingTx } = useWaitForTransactionReceipt({
    hash: cancelSelectionHash,
  })

  const { isLoading: isCreatingSubscriptionTx } = useWaitForTransactionReceipt({
    hash: createSubscriptionHash,
  })

  const { isLoading: isToppingUpTx } = useWaitForTransactionReceipt({
    hash: topUpSubscriptionHash,
  })

  // Hook to read selection data from blockchain
  const useSelectionFromBlockchain = (selectionId: bigint | undefined) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getSelection',
      args: selectionId ? [selectionId] : undefined,
    })
  }

  // Query for specific selection with automatic refetching for VRF callback monitoring
  const useSelection = (selectionId: bigint | undefined) => {
    const { data: selectionData, isLoading, error } = useSelectionFromBlockchain(selectionId)
    
    return useQuery({
      queryKey: ['selection', selectionId?.toString()],
      queryFn: async () => {
        if (!selectionId || !selectionData) return null
        
        try {
          // Type assertion for the selection data from blockchain
          const selection = selectionData as {
            requester: string
            participants: string[]
            winnerCount: bigint
            requestId: bigint
            isCompleted: boolean
            isCancelled: boolean
            winners: string[]
            randomness: string
            timestamp: bigint
          }
          
          // Convert the blockchain data to our frontend format
          return {
            selectionId: selectionId.toString(),
            requester: selection.requester,
            participants: selection.participants,
            winnerCount: selection.winnerCount,
            requestId: selection.requestId,
            isCompleted: selection.isCompleted,
            isCancelled: selection.isCancelled,
            winners: selection.winners,
            randomness: selection.randomness,
            timestamp: selection.timestamp
          }
        } catch (error) {
          console.error('Failed to process selection data:', error)
          return null
        }
      },
      enabled: !!selectionId && !!selectionData,
      // Refetch every 5 seconds to monitor VRF callback completion
      refetchInterval: (query) => {
        // If the selection is not completed and not cancelled, keep refetching
        if (query.state.data && !query.state.data.isCompleted && !query.state.data.isCancelled) {
          return 5000 // 5 seconds
        }
        // If completed or cancelled, stop refetching
        return false
      },
      refetchIntervalInBackground: true,
    })
  }

  // Read selection data from smart contract
  const readSelectionFromContract = async (selectionId: bigint) => {
    try {
      // This function is not currently used since we can't call readContract directly
      // from within a React hook. The actual reading should be done using the useSelection hook
      // or by restructuring the component to use the hook pattern properly.
      
      // For now, returning a placeholder structure
      return {
        selectionId: selectionId.toString(),
        requester: '',
        participants: [],
        winnerCount: BigInt(0),
        requestId: BigInt(0),
        isCompleted: false,
        isCancelled: false,
        winners: [],
        randomness: '0x',
        timestamp: BigInt(0)
      }
    } catch (error) {
      console.error('Failed to read selection from contract:', error)
      throw error
    }
  }

  // Mutation for requesting selection
  const requestSelectionMutation = useMutation({
    mutationFn: async ({ participants, winnerCount, value }: {
      participants: string[]
      winnerCount: bigint
      value: bigint
    }) => {
      if (!requestSelection) throw new Error('Contract not ready')
      
      // Validate participants
      const validatedParticipants = participants.map(addr => getAddress(addr))
      
      requestSelection({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'requestSelection',
        args: [validatedParticipants, winnerCount],
        value,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selections'] })
    },
  })

  // Mutation for funding contract
  const fundContractMutation = useMutation({
    mutationFn: async (value: bigint) => {
      if (!fundContract) throw new Error('Contract not ready')
      
      fundContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createSubscriptionAndFundNative',
        value,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractBalance'] })
    },
  })

  // Mutation for cancelling selection
  const cancelSelectionMutation = useMutation({
    mutationFn: async (selectionId: bigint) => {
      if (!cancelSelection) throw new Error('Contract not ready')
      
      cancelSelection({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'cancelSelection',
        args: [selectionId],
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selections'] })
    },
  })

  // Mutation for creating subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: async (value: bigint) => {
      if (!createSubscription) throw new Error('Contract not ready')
      
      createSubscription({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createSubscriptionAndFundNative',
        value,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionId'] })
      queryClient.invalidateQueries({ queryKey: ['contractBalance'] })
    },
  })

  // Mutation for topping up subscription
  const topUpSubscriptionMutation = useMutation({
    mutationFn: async (value: bigint) => {
      if (!topUpSubscription) throw new Error('Contract not ready')
      
      topUpSubscription({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'topUpSubscriptionNative',
        value,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractBalance'] })
    },
  })

  return {
    // Contract state
    nextSelectionId,
    contractBalance: contractBalance && typeof contractBalance === 'bigint' ? formatEther(contractBalance) : '0',
    subscriptionId: subscriptionId?.toString() || '0',
    randomnessSender: randomnessSender?.toString() || '',
    
    // Contract functions
    requestSelection: requestSelectionMutation.mutate,
    fundContract: fundContractMutation.mutate,
    cancelSelection: cancelSelectionMutation.mutate,
    createSubscription: createSubscriptionMutation.mutate,
    topUpSubscription: topUpSubscriptionMutation.mutate,
    
    // Loading states
    isRequestingSelection: isRequestingSelection || isRequestingSelectionTx,
    isFunding: isFunding || isFundingTx,
    isCancelling: isCancelling || isCancellingTx,
    isCreatingSubscription: isCreatingSubscription || isCreatingSubscriptionTx,
    isToppingUp: isToppingUp || isToppingUpTx,
    
    // Hooks
    useSelection,
    
    // Transaction hashes
    requestSelectionHash: requestSelectionHash,
    fundHash: fundContractHash,
    cancelHash: cancelSelectionHash,
    createSubscriptionHash: createSubscriptionHash,
    topUpSubscriptionHash: topUpSubscriptionHash,
  }
}
