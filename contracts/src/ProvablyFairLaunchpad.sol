// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {RandomnessReceiverBase} from "../lib/randomness-solidity/src/RandomnessReceiverBase.sol";

/**
 * @title ProvablyFairLaunchpad
 * @notice A verifiably fair selection mechanism for giveaways, raffles, and whitelist selections
 * @dev Uses dcipher VRF for provably random selections
 */
contract ProvablyFairLaunchpad is RandomnessReceiverBase {
    // Events
    event SelectionRequested(
        uint256 indexed selectionId,
        address indexed requester,
        uint256 participantCount,
        uint256 winnerCount,
        uint256 requestId
    );
    
    event SelectionCompleted(
        uint256 indexed selectionId,
        address indexed requester,
        address[] winners,
        uint256 requestId,
        bytes32 randomness
    );
    
    event SelectionCancelled(
        uint256 indexed selectionId,
        address indexed requester,
        uint256 requestId
    );

    // Structs
    struct SelectionRequest {
        address requester;
        address[] participants;
        uint256 winnerCount;
        uint256 requestId;
        bool isCompleted;
        bool isCancelled;
        address[] winners;
        bytes32 randomness;
        uint256 timestamp;
    }

    // State variables
    uint256 public nextSelectionId;
    mapping(uint256 => SelectionRequest) public selections;
    mapping(uint256 => uint256) public requestIdToSelectionId;
    
    // Constants
    uint256 public constant MAX_PARTICIPANTS = 10000;
    uint256 public constant MAX_WINNERS = 1000;
    uint256 public constant MIN_PARTICIPANTS = 2;
    uint32 public constant DEFAULT_CALLBACK_GAS_LIMIT = 200000;

    // Errors
    error InvalidParticipantCount();
    error InvalidWinnerCount();
    error SelectionNotFound();
    error SelectionAlreadyCompleted();
    error SelectionAlreadyCancelled();
    error InvalidRequestId();
    error InsufficientRandomness();
    error DuplicateParticipants();
    error ZeroAddressParticipant();
    error NotAuthorized();
    error SelectionNotCompleted();

    /**
     * @notice Constructor
     * @param _randomnessSender Address of the RandomnessSender contract
     */
    constructor(address _randomnessSender) RandomnessReceiverBase(_randomnessSender, msg.sender) {
        nextSelectionId = 0; // Start from 0 to match test expectations
    }

    /**
     * @notice Request a verifiably random selection
     * @param participants Array of participant wallet addresses
     * @param winnerCount Number of winners to select
     */
    function requestSelection(
        address[] calldata participants,
        uint256 winnerCount
    ) external payable returns (uint256 selectionId) {
        // Validate inputs
        if (participants.length < MIN_PARTICIPANTS || participants.length > MAX_PARTICIPANTS) {
            revert InvalidParticipantCount();
        }
        
        if (winnerCount == 0 || winnerCount > participants.length || winnerCount > MAX_WINNERS) {
            revert InvalidWinnerCount();
        }

        // Check for duplicates and zero addresses
        _validateParticipants(participants);

        // Generate selection ID
        selectionId = ++nextSelectionId;

        // Create selection request
        selections[selectionId] = SelectionRequest({
            requester: msg.sender,
            participants: participants,
            winnerCount: winnerCount,
            requestId: 0,
            isCompleted: false,
            isCancelled: false,
            winners: new address[](0),
            randomness: bytes32(0),
            timestamp: block.timestamp
        });

        // Request randomness from dcipher VRF using direct funding
        (uint256 requestId, ) = _requestRandomnessPayInNative(DEFAULT_CALLBACK_GAS_LIMIT);
        selections[selectionId].requestId = requestId;
        requestIdToSelectionId[requestId] = selectionId;

        emit SelectionRequested(selectionId, msg.sender, participants.length, winnerCount, requestId);
    }

    /**
     * @notice Internal callback function called by the randomness system
     * @param requestId The request ID from the randomness system
     * @param randomness The random value
     */
    function onRandomnessReceived(uint256 requestId, bytes32 randomness) internal override {
        uint256 selectionId = requestIdToSelectionId[requestId];
        if (selectionId == 0) {
            revert InvalidRequestId();
        }

        SelectionRequest storage selection = selections[selectionId];
        if (selection.isCompleted || selection.isCancelled) {
            revert SelectionAlreadyCompleted();
        }

        // Mark as completed
        selection.isCompleted = true;
        selection.randomness = randomness;

        // Select winners using the random value
        selection.winners = _selectWinners(selection.participants, selection.winnerCount, randomness);

        emit SelectionCompleted(
            selectionId,
            selection.requester,
            selection.winners,
            requestId,
            randomness
        );
    }

    /**
     * @notice Cancel a selection request (only owner or requester)
     * @param selectionId The ID of the selection to cancel
     */
    function cancelSelection(uint256 selectionId) external {
        SelectionRequest storage selection = selections[selectionId];
        if (selection.requester == address(0)) {
            revert SelectionNotFound();
        }
        
        if (selection.isCompleted || selection.isCancelled) {
            revert SelectionAlreadyCancelled();
        }

        // Only owner or requester can cancel
        if (msg.sender != owner() && msg.sender != selection.requester) {
            revert NotAuthorized();
        }

        selection.isCancelled = true;

        emit SelectionCancelled(selectionId, selection.requester, selection.requestId);
    }

    /**
     * @notice Get selection details
     * @param selectionId The ID of the selection
     * @return Selection details
     */
    function getSelection(uint256 selectionId) external view returns (SelectionRequest memory) {
        return selections[selectionId];
    }

    /**
     * @notice Get winners for a completed selection
     * @param selectionId The ID of the selection
     * @return Array of winner addresses
     */
    function getWinners(uint256 selectionId) external view returns (address[] memory) {
        SelectionRequest storage selection = selections[selectionId];
        if (selection.requester == address(0)) {
            revert SelectionNotFound();
        }
        
        if (!selection.isCompleted) {
            revert SelectionNotCompleted();
        }

        return selection.winners;
    }

    /**
     * @notice Verify the fairness of a selection
     * @param selectionId The ID of the selection
     * @param expectedWinners Array of expected winner addresses
     * @return True if the selection is fair and matches expected results
     */
    function verifyFairness(
        uint256 selectionId,
        address[] calldata expectedWinners
    ) external view returns (bool) {
        SelectionRequest storage selection = selections[selectionId];
        if (selection.requester == address(0) || !selection.isCompleted) {
            return false;
        }

        if (expectedWinners.length != selection.winners.length) {
            return false;
        }

        // Sort both arrays for comparison
        address[] memory sortedExpected = _sortAddresses(expectedWinners);
        address[] memory sortedActual = _sortAddresses(selection.winners);

        for (uint256 i = 0; i < sortedExpected.length; i++) {
            if (sortedExpected[i] != sortedActual[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @notice Internal function to select winners using randomness
     * @param participants Array of participants
     * @param winnerCount Number of winners to select
     * @param randomness Random value from VRF
     * @return Array of winner addresses
     */
    function _selectWinners(
        address[] memory participants,
        uint256 winnerCount,
        bytes32 randomness
    ) internal pure returns (address[] memory) {
        address[] memory winners = new address[](winnerCount);
        uint256 participantCount = participants.length;
        
        // Use Fisher-Yates shuffle algorithm with the random seed
        address[] memory shuffled = new address[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            shuffled[i] = participants[i];
        }

        // Shuffle using randomness
        for (uint256 i = participantCount - 1; i > 0; i--) {
            uint256 j = uint256(keccak256(abi.encodePacked(randomness, i))) % (i + 1);
            (shuffled[i], shuffled[j]) = (shuffled[j], shuffled[i]);
        }

        // Select first winnerCount participants
        for (uint256 i = 0; i < winnerCount; i++) {
            winners[i] = shuffled[i];
        }

        return winners;
    }

    /**
     * @notice Internal function to validate participant list
     * @param participants Array of participant addresses
     */
    function _validateParticipants(address[] calldata participants) internal pure {
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == address(0)) {
                revert ZeroAddressParticipant();
            }
            
            // Check for duplicates
            for (uint256 j = i + 1; j < participants.length; j++) {
                if (participants[i] == participants[j]) {
                    revert DuplicateParticipants();
                }
            }
        }
    }

    /**
     * @notice Internal function to sort addresses
     * @param addresses Array of addresses to sort
     * @return Sorted array of addresses
     */
    function _sortAddresses(address[] memory addresses) internal pure returns (address[] memory) {
        address[] memory sorted = new address[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            sorted[i] = addresses[i];
        }

        // Simple bubble sort for small arrays
        for (uint256 i = 0; i < sorted.length; i++) {
            for (uint256 j = i + 1; j < sorted.length; j++) {
                if (sorted[i] > sorted[j]) {
                    (sorted[i], sorted[j]) = (sorted[j], sorted[i]);
                }
            }
        }

        return sorted;
    }

    /**
     * @notice Emergency function to recover stuck ETH (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
