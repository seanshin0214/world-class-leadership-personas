# Web3 & Blockchain Development 2025

**Updated**: 2025-11-23 | **Chains**: Ethereum, Solana, Base

---

## Ecosystem Overview 2025

**Ethereum**: Still dominant DeFi, L2s thriving (Base, Arbitrum, Optimism)
**Solana**: 7,600+ new developers (surpassed Ethereum), fast & cheap
**Base**: Coinbase L2, onboarding millions to Web3

---

## Smart Contract Development

### Solidity (Ethereum/Base)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    
    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, 100_000 * 10**18);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
```

### Hardhat Setup

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY]
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY
    }
  }
};
```

### Testing

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let token;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();
  });

  it("Should mint tokens", async function () {
    await token.mint(addr1.address, ethers.parseEther("100"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
  });

  it("Should not exceed max supply", async function () {
    await expect(
      token.mint(addr1.address, ethers.parseEther("1000001"))
    ).to.be.revertedWith("Max supply exceeded");
  });
});
```

---

## Rust/Anchor (Solana)

```rust
use anchor_lang::prelude::*;

declare_id!("your_program_id_here");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = data;
        counter.authority = ctx.accounts.user.key();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}
```

---

## Frontend Integration

### ethers.js (Ethereum/Base)

```typescript
import { ethers } from 'ethers';

// Connect to wallet
const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();

// Contract interaction
const contract = new ethers.Contract(
  contractAddress,
  abi,
  signer
);

// Read
const balance = await contract.balanceOf(userAddress);
console.log(ethers.formatEther(balance));

// Write
const tx = await contract.mint(userAddress, ethers.parseEther("100"));
await tx.wait();
console.log("Minted!");
```

### @solana/web3.js

```typescript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';

const connection = new Connection(clusterApiUrl('devnet'));
const wallet = window.solana;

const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl, programId, provider);

// Call program
const tx = await program.methods
  .increment()
  .accounts({
    counter: counterPubkey,
    authority: wallet.publicKey,
  })
  .rpc();

console.log("Transaction:", tx);
```

---

## Security Best Practices

### Common Vulnerabilities

```solidity
// ❌ Reentrancy
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool sent,) = msg.sender.call{value: amount}("");
    require(sent);
    balances[msg.sender] = 0;  // Too late!
}

// ✅ Checks-Effects-Interactions
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;  // Update state first
    (bool sent,) = msg.sender.call{value: amount}("");
    require(sent);
}

// ❌ Integer Overflow (pre-0.8.0)
uint256 a = type(uint256).max;
a = a + 1;  // Wraps to 0

// ✅ Use Solidity 0.8+ (built-in overflow check)
// Or SafeMath library
```

### Audit Tools

```bash
# Slither (static analysis)
pip install slither-analyzer
slither contracts/

# Mythril (symbolic execution)
docker pull mythril/myth
myth analyze contracts/MyContract.sol

# Echidna (fuzzing)
echidna-test contracts/MyContract.sol --contract MyContract
```

---

## Gas Optimization

```solidity
// ❌ Expensive
for (uint i = 0; i < array.length; i++) {
    total += array[i];
}

// ✅ Cache length
uint len = array.length;
for (uint i = 0; i < len; i++) {
    total += array[i];
}

// ❌ Multiple storage reads
uint balance = balances[msg.sender];
require(balance > amount);
balances[msg.sender] = balance - amount;

// ✅ Single storage read
uint balance = balances[msg.sender];
require(balance > amount);
balances[msg.sender] -= amount;  // Direct update

// Use ++i instead of i++ (saves 5 gas)
// Use custom errors instead of strings (saves 50-100 gas)
```

---

## Key Takeaways

1. **Security first**: Audit everything
2. **Test extensively**: Unit, integration, fuzzing
3. **Gas efficiency**: Optimize for cost
4. **Solana growing fast**: 7,600+ new developers
5. **Layer 2s**: Base, Arbitrum for scalability

---

## References

- Solidity Documentation
- Anchor Book (Solana)
- "Mastering Ethereum" - Andreas Antonopoulos
- OpenZeppelin Contracts

**Related**: `defi-protocols.md`, `nft-development.md`
