import './App.css';
import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { useState } from 'react';
import { Principal } from '@dfinity/principal';
function App() {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(0);
  
  // Query balance for the current user
  const { data: balance, call: refetchBalance } = useQueryCall({
    functionName: 'getBalance',
  });

  // Mint tokens
  const { call: mint, loading: mintLoading, error: mintError } = useUpdateCall({
    functionName: 'mint',
    args: [recipient, amount],
    onSuccess: () => {
      setRecipient('');
      setAmount(0);
      refetchBalance();
    },
  });

  // Transfer tokens
  const { call: transfer, loading: transferLoading, error: transferError } = useUpdateCall({
    functionName: 'transfer',
    args: [transferTo, transferAmount],
    onSuccess: () => {
      setTransferTo('');
      setTransferAmount(0);
      refetchBalance();
    },
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <header className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            🪙 IC Token Management 🪙
          </h1>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Balance Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Balance</h2>
              <div className="text-4xl font-bold text-blue-600">
                {balance?.toString() ?? 'Loading...'} 
                <span className="text-xl ml-2 text-blue-400">tokens</span>
              </div>
            </div>
          </div>

          {/* Mint Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mint Tokens</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Recipient Principal ID"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => mint()}
                  disabled={mintLoading || !recipient || amount <= 0}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {mintLoading ? 'Minting...' : 'Mint Tokens'}
                </button>
              </div>
              {mintError && (
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <p className="text-red-600 font-medium">{mintError.toString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Transfer Tokens</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="To Principal ID"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  min={0}
                  max={balance ?? 0}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => transfer()}
                  disabled={transferLoading || !transferTo || transferAmount <= 0 || (balance && transferAmount > Number(balance))}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {transferLoading ? 'Transferring...' : 'Transfer Tokens'}
                </button>
              </div>
              {transferError && (
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <p className="text-red-600 font-medium">{transferError.toString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;