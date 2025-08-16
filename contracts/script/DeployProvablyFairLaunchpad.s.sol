// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {ProvablyFairLaunchpad} from "../src/ProvablyFairLaunchpad.sol";

contract DeployProvablyFairLaunchpad is Script {
    // Base Sepolia RandomnessSender address
    // You can find this at: https://docs.dcipher.network/networks
    address constant RANDOMNESS_SENDER = 0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779; // Base Sepolia address
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        ProvablyFairLaunchpad launchpad = new ProvablyFairLaunchpad(RANDOMNESS_SENDER);
        
        vm.stopBroadcast();
        
        console.log("ProvablyFairLaunchpad deployed to:", address(launchpad));
        console.log("RandomnessSender set to:", RANDOMNESS_SENDER);
        console.log("Owner set to:", launchpad.owner());
    }
}
