import React, { Component } from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import R8IToken from "../abis/R8IToken.json";
import TokenFarm from "../abis/TokenFarm.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlackChainData();
  }

  async loadBlackChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({
      account: accounts[0],
    });
    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    } else {
      window.alert("Dai token contract not deployed to detected network.");
    }
    const r8iTokenData = R8IToken.networks[networkId];
    if (r8iTokenData) {
      const r8iToken = new web3.eth.Contract(
        R8IToken.abi,
        r8iTokenData.address
      );
      this.setState({ r8iToken });
      let r8iTokenBalance = await r8iToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ r8iTokenBalance: r8iTokenBalance.toString() });
    } else {
      window.alert("R8IToken contract not deployed to detected network.");
    }

    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });

      this.setState({ loading: false });
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("non ethereum browswer deteched");
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      daiToken: {},
      r8iToken: {},
      tokenFarm: {},
      daiTokenBalance: 0,
      r8iTokenBalance: 0,
      stakingBalance: 0,
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto"></div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
