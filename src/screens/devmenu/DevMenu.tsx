import React, { useState, MouseEvent, ChangeEvent } from "react";

type Props = {
  setScreen: (screen: string) => void;
  gameNetwork: any;
};

type ErrorMessage = {
  message: string;
};

type Result = {
  user?: User;
  error?: ErrorMessage;
  message?: string;
  token?: string;
  loans?: Array<LoansAvailable>;
  ships?: Array<ShipsPurchasable>;
  locations?: Array<Location>;
  systems?: Array<System>;
};

type User = {
  username: string;
  credits: number;
  loans: Array<LoansTaken>;
  ships: Array<ShipsOwned>;
};

type LoansAvailable = {
  amount: number;
  collateralRequired: boolean;
  rate: number;
  termInDays: number;
  type: string;
};

type ShipsPurchasable = {
  class: string;
  manufacturer: string;
  maxCargo: number;
  plating: number;
  purchaseLocations: Array<PurchaseOffer>;
  speed: number;
  type: string;
  weapons: number;
};

type System = {
  symbol: string;
  name: string;
  locations: Array<Location>;
};

type Location = {
  name: string;
  symbol: string;
  type: string;
  x: number;
  y: number;
};

type PurchaseOffer = {
  location: string;
  price: number;
};

type ShipsOwned = {
  cargo: Array<Cargo>;
  class: string;
  id: string;
  location: string;
  manufacturer: string;
  maxCargo: number;
  plating: number;
  spaceAvailable: number;
  speed: number;
  type: string;
  weapons: number;
  x: number;
  y: number;
};

type LoansTaken = {
  due: string;
  id: string;
  repaymentAmount: number;
  status: string;
  type: string;
};

type Cargo = {
  good: string;
  quantity: number;
  totalVolume: number;
};

