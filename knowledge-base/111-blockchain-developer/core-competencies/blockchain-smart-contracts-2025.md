# Blockchain & Smart Contract Development 2025

**Updated**: 2025-11-23 | **Stack**: Solidity, Ethereum, Hardhat, Web3.js

---

## Blockchain Fundamentals

```markdown
BLOCKCHAIN STRUCTURE:

BLOCK:
- Header:
  * Block number
  * Timestamp
  * Previous block hash
  * Merkle root (transaction summary)
  * Nonce (proof-of-work)
- Body:
  * Transactions

CHAIN:
Block 1 → Block 2 → Block 3 → ...
(Each block links to previous via hash)

IMMUTABILITY:
- Change Block 2 → Hash changes
- Block 3 hash no longer matches
- Chain breaks (invalid)

---

CONSENSUS MECHANISMS:

PROOF OF WORK (Bitcoin, Ethereum pre-Merge):
- Miners solve cryptographic puzzles
- First to solve gets reward
- Energy-intensive

PROOF OF STAKE (Ethereum post-Merge):
- Validators stake ETH (32 ETH minimum)
- Selected randomly to propose blocks
- Energy-efficient (99% less energy than PoW)
- Slashing: Penalty for malicious behavior

---

TYPES:

PUBLIC (Permissionless):
- Anyone can join
- Fully decentralized
- Examples: Bitcoin, Ethereum

PRIVATE (Permissioned):
- Restricted access
- Centralized control
- Examples: Hyperledger, Corda
- Use: Enterprise (supply chain, finance)

CONSORTIUM:
- Semi-decentralized
- Multiple organizations
- Example: R3 (banks)
```

---

## Solidity Smart Contracts

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simple Token Contract (ERC-20 standard)
contract SimpleToken {
    // State variables (stored on blockchain)
    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // Mapping: address → balance
    mapping(address => uint256) public balanceOf;
    
    // Mapping: owner → spender → allowance
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events (logs)
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Constructor (runs once on deployment)
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10**uint256(decimals);
        balanceOf[msg.sender] = totalSupply; // Give creator all tokens
    }
    
    // Transfer tokens
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid address");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    // Approve spender
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    // Transfer from (requires approval)
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}

---

// NFT Contract (ERC-721)
contract SimpleNFT {
    string public name = "My NFT";
    string public symbol = "MNFT";
    
    uint256 private _tokenIds;
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    function mint(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _owners[newTokenId] = to;
        _balances[to]++;
        _tokenURIs[newTokenId] = tokenURI;
        
        emit Transfer(address(0), to, newTokenId);
        return newTokenId;
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }
    
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function transfer(address to, uint256 tokenId) public {
        require(_owners[tokenId] == msg.sender, "Not owner");
        require(to != address(0), "Invalid address");
        
        _balances[msg.sender]--;
        _balances[to]++;
        _owners[tokenId] = to;
        
        emit Transfer(msg.sender, to, tokenId);
    }
}

---

// SECURITY: Reentrancy Attack Prevention
contract Vulnerable {
    mapping(address => uint256) public balances;
    
    // VULNERABLE
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        
        // External call BEFORE updating state
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] = 0; // Too late! Can be exploited
    }
}

contract Secure {
    mapping(address => uint256) public balances;
    
    // SECURE: Checks-Effects-Interactions pattern
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        
        // Update state BEFORE external call
        balances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}

// Better: Use OpenZeppelin's ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BestPractice is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function withdraw() public nonReentrant {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

---

## Development Tools

```bash
# Hardhat (Development framework)

# Initialize project
npm init -y
npm install --save-dev hardhat

# Create Hardhat project
npx hardhat

# hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

---

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS "Constructor Arg"
```

---

## Testing Smart Contracts

```javascript
// test/SimpleToken.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let token;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    token = await SimpleToken.deploy(1000000); // 1M tokens
    await token.deployed();
  });
  
  describe("Deployment", function () {
    it("Should assign total supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });
  
  describe("Transactions", function () {
    it("Should transfer tokens", async function () {
      // Transfer 50 tokens to addr1
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
      
      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });
    
    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      // Try to send more than balance
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient balance");
      
      // Owner balance shouldn't change
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
  
  describe("Allowances", function () {
    it("Should approve and transferFrom", async function () {
      // Owner approves addr1 to spend 100 tokens
      await token.approve(addr1.address, 100);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
      
      // addr1 transfers 50 tokens from owner to addr2
      await token.connect(addr1).transferFrom(owner.address, addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(50);
    });
  });
});
```

---

