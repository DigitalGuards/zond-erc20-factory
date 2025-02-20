const config = require("./config.json")
const contractCompiler = require("./contract-compiler")
const { Web3 } = require('@theqrl/web3')
const {GetHexSeedFromMnemonic} = require('./getHexSeedFromMnemonic')
const dotenv = require('dotenv')

dotenv.config()

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))

const mnemonic = process.env.MNEMONIC;
const hexseed = GetHexSeedFromMnemonic(mnemonic);
console.log(hexseed)

const acc = web3.zond.accounts.seedToAccount(hexseed)
web3.zond.wallet?.add(hexseed)
web3.zond.transactionConfirmationBlocks = config.tx_required_confirmations

const receiptHandler = function(receipt){
    console.log("Contract address ", receipt.contractAddress)
}

const deployMyTokenContract = async () => {
    console.log('Attempting to deploy MyToken contract from account:', acc.address)
    
    const output = contractCompiler.GetCompilerOutput()

    console.log(output)
    
    const contractABI = output.contracts['CustomERC20Factory.sol']['CustomERC20Factory'].abi
    const contractByteCode = output.contracts['CustomERC20Factory.sol']['CustomERC20Factory'].evm.bytecode.object
    const contract = new web3.zond.Contract(contractABI)

    // const deployOptions = {data: contractByteCode, arguments: ["TOKEN123", "TOK", "1000000000000000000000000000", 18, "1000000000000000000000000000", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "100000000000000000000000", "100000000000000000000000"]}

    const deployOptions = {data: contractByteCode, arguments: []}
    const contractDeploy = contract.deploy(deployOptions)
    const estimatedGas = await contractDeploy.estimateGas({from: acc.address})
    const txObj = {type: '0x2', gas: estimatedGas, from: acc.address, data: contractDeploy.encodeABI()}
    
    await web3.zond.sendTransaction(txObj, undefined, { checkRevertBeforeSending: false })
    .on('confirmation', console.log)
    .on('receipt', receiptHandler)
    .on('error', console.error)
}

deployMyTokenContract()
