// Import necessary modules
import Principal "mo:base/Principal";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Array "mo:base/Array";


actor Backend {
    private stable var tokens : [(Principal, Nat)] = [];
    private stable var transfers : [(Principal, Principal, Nat)] = [];

    // Mint new tokens for a principal
    public shared(msg) func mint(to: Principal, amount: Nat) : async Result.Result<Nat, Text> {
        try {
            tokens := Array.append(tokens, [(to, amount)]);
            let transferIndex = transfers.size();
            #ok(transferIndex)
        } catch (e) {
            #err("Minting failed: " # Error.message(e))
        }
    };

    // Get balance for a principal
    public query func getBalance(owner: Principal) : async Nat {
        var balance : Nat = 0;
        for ((principal, amount) in tokens.vals()) {
            if (principal == owner) {
                balance += amount;
            };
        };
        balance
    };

    // Transfer tokens between principals
    public shared(msg) func transfer(from: Principal, to: Principal, amount: Nat) : async Result.Result<Nat, Text> {
        try {
            // Verify sender has enough balance
            let balance = await getBalance(from);
            if (balance < amount) {
                return #err("Insufficient balance");
            };

            // Record the transfer
            transfers := Array.append(transfers, [(from, to, amount)]);
            tokens := Array.append(tokens, [(to, amount)]);
            
            let transferIndex = transfers.size();
            #ok(transferIndex)
        } catch (e) {
            #err("Transfer failed: " # Error.message(e))
        }
    };
}
