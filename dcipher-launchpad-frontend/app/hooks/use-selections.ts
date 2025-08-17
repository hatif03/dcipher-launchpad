'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config'

export function useSelections() {
  const queryClient = useQueryClient()

  // Get next selection ID
  const { data: nextSelectionId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'nextSelectionId',
  })

  // Get specific selection
  const useSelection = (selectionId: bigint | undefined) => {
    return useQuery({
      queryKey: ['selection', selectionId?.toString()],
      queryFn: async () => {
        if (!selectionId) return null
        
        // This would need to be implemented with a custom hook or direct contract call
        // For now, returning null as placeholder
        return null
      },
      enabled: !!selectionId,
    })
  }

  // Get all selections (this would need pagination in a real implementation)
  const useAllSelections = () => {
    return useQuery({
      queryKey: ['selections'],
      queryFn: async () => {
        // This would need to be implemented to fetch all selections
        // For now, returning empty array as placeholder
        return []
      },
      staleTime: 30 * 1000, // 30 seconds
    })
  }

  // Invalidate selections cache
  const invalidateSelections = () => {
    queryClient.invalidateQueries({ queryKey: ['selections'] })
  }

  return {
    nextSelectionId,
    useSelection,
    useAllSelections,
    invalidateSelections,
  }
}
