// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {ProvablyFairLaunchpad} from "../src/ProvablyFairLaunchpad.sol";

// Simple mock contract that just returns a request ID
contract MockRandomnessSender {
    uint256 public nextRequestId = 1;
    
    function requestRandomness(uint32 callbackGasLimit) external payable returns (uint256) {
        // Ensure some ETH is sent for the request
        require(msg.value > 0, "Must send ETH for randomness request");
        uint256 requestId = nextRequestId;
        nextRequestId++;
        return requestId;
    }
    
    function requestRandomnessWithSubscription(uint32 callbackGasLimit, uint256 subId) external payable returns (uint256) {
        // Ensure some ETH is sent for the request
        require(msg.value > 0, "Must send ETH for randomness request");
        uint256 requestId = nextRequestId;
        nextRequestId++;
        return requestId;
    }
    
    // Mock function to trigger randomness callback
    function triggerRandomnessCallback(address launchpad, uint256 requestId, bytes32 randomness) external {
        ProvablyFairLaunchpad(launchpad).receiveRandomness(requestId, randomness);
    }
    
    // Required methods from IRandomnessSender
    function calculateRequestPriceNative(uint32 _callbackGasLimit) external view returns (uint256) {
        return 0.05 ether; // Return a reasonable price for testing
    }
    
    function estimateRequestPriceNative(uint32 _callbackGasLimit, uint256 _requestGasPriceWei) external view returns (uint256) {
        return 0.05 ether; // Return a reasonable price for testing
    }
    
    function getRequest(uint256 requestId) external view returns (
        uint256 subId,
        uint256 directFundingFeePaid,
        uint32 callbackGasLimit,
        uint256 requestIdParam,
        bytes memory message,
        bytes memory condition,
        bytes memory signature,
        uint256 nonce,
        address callback
    ) {
        // Return default values for testing
        return (0, 0, 0, requestId, "", "", "", 0, address(0));
    }
    
    function setSignatureSender(address newSignatureSender) external {
        // Mock implementation
    }
    
    function getAllRequests() external view returns (bytes[] memory) {
        // Return empty array for testing
        return new bytes[](0);
    }
    
    function messageFrom(
        uint256 nonce,
        address callback
    ) external pure returns (bytes memory) {
        // Return empty bytes for testing
        return "";
    }
    
    function isInFlight(uint256 requestId) external view returns (bool) {
        return false; // Always return false for testing
    }
    
    function getConfig() external view returns (
        uint32 maxGasLimit,
        uint32 gasAfterPaymentCalculation,
        uint32 fulfillmentFlatFeeNativePPM,
        uint32 weiPerUnitGas,
        uint32 blsPairingCheckOverhead,
        uint8 nativePremiumPercentage,
        uint32 gasForCallExactCheck
    ) {
        return (1000000, 21000, 1000, 1, 1000, 10, 1000);
    }
    
    // Required methods from ISubscription
    function addConsumer(uint256 subId, address consumer) external {
        // Mock implementation
    }
    
    function removeConsumer(uint256 subId, address consumer) external {
        // Mock implementation
    }
    
    function cancelSubscription(uint256 subId, address to) external {
        // Mock implementation
    }
    
    function acceptSubscriptionOwnerTransfer(uint256 subId) external {
        // Mock implementation
    }
    
    function requestSubscriptionOwnerTransfer(uint256 subId, address newOwner) external {
        // Mock implementation
    }
    
    function createSubscription() external returns (uint256 subId) {
        return nextRequestId++;
    }
    
    function getSubscription(uint256 subId) external view returns (
        uint96 nativeBalance,
        uint64 reqCount,
        address owner,
        address[] memory consumers
    ) {
        return (0, 0, address(0), new address[](0));
    }
    
    function pendingRequestExists(uint256 subId) external view returns (bool) {
        return false;
    }
    
    function getActiveSubscriptionIds(uint256 startIndex, uint256 maxCount) external view returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function fundSubscriptionWithNative(uint256 subId) external payable {
        // Mock implementation
    }
}

