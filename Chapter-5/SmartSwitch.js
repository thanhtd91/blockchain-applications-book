/*
MIT License

Copyright (c) 2017 Arshdeep Bahga and Vijay Madisetti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var switchSource = "contract SmartSwitch { address public owner; \
  mapping (address => uint) public usersPaid; uint public numUsers; \
  event Deposit(address _from, uint _amount);  \
  event Refund(address _to, uint _amount);  \
  function SmartSwitch() { owner = msg.sender;   numUsers = 0; } \
  function activateSwitch() public { usersPaid[msg.sender] = \
    msg.value;  owner.send(msg.value); numUsers++; \
    Deposit(msg.sender, msg.value); }  \
    function refundUser(address recipient, uint amount) \
    public { if (msg.sender != owner) { return; } \
    if (usersPaid[recipient] == amount) \
    {  address myAddress = this; if (myAddress.balance >= amount) \
      {  recipient.send(amount); Refund(recipient, amount); \
        usersPaid[recipient] = 0; numUsers--; } } return; } \
         function getOwner() constant returns (address retVal)\
          { return owner; }  function getNumUsers() \
          constant returns (uint retVal) { return numUsers; } \
           function destroy() { if (msg.sender == owner) \
            { suicide(owner); } } }"

var switchCompiled = eth.compile.solidity(switchSource)

var switchContract = web3.eth.contract(
        switchCompiled.SmartSwitch.info.abiDefinition);

var smartswitch = switchContract.new(
  {
    from:web3.eth.accounts[1], 
    data:switchCompiled.SmartSwitch.code, 
    gas: 1000000
  }, function(e, contract){
    if(!e) {
      if(!contract.address) {
        console.log("Contract transaction send: TransactionHash: " + 
                contract.transactionHash + " waiting to be mined...");

      } else {
        console.log("Contract mined! Address: " + contract.address);
        console.log(contract);
      }
    }
})

//Output:
//Contract transaction send: TransactionHash: 
//0xbcbefbd19cdfbffe856a215768b9da5b7035add676cbbb7cacea791b14b0dc0b 
//waiting to be mined...

//Contract mined! Address: 0x1ec27f5d36a74cfac2c84e2c590b40f2164e598b

