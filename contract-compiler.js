const fs = require("fs");
const solc = require("solc");

/* The main contract should be mentioned here */
var input = {
    language: 'Solidity',
    sources: {
        'CustomERC20Factory.sol': {
            content: fs.readFileSync("./contracts/CustomERC20Factory.sol").toString(),
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

/* All imports of solidity contract should be mentioned here (if any) otherwise should be left blank */
function findImports(path) {
    if (path === 'CustomERC20.sol')
        return {
            contents:
                fs.readFileSync('./contracts/CustomERC20.sol').toString()
        }
    else if (path === 'ERC20.sol')
        return {
            contents:
                fs.readFileSync("./contracts/ERC20.sol").toString()
        };
    else if (path === 'IERC20.sol')
        return {
            contents:
                fs.readFileSync("./contracts/IERC20.sol").toString()
        };
    else if (path === 'IERC20Metadata.sol')
        return {
            contents:
                fs.readFileSync("./contracts/IERC20Metadata.sol").toString()
        };
    else if (path === 'Context.sol')
        return {
            contents:
                fs.readFileSync("./contracts/Context.sol").toString()
        };
    else if (path === 'Ownable.sol')
        return {
            contents:
                fs.readFileSync("./contracts/Ownable.sol").toString()
        }
    else return { error: 'File not found' };
}

function GetCompilerOutput() {
    return JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }))
}

module.exports = {
    GetCompilerOutput,
}