## Web3 Integration

```javascript
// Frontend (React + ethers.js)
import { ethers } from 'ethers';
import SimpleTokenABI from './SimpleToken.json';

const CONTRACT_ADDRESS = '0x...';

function TokenApp() {
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState('');
  
  // Connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      
      // Get balance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleTokenABI, signer);
      const bal = await contract.balanceOf(address);
      setBalance(ethers.utils.formatEther(bal));
    } else {
      alert('Please install MetaMask');
    }
  }
  
  // Transfer tokens
  async function transfer() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleTokenABI, signer);
    
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;
    
    // Convert to wei
    const amountWei = ethers.utils.parseEther(amount);
    
    // Send transaction
    const tx = await contract.transfer(recipient, amountWei);
    
    // Wait for confirmation
    await tx.wait();
    
    alert('Transfer successful!');
  }
  
  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Account: {account}</p>
      <p>Balance: {balance} MTK</p>
      
      <input id="recipient" placeholder="Recipient address" />
      <input id="amount" placeholder="Amount" />
      <button onClick={transfer}>Transfer</button>
    </div>
  );
}
```

---

## Gas Optimization

```solidity
// Gas-efficient patterns

// BAD: String comparison (expensive)
function compare(string memory a, string memory b) public pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
}

// GOOD: bytes32 comparison (cheaper)
bytes32 constant ADMIN_ROLE = keccak256("ADMIN");

---

// BAD: Loop through array
uint256[] public items;

function sum() public view returns (uint256) {
    uint256 total = 0;
    for (uint256 i = 0; i < items.length; i++) {
        total += items[i];
    }
    return total;
}

// GOOD: Store total (single storage read)
uint256 public total;

function addItem(uint256 item) public {
    items.push(item);
    total += item; // Update total on add
}

---

// BAD: Multiple storage writes
contract Bad {
    uint256 public a;
    uint256 public b;
    
    function update() public {
        a = 1; // Storage write (expensive)
        b = 2; // Storage write
    }
}

// GOOD: Memory then storage
contract Good {
    uint256 public a;
    uint256 public b;
    
    function update() public {
        uint256 tempA = 1; // Memory (cheap)
        uint256 tempB = 2; // Memory
        
        a = tempA; // Single storage write
        b = tempB; // Single storage write
    }
}

---

// Use uint256 (not uint8)
// uint256 is cheaper (native EVM word size)
uint256 public counter; // GOOD
uint8 public counter; // BAD (requires extra operations)

---

// Short-circuit evaluation
require(condition1 && condition2, "Error");
// If condition1 fails, condition2 not evaluated (saves gas)
```

---

## Security Best Practices

```markdown
COMMON VULNERABILITIES:

1. REENTRANCY:
   - External calls before state updates
   - Fix: Update state first, or use ReentrancyGuard

2. INTEGER OVERFLOW/UNDERFLOW:
   - Solidity 0.8+: Built-in protection
   - Earlier versions: Use SafeMath

3. ACCESS CONTROL:
   - Missing onlyOwner modifiers
   - Fix: Use OpenZeppelin Ownable

4. FRONT-RUNNING:
   - Attackers see transaction, submit with higher gas
   - Fix: Commit-reveal pattern, private mempools

5. TIMESTAMP DEPENDENCE:
   - block.timestamp manipulated by miners (~15 sec)
   - Fix: Don't rely on exact timestamp for critical logic

---

AUDITING TOOLS:

SLITHER (Static analysis):
```bash
pip install slither-analyzer
slither .
```

MYTHRIL (Symbolic execution):
```bash
pip install mythril
myth analyze contracts/MyContract.sol
```

ECHIDNA (Fuzzing):
```bash
echidna-test contracts/MyContract.sol --contract MyContract
```

PROFESSIONAL AUDITS:
- ConsenSys Diligence ($50K-$200K)
- Trail of Bits ($50K-$150K)
- OpenZeppelin ($30K-$100K)
- Before mainnet launch (critical!)
```

---

## Key Takeaways

1. **Security first** - Audits, best practices, battle-tested libraries
2. **Gas optimization** - Storage expensive, memory cheap
3. **Immutable** - Can't update contracts (deploy carefully!)
4. **Test thoroughly** - Bugs cost real money
5. **Use OpenZeppelin** - Don't reinvent (audited libraries)

---

## References

- Solidity Documentation
- OpenZeppelin Contracts
- "Mastering Ethereum" - Andreas Antonopoulos

**Related**: `defi-protocols.md`, `nft-standards.md`, `web3-frontend.md`