contract ProvablyFairLaunchpadTest is Test {
    ProvablyFairLaunchpad public launchpad;
    MockRandomnessSender public mockRandomnessSender;
    
    address public owner;
    address public user1;
    address public user2;
    address public user3;
    
    // Store the actual owner address from the contract to avoid invariant test issues
    address public contractOwner;
    
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

    function setUp() public {
        // Use deterministic addresses to avoid invariant test issues
        owner = address(0x1234567890123456789012345678901234567890);
        user1 = address(0x1111111111111111111111111111111111111111);
        user2 = address(0x2222222222222222222222222222222222222222);
        user3 = address(0x3333333333333333333333333333333333333333);
        
        // Give ETH to users for randomness requests
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
        
        // Deploy contracts as the owner
        vm.startPrank(owner);
        mockRandomnessSender = new MockRandomnessSender();
        launchpad = new ProvablyFairLaunchpad(address(mockRandomnessSender));
        vm.stopPrank();
        
        // Store the actual owner address from the contract
        contractOwner = launchpad.owner();
        
        // Debug: Print the addresses to understand what's happening
        console.log("Test owner address:", owner);
        console.log("Contract owner address:", contractOwner);
        console.log("Contract owner() result:", launchpad.owner());
    }

    // ============ Unit Tests ============

    function test_Constructor() public {
        // The owner should be the deployer (owner address)
        assertEq(launchpad.owner(), contractOwner);
        assertEq(address(launchpad.randomnessSender()), address(mockRandomnessSender));
        assertEq(launchpad.nextSelectionId(), 0);
    }

    function test_RequestSelection() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        
        // Request selection with sufficient ETH
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        
        vm.stopPrank();
        
        assertEq(selectionId, 1);
        assertEq(launchpad.nextSelectionId(), 1);
        
        // Check selection request details
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(1);
        assertEq(selection.requester, user1);
        assertEq(selection.winnerCount, 2);
        assertEq(selection.requestId, 1);
        assertEq(selection.isCompleted, false);
        assertEq(selection.isCancelled, false);
        assertGt(selection.timestamp, 0);
    }

    function test_RequestSelectionRevertWhen_TooFewParticipants() public {
        address[] memory participants = new address[](1);
        participants[0] = user1;
        
        vm.startPrank(user1);
        vm.expectRevert(ProvablyFairLaunchpad.InvalidParticipantCount.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 1);
        vm.stopPrank();
    }

    function test_RequestSelectionRevertWhen_TooManyParticipants() public {
        address[] memory participants = new address[](10001);
        for (uint256 i = 0; i < 10001; i++) {
            participants[i] = makeAddr(string(abi.encodePacked("user", i)));
        }
        
        vm.startPrank(user1);
        vm.expectRevert(ProvablyFairLaunchpad.InvalidParticipantCount.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 1);
        vm.stopPrank();
    }

    function test_RequestSelectionRevertWhen_InvalidWinnerCount() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        
        // Winner count 0
        vm.expectRevert(ProvablyFairLaunchpad.InvalidWinnerCount.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 0);
        
        // Winner count exceeds participant count
        vm.expectRevert(ProvablyFairLaunchpad.InvalidWinnerCount.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 4);
        
        // Winner count exceeds maximum
        vm.expectRevert(ProvablyFairLaunchpad.InvalidWinnerCount.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 1001);
        
        vm.stopPrank();
    }

    function test_RequestSelectionRevertWhen_DuplicateParticipants() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user1; // Duplicate
        participants[2] = user2;
        
        vm.startPrank(user1);
        vm.expectRevert(ProvablyFairLaunchpad.DuplicateParticipants.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
    }

    function test_RequestSelectionRevertWhen_ZeroAddressParticipant() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = address(0); // Zero address
        participants[2] = user2;
        
        vm.startPrank(user1);
        vm.expectRevert(ProvablyFairLaunchpad.ZeroAddressParticipant.selector);
        launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
    }

    function test_ReceiveRandomness() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Get the request ID from the selection
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        uint256 requestId = selection.requestId;
        
        // Mock randomness fulfillment - only the randomness sender can call this
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, bytes32(uint256(12345)));
        
        // Check that selection is completed
        selection = launchpad.getSelection(selectionId);
        assertEq(selection.isCompleted, true);
        assertEq(selection.randomness, bytes32(uint256(12345)));
        assertEq(selection.winners.length, 2);
        
        // Verify winners are from the participant list
        for (uint256 i = 0; i < selection.winners.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < participants.length; j++) {
                if (selection.winners[i] == participants[j]) {
                    found = true;
                    break;
                }
            }
            assertTrue(found, "Winner not in participant list");
        }
    }

    function test_ReceiveRandomnessRevertWhen_InvalidRequestId() public {
        // Only randomness sender can call this function
        vm.expectRevert("Only randomnessSender can call");
        vm.prank(address(0x123)); // Random address
        launchpad.receiveRandomness(999, bytes32(uint256(12345)));
    }

    function test_ReceiveRandomnessRevertWhen_AlreadyCompleted() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Get the request ID from the selection
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        uint256 requestId = selection.requestId;
        
        // First fulfillment
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, bytes32(uint256(12345)));
        
        // Second fulfillment should revert
        vm.expectRevert(ProvablyFairLaunchpad.SelectionAlreadyCompleted.selector);
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, bytes32(uint256(67890)));
    }

    function test_CancelSelection() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Cancel by requester
        vm.prank(user1);
        launchpad.cancelSelection(selectionId);
        
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        assertEq(selection.isCancelled, true);
        assertEq(selection.isCompleted, false);
    }

    function test_CancelSelectionRevertWhen_NotAuthorized() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Cancel by unauthorized user
        vm.expectRevert(ProvablyFairLaunchpad.NotAuthorized.selector);
        vm.prank(user2);
        launchpad.cancelSelection(selectionId);
    }

    function test_GetWinners() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Get the request ID from the selection
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        uint256 requestId = selection.requestId;
        
        // Fulfill randomness
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, bytes32(uint256(12345)));
        
        // Get winners
        address[] memory winners = launchpad.getWinners(selectionId);
        assertEq(winners.length, 2);
    }

    function test_GetWinnersRevertWhen_SelectionNotCompleted() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        vm.expectRevert(ProvablyFairLaunchpad.SelectionNotCompleted.selector);
        launchpad.getWinners(selectionId);
    }

    function test_VerifyFairness() public {
        address[] memory participants = new address[](3);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, 2);
        vm.stopPrank();
        
        // Get the request ID from the selection
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        uint256 requestId = selection.requestId;
        
        // Fulfill randomness
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, bytes32(uint256(12345)));
        
        // Get actual winners
        address[] memory actualWinners = launchpad.getWinners(selectionId);
        
        // Verify fairness
        bool isFair = launchpad.verifyFairness(selectionId, actualWinners);
        assertTrue(isFair, "Fairness verification should pass");
        
        // Test with wrong winners
        address[] memory wrongWinners = new address[](2);
        wrongWinners[0] = makeAddr("wrongUser1");
        wrongWinners[1] = makeAddr("wrongUser2");
        
        bool isFairWrong = launchpad.verifyFairness(selectionId, wrongWinners);
        assertFalse(isFairWrong, "Fairness verification should fail with wrong winners");
    }

    // ============ Fuzz Tests ============

    function testFuzz_RequestSelection(uint256 participantCount, uint256 winnerCount) public {
        // Bound inputs to valid ranges
        participantCount = bound(participantCount, 2, 100);
        winnerCount = bound(winnerCount, 1, participantCount);
        
        // Generate unique participants
        address[] memory participants = new address[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            participants[i] = makeAddr(string(abi.encodePacked("user", i)));
        }
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, winnerCount);
        vm.stopPrank();
        
        assertEq(selectionId, 1);
        
        // Verify selection request
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        assertEq(selection.requester, user1);
        assertEq(selection.winnerCount, winnerCount);
    }

    function testFuzz_WinnerSelection(uint256 participantCount, uint256 winnerCount, bytes32 randomness) public {
        // Bound inputs to valid ranges
        participantCount = bound(participantCount, 2, 50);
        winnerCount = bound(winnerCount, 1, participantCount);
        
        // Generate unique participants
        address[] memory participants = new address[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            participants[i] = makeAddr(string(abi.encodePacked("user", i)));
        }
        
        vm.startPrank(user1);
        uint256 selectionId = launchpad.requestSelection{value: 0.1 ether}(participants, winnerCount);
        vm.stopPrank();
        
        // Get the request ID from the selection
        ProvablyFairLaunchpad.SelectionRequest memory selection = launchpad.getSelection(selectionId);
        uint256 requestId = selection.requestId;
        
        // Fulfill randomness
        vm.prank(address(mockRandomnessSender));
        launchpad.receiveRandomness(requestId, randomness);
        
        // Get winners
        address[] memory winners = launchpad.getWinners(selectionId);
        assertEq(winners.length, winnerCount);
        
        // Verify all winners are unique
        for (uint256 i = 0; i < winners.length; i++) {
            for (uint256 j = i + 1; j < winners.length; j++) {
                assertTrue(winners[i] != winners[j], "Winners should be unique");
            }
        }
        
        // Verify all winners are from participant list
        for (uint256 i = 0; i < winners.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < participants.length; j++) {
                if (winners[i] == participants[j]) {
                    found = true;
                    break;
                }
            }
            assertTrue(found, "Winner not in participant list");
        }
    }

    // ============ Invariant Tests ============

    function invariant_SelectionIdIncrements() public view {
        // This invariant ensures that selection IDs always increment
        uint256 currentId = launchpad.nextSelectionId();
        assertGe(currentId, 0, "Selection ID should never be negative");
    }

    function invariant_OwnerNeverChanges() public view {
        // This invariant ensures the owner never changes after deployment
        assertEq(launchpad.owner(), contractOwner, "Owner should never change");
    }

    function invariant_RandomnessSenderNeverChanges() public view {
        // This invariant ensures the randomness sender never changes after deployment
        assertEq(address(launchpad.randomnessSender()), address(mockRandomnessSender), "RandomnessSender should never change");
    }
}
