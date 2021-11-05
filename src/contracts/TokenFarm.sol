pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./R8IToken.sol";

contract TokenFarm {
    string public name = "r8i token farm";
    R8IToken public r8iToken;
    DaiToken public daiToken;

    constructor(R8IToken _r8iToken, DaiToken _daiToken) public {
        daiToken = _daiToken;
        r8iToken = _r8iToken;
    }
}
