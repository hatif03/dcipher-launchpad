'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config'
import { parseEther, formatEther, getAddress } from 'viem'
import { useEffect, useCallback } from 'react'
import { usePublicClient } from 'wagmi'

export function useContract() {
  const queryClient = useQueryClient()
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()

  // Read contract state with error handling
  const { data: nextSelectionId, error: nextSelectionIdError } = useReadContract({
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

  // Event listening for randomness callbacks with robust error handling
  const listenForRandomnessCallbacks = useCallback(() => {
    if (!publicClient || !CONTRACT_ADDRESS) return

    let unwatchSelectionCompleted: (() => void) | undefined
    let unwatchSelectionRequested: (() => void) | undefined
    let retryTimeout: NodeJS.Timeout | undefined

    const setupEventListeners = () => {
      try {
        console.log('Setting up event listeners for randomness callbacks...')
        
        // Listen for SelectionCompleted events (randomness received)
        unwatchSelectionCompleted = publicClient.watchContractEvent({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          eventName: 'SelectionCompleted',
          onLogs: (logs) => {
            console.log('🎲 SelectionCompleted event received:', logs)
            logs.forEach((log) => {
              // Type assertion for the decoded log
              const decodedLog = log as any
              if (decodedLog.args) {
                const { selectionId, requester, winners, requestId, randomness } = decodedLog.args
                
                if (selectionId && winners && randomness) {
                  console.log(`🎯 Randomness received for selection ${selectionId}:`, {
                    winners: winners.length,
                    randomness: randomness,
                    requestId: requestId
                  })
                  
                  // Invalidate queries to refresh the UI
                  queryClient.invalidateQueries({ queryKey: ['selection', selectionId.toString()] })
                  queryClient.invalidateQueries({ queryKey: ['selections'] })
                  
                  // Show success notification
                  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('🎲 Randomness Received!', {
                      body: `Winners selected for selection #${selectionId}`,
                      icon: '/favicon.ico'
                    })
                  }
                }
              }
            })
          },
          onError: (error) => {
            console.error('Error listening for SelectionCompleted events:', error)
            // Attempt to recreate the listener after a delay
            scheduleReconnect()
          }
        })

        // Listen for SelectionRequested events
        unwatchSelectionRequested = publicClient.watchContractEvent({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          eventName: 'SelectionRequested',
          onLogs: (logs) => {
            console.log('📝 SelectionRequested event received:', logs)
            logs.forEach((log) => {
              // Type assertion for the decoded log
              const decodedLog = log as any
              if (decodedLog.args) {
                const { selectionId, requester, participantCount, winnerCount, requestId } = decodedLog.args
                
                if (selectionId && requestId) {
                  console.log(`📋 Selection ${selectionId} requested with request ID ${requestId}`)
                  
                  // Invalidate queries to refresh the UI
                  queryClient.invalidateQueries({ queryKey: ['selection', selectionId.toString()] })
                  queryClient.invalidateQueries({ queryKey: ['selections'] })
                }
              }
            })
          },
          onError: (error) => {
            console.error('Error listening for SelectionRequested events:', error)
            // Attempt to recreate the listener after a delay
            scheduleReconnect()
          }
        })
      } catch (error) {
        console.error('Failed to set up event listeners:', error)
        scheduleReconnect()
      }
    }

    const scheduleReconnect = () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
      
      retryTimeout = setTimeout(() => {
        console.log('Attempting to reconnect event listeners...')
        cleanup()
        setupEventListeners()
      }, 5000) // Wait 5 seconds before retrying
    }

    const cleanup = () => {
      if (unwatchSelectionCompleted) {
        try {
          unwatchSelectionCompleted()
        } catch (error) {
          console.error('Error cleaning up SelectionCompleted listener:', error)
        }
        unwatchSelectionCompleted = undefined
      }
      
      if (unwatchSelectionRequested) {
        try {
          unwatchSelectionRequested()
        } catch (error) {
          console.error('Error cleaning up SelectionRequested listener:', error)
        }
        unwatchSelectionRequested = undefined
      }
      
      if (retryTimeout) {
        clearTimeout(retryTimeout)
        retryTimeout = undefined
      }
    }

    // Initial setup
    setupEventListeners()

    // Return cleanup function
    return cleanup
  }, [publicClient, queryClient])

  // Set up event listeners when the hook mounts
  useEffect(() => {
    // Check if we should use persistent event listening or just polling
    const usePersistentEvents = process.env.NEXT_PUBLIC_USE_PERSISTENT_EVENTS !== 'false'
    
    let cleanup: (() => void) | undefined
    let pollInterval: NodeJS.Timeout | undefined
    
    if (usePersistentEvents) {
      // Try persistent event listening first
      cleanup = listenForRandomnessCallbacks()
    }
    
    // Always set up polling as a fallback or primary method
    pollInterval = setInterval(() => {
      // This will check for new selections and update the UI
      if (nextSelectionId && typeof nextSelectionId === 'bigint' && nextSelectionId > BigInt(0)) {
        // Invalidate queries to refresh the UI periodically
        queryClient.invalidateQueries({ queryKey: ['selections'] })
      }
    }, 10000) // Poll every 10 seconds
    
    // Log RPC errors for debugging
    if (nextSelectionIdError) {
      console.warn('RPC Error reading nextSelectionId:', nextSelectionIdError)
      // If we get RPC errors, consider switching to polling-only mode
      if (usePersistentEvents && nextSelectionIdError.message?.includes('filter not found')) {
        console.warn('Detected filter error, consider setting NEXT_PUBLIC_USE_PERSISTENT_EVENTS=false')
      }
    }
    
    return () => {
      if (cleanup) cleanup()
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [listenForRandomnessCallbacks, nextSelectionId, queryClient, nextSelectionIdError])

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

  // Function to manually check for randomness updates
  const checkRandomnessUpdate = useCallback(async (selectionId: bigint) => {
    if (!publicClient || !CONTRACT_ADDRESS) return null
    
    try {
      console.log(`🔍 Manually checking randomness update for selection ${selectionId}...`)
      
      const selection = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getSelection',
        args: [selectionId],
      })
      
      // Type assertion for the selection data
      const selectionData = selection as {
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
      
      if (selectionData && selectionData.isCompleted && selectionData.randomness !== '0x') {
        console.log(`🎯 Randomness found for selection ${selectionId}:`, selectionData.randomness)
        
        // Invalidate queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['selection', selectionId.toString()] })
        queryClient.invalidateQueries({ queryKey: ['selections'] })
        
        return {
          randomness: selectionData.randomness,
          winners: selectionData.winners,
          isCompleted: selectionData.isCompleted
        }
      }
      
      return null
    } catch (error) {
      console.error(`Failed to check randomness update for selection ${selectionId}:`, error)
      return null
    }
  }, [publicClient, queryClient])

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
    
    // Randomness functions
    checkRandomnessUpdate,
    
    // Transaction hashes
    requestSelectionHash: requestSelectionHash,
    fundHash: fundContractHash,
    cancelHash: cancelSelectionHash,
    createSubscriptionHash: createSubscriptionHash,
    topUpSubscriptionHash: topUpSubscriptionHash,
  }
}