export default function DevMenu({ setScreen, gameNetwork }: Props): JSX.Element {
  const [resultView, setResultView] = useState(<div />);
  const [inputUsername, setInputUsername] = useState("");
  const [inputToken, setInputToken] = useState("");

  const displayErrorMessage = (errorMsg: string) => {
    setResultView(<div>Error: {errorMsg}</div>);
  };

  const takeOutLoan = (type: string) => {
    console.log(`Taking out a loan of type ${type}`);
    gameNetwork.performUserAction("loans", { type }, (result: Result) => {
      console.log(result);
    });
  };

  const purchaseShip = (type: string, location: string) => {
    console.log(`Taking out a loan of type ${type} + at location ${location}`);
    gameNetwork.performUserAction("ships", { location, type }, (result: Result) => {
      console.log(result);
    });
  };

  const handleChange = (event: ChangeEvent) => {
    event.preventDefault();
    switch (event.target.id) {
      case "new-account-name":
        setInputUsername((event.target as HTMLInputElement).value);
        console.log("Writing to username.");
        break;
      case "login-name":
        setInputUsername((event.target as HTMLInputElement).value);
        console.log("Writing to loginName.");
        break;
      case "token":
        setInputToken((event.target as HTMLInputElement).value);
        console.log("Writing to token.");
        break;
      default:
        console.log("Default change handler reached.");
    }
  };

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    switch (((event.target as Node).parentNode as Element).id) {
      case "create-account":
        console.log("Creating account.");
        gameNetwork.createUser(inputUsername, (result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.user) {
            setResultView(
              <div>
                <div>Username {result.user.username} created!</div>
                <div>Token: {result.token}</div>
                <div>
                  Please save this elsewhere immediately! This will be your only
                  chance.
                </div>
              </div>,
            );
          }
        });
        break;
      case "login":
        console.log("Logging in.");
        gameNetwork.authenticateUser(
          inputUsername,
          inputToken,
          (errorMessage: string) => {
            if (errorMessage) {
              displayErrorMessage(errorMessage);
            } else {
              setResultView(
                <div>
                  <div>Successfully logged in as {inputUsername}!</div>
                </div>,
              );
            }
          },
        );
        break;
      case "defaultlogin": {
        console.log("Logging in test account.");
        const testUsername = "superawesometestaccount";
        const testToken = "c525bf3e-51ba-4195-a3f9-643b8789173f";
        gameNetwork.authenticateUser(
          testUsername,
          testToken,
          (errorMessage: string) => {
            if (errorMessage) {
              displayErrorMessage(errorMessage);
            } else {
              setResultView(
                <div>
                  <div>Successfully logged in default test account as {testUsername}!</div>
                </div>,
              );
            }
          },
        );
        break;
      }
      case "randologin": {
        console.log("Logging in random account.");
        const randoUsername = `Rando${Math.floor(Math.random() * 1000000)}`;
        gameNetwork.createUser(randoUsername, (result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.user) {
            // TODO: Added this to avoid the error, but I'm not sure this was this was the right way
            // to handle this for the case of an empty token being returned...
            gameNetwork.authenticateUser(
              randoUsername,
              result.token ? result.token : "",
              (errorMessage: string) => {
                if (errorMessage) {
                  displayErrorMessage(errorMessage);
                } else {
                  setResultView(
                    <div>
                      <div>Successfully logged in default test account as {randoUsername}!</div>
                    </div>,
                  );
                }
              },
            );
          }
        });
        break;
      }
      case "get-user-info":
        console.log("Getting user info.");
        gameNetwork.getUserStatus((result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.user) {
            setResultView(
              <div>
                <div>
                  Username: {result.user.username}
                </div>
                <div>
                  Credits: {result.user.credits}
                </div>
                <div>
                  Ships:
                  {result.user.ships.map((ship, index) => (
                    <div key={`ship${index}${1}`}>
                      {index + 1}. {ship.type} at [{ship.x}, {ship.y}], {ship.spaceAvailable} of {ship.maxCargo} cargo units available
                    </div>
                  ))}
                </div>
                <br />
                <div>
                  Loans:
                  {result.user.loans.map((loan, index) => (
                    <div key={`loan${index}${1}`}>
                      {index + 1}. {loan.type}: {loan.repaymentAmount}
                    </div>
                  ))}
                </div>
                <br />
              </div>,
            );
          }
        });
        break;
      case "get-available-loans":
        console.log("Getting available loans.");
        gameNetwork.getGameInfo("loans", (result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.loans) {
            console.log(result.loans);
            console.log(result.loans[0]);
            console.log(result.loans[0].amount);
            const loanItems = result.loans.map((loanObject, index) => (
              <div key={`loan${index}${1}`}>
                <div>Amount: {loanObject.amount}</div>
                <div>Collateral Required: {loanObject.collateralRequired.toString()}</div>
                <div>Rate: {loanObject.rate}</div>
                <div>Term (in days): {loanObject.termInDays}</div>
                <div>Type: {loanObject.type}</div>
                <div id="take-out-loan">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      takeOutLoan(loanObject.type);
                    }}
                  >Take Out Loan</button>
                </div>
              </div>
            ));
            console.log(loanItems);
            setResultView(<div>{loanItems}</div>);
          } else {
            console.log("No loans found?");
          }
        });
        break;
      case "get-available-ships":
        console.log("Getting available ships.");
        gameNetwork.getGameInfo("ships", (result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.ships) {
            console.log(result.ships);
            const shipItems = result.ships.map((shipObject, index) => (
              <div key={`ship${index}${1}`}>
                <div>Class: {shipObject.class}</div>
                <div>Manufacturer: {shipObject.manufacturer}</div>
                <div>Max Cargo: {shipObject.maxCargo}</div>
                <div>Plating: {shipObject.plating}</div>
                <div>Speed: {shipObject.speed}</div>
                <div>Type: {shipObject.type}</div>
                <div>Weapons: {shipObject.weapons}</div>
                <div>Offers: {shipObject.purchaseLocations.map((offer, index) => (
                  <div key={`location${index}${1}`}>
                    {index + 1}. {offer.location}: {offer.price}
                    <div id="purchase-ship">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          purchaseShip(shipObject.type, offer.location);
                        }}
                      >Purchase</button>
                    </div>
                  </div>
                  ))}
                  <br />
                </div>
              </div>
            ));
            console.log(shipItems);
            setResultView(<div>{shipItems}</div>);
          } else {
            console.log("No ships found?");
          }
        });
        break;
      case "get-all-systems":
        console.log("Getting all systems.");
        gameNetwork.getGameInfo("systems", (result: Result) => {
          console.log(result);
          if (result.error) {
            displayErrorMessage(result.error.message);
          } else if (result.systems) {
            console.log(result.systems);
            const systemItems = result.systems.map((systemObject, index) => (
              <div key={`system${index}${1}`}>
                <div>Name: {systemObject.name}</div>
                <div>Locations: {systemObject.locations.map((locationObject, index) => (
                    <div key={`location${index}${1}`}>
                      <div>Name: {locationObject.name}</div>
                      <div>Symbol: {locationObject.symbol}</div>
                      <div>Coordinates: [{locationObject.x},{locationObject.y}]</div>
                      <br />
                    </div>
                  ))}
                  <br />
                </div>
              </div>
            ));
            console.log(systemItems);
            setResultView(<div>{systemItems}</div>);
          } else {
            console.log("No locations found?");
          }
        });
        break;
      default:
        console.log("Default click handler reached.");
    }
  };

  return (
    <div className="dev-menu">
      <h1>This is the dev menu!</h1>
      <div className="flex-container">
        <div className="dev-menu-content-container">
          <h3>Options:</h3>
          <div className="dev-menu-content">
            <form>
              <ul className="dev-menu-option-list">
                <li key="create-account">
                  <label id="create-account">
                    Create User:
                    <input
                      id="new-account-name"
                      type="text"
                      name="name"
                      placeholder="Username"
                      onChange={handleChange}
                    />
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="login">
                  <label id="login">
                    Log In:
                    <input
                      id="login-name"
                      type="text"
                      name="name"
                      placeholder="Username"
                      onChange={handleChange}
                    />
                    <input
                      id="token"
                      type="text"
                      name="token"
                      placeholder="Token"
                      onChange={handleChange}
                    />
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="defaultlogin">
                  <label id="defaultlogin">
                    Log In Default Account:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="randologin">
                  <label id="randologin">
                    Log In Random Account:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="get-user-info">
                  <label id="get-user-info">
                    User Info:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="get-available-loans">
                  <label id="get-available-loans">
                    Available Loans:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="get-available-ships">
                  <label id="get-available-ships">
                    Available Ships:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
                <li key="get-all-systems">
                  <label id="get-all-systems">
                    All Systems:
                    <button value="Submit" onClick={handleClick}>
                      Submit
                    </button>
                  </label>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div className="dev-menu-content-container">
          <h3>Results:</h3>
          <div className="dev-menu-content">{resultView}</div>
        </div>
      </div>
    </div>
  );
}
