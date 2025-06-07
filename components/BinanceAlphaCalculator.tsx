import React, { useState, useEffect } from 'react';
import { Calculator, Trophy, TrendingUp, Calendar } from 'lucide-react';

const BinanceAlphaCalculator = () => {
  const [threshold, setThreshold] = useState(210);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [dailyTradeAmount, setDailyTradeAmount] = useState(8192);
  const [airdropAmount, setAirdropAmount] = useState(80);
  
  // 生成交易金额选项（1024到262144，按倍数递增）
  const tradeAmountOptions: number[] = [];
  for (let amount = 1024; amount <= 262144; amount *= 2) {
    tradeAmountOptions.push(amount);
  }
  
  // 获取当前日期并格式化为MM-DD
  const formatDate = (dayOffset: number) => {
    const today = new Date();
    const targetDate = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };
  const [tradeLoss, setTradeLoss] = useState(0.01);
  const [pastDays, setPastDays] = useState([
    { points: 17, consumed: 0 },
    { points: 19, consumed: 0 },
    { points: 18, consumed: 0 },
    { points: 18, consumed: 0 },
    { points: 18, consumed: 0 },
    { points: 18, consumed: 0 },
    { points: 18, consumed: 15 },
    { points: 18, consumed: 15 },
    { points: 18, consumed: 15 },
    { points: 18, consumed: 15 },
    { points: 18, consumed: 0 },
    { points: 19, consumed: 0 },
    { points: 20, consumed: 0 },
    { points: 20, consumed: 0 },
    { points: 20, consumed: 15 }
  ]);
  const [pastDaysText, setPastDaysText] = useState("17 19 18 18 18 18 18(-15) 18(-15) 18(-15) 18(-15) 18 19 20 20 20(-15)");
  const [results, setResults] = useState<any>(null);
  const [futureAirdrops, setFutureAirdrops] = useState(Array(30).fill(false));

  // 计算资产积分
  const calculateBalancePoints = (balance: number) => {
    if (balance >= 10000) return 3;
    if (balance >= 1000) return 2;
    return 0;
  };

  // 计算交易积分
  const calculateTradePoints = (amount: number) => {
    if (amount === 0) return 0;
    let points = 0;
    let currentThreshold = 2;
    let currentPoints = 1;
    
    while (amount >= currentThreshold) {
      points = currentPoints;
      currentThreshold *= 2;
      currentPoints++;
    }
    
    return points;
  };

  // 计算BSC链交易积分（翻倍）
  const calculateBSCTradePoints = (amount: number) => {
    return calculateTradePoints(amount * 2);
  };

  // 计算过去15天积分总和
  const calculateLast15DaysPoints = (dayIndex: number, futurePoints: number[], consumedPoints: number[]) => {
    let total = 0;
    for (let i = 0; i < 15; i++) {
      const actualDayIndex = dayIndex - 14 + i;
      if (actualDayIndex < 0) {
        // 使用历史数据
        const historyIndex = 15 + actualDayIndex;
        if (historyIndex >= 0 && historyIndex < pastDays.length) {
          total += pastDays[historyIndex].points - pastDays[historyIndex].consumed;
        }
      } else {
        // 使用未来数据
        total += futurePoints[actualDayIndex] - consumedPoints[actualDayIndex];
      }
    }
    return Math.max(0, total);
  };

  const handlePastDayChange = (index: number, field: string, value: string) => {
    const newPastDays = [...pastDays];
    newPastDays[index] = { ...newPastDays[index], [field]: parseInt(value) || 0 };
    setPastDays(newPastDays);
    
    // 同步更新文本格式
    updatePastDaysText(newPastDays);
  };

  // 解析文本格式的积分数据
  const parsePastDaysText = (text: string) => {
    const parts = text.trim().split(/\s+/);
    const newPastDays: Array<{points: number, consumed: number}> = [];
    
    for (let i = 0; i < 15; i++) {
      if (i < parts.length) {
        const part = parts[i];
        const match = part.match(/^(\d+)(?:\((-?\d+)\))?$/);
        if (match) {
          const points = parseInt(match[1]) || 0;
          const consumed = match[2] ? Math.abs(parseInt(match[2])) : 0;
          newPastDays.push({ points, consumed });
        } else {
          newPastDays.push({ points: 0, consumed: 0 });
        }
      } else {
        newPastDays.push({ points: 0, consumed: 0 });
      }
    }
    
    return newPastDays;
  };

  // 将积分数据转换为文本格式
  const updatePastDaysText = (daysData: Array<{points: number, consumed: number}>) => {
    const textParts = daysData.map(day => {
      if (day.consumed > 0) {
        return `${day.points}(-${day.consumed})`;
      } else {
        return `${day.points}`;
      }
    });
    setPastDaysText(textParts.join(' '));
  };

  // 处理文本输入变化
  const handlePastDaysTextChange = (text: string) => {
    setPastDaysText(text);
    const newPastDays = parsePastDaysText(text);
    setPastDays(newPastDays);
  };

  const toggleAirdrop = (dayIndex: number) => {
    const newAirdrops = [...futureAirdrops];
    newAirdrops[dayIndex] = !newAirdrops[dayIndex];
    setFutureAirdrops(newAirdrops);
    
    // 立即重新计算结果
    setTimeout(() => {
      calculateResultsWithAirdrops(newAirdrops);
    }, 0);
  };

  const calculateResults = () => {
    // 重置结果和空投选择
    setResults(null);
    setFutureAirdrops(Array(30).fill(false));
    
    // 延迟一下再计算，确保UI先更新
    setTimeout(() => {
      calculateResultsWithAirdrops(Array(30).fill(false));
    }, 50);
  };

  const calculateResultsWithAirdrops = (airdrops: boolean[]) => {
    const balancePoints = calculateBalancePoints(currentBalance);
    const tradePoints = calculateBSCTradePoints(dailyTradeAmount);
    const dailyPoints = balancePoints + tradePoints;
    
    // 计算未来30天的积分情况
    const futurePoints = Array(30).fill(dailyPoints);
    const consumedPoints = Array(30).fill(0);
    const availablePoints = Array(30).fill(0);
    const canParticipate = Array(30).fill(false);
    
    // 处理空投选择和积分消耗
    for (let day = 0; day < 30; day++) {
      if (airdrops[day]) {
        // 如果选择参与空投，第二天扣除15积分
        if (day + 1 < 30) {
          consumedPoints[day + 1] += 15;
        }
      }
    }
    
    // 计算每天的可用积分和是否能参与空投
    for (let day = 0; day < 30; day++) {
      availablePoints[day] = calculateLast15DaysPoints(day, futurePoints, consumedPoints);
      canParticipate[day] = availablePoints[day] >= threshold;
      
      // 如果当天已选择空投但积分不足，自动取消选择
      if (airdrops[day] && !canParticipate[day]) {
        const newAirdrops = [...airdrops];
        newAirdrops[day] = false;
        setFutureAirdrops(newAirdrops);
        airdrops = newAirdrops;
        // 重新计算消耗积分
        for (let i = 0; i < 30; i++) {
          consumedPoints[i] = 0;
        }
        for (let i = 0; i < 30; i++) {
          if (airdrops[i] && i + 1 < 30) {
            consumedPoints[i + 1] += 15;
          }
        }
        availablePoints[day] = calculateLast15DaysPoints(day, futurePoints, consumedPoints);
        canParticipate[day] = availablePoints[day] >= threshold;
      }
    }
    
    // 计算总参与次数
    const totalParticipations = airdrops.filter(Boolean).length;
    
    // 计算空投总收入
    const totalAirdropIncome = totalParticipations * airdropAmount;
    
    // 计算交易总磨损 (万分之一 = 0.01%)
    const dailyTradingLoss = dailyTradeAmount * (tradeLoss / 100);
    const totalTradingLoss = dailyTradingLoss * 30;
    
    // 计算净收益
    const netProfit = totalAirdropIncome - totalTradingLoss;
    
    // 计算余额变化（考虑交易磨损）
    const balanceAfter30Days = currentBalance - totalTradingLoss + totalAirdropIncome;
    
    setResults({
      dailyPoints,
      balancePoints,
      tradePoints,
      futurePoints,
      consumedPoints,
      availablePoints,
      canParticipate,
      totalParticipations,
      totalAirdropIncome,
      totalTradingLoss,
      netProfit,
      balanceAfter30Days
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-yellow-500 p-3 rounded-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">币安Alpha积分计算工具</h1>
            <p className="text-gray-600 mt-1">计算未来30天空投参与机会</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                基础设置
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动积分门槛
                  </label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 210)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="默认210分"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前资产余额 (USD)
                  </label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    每日交易金额 (USD)
                  </label>
                  <select
                    value={dailyTradeAmount}
                    onChange={(e) => setDailyTradeAmount(parseInt(e.target.value) || 8192)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {tradeAmountOptions.map(amount => (
                      <option key={amount} value={amount}>
                        ${amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    交易磨损 (%)
                  </label>
                  <input
                    type="number"
                    value={tradeLoss}
                    onChange={(e) => setTradeLoss(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    step="0.01"
                    placeholder="默认0.01%"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    空投金额 (USD)
                  </label>
                  <input
                    type="number"
                    value={airdropAmount}
                    onChange={(e) => setAirdropAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    step="1"
                    placeholder="默认80美金"
                  />
                </div>
              </div>
            </div>

            {/* 过去15天数据输入 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                过去15天积分记录
              </h3>
              
              {/* 文本输入框 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  快速输入格式：积分 积分(-消耗) ...
                </label>
                <textarea
                  value={pastDaysText}
                  onChange={(e) => handlePastDaysTextChange(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  rows={2}
                  placeholder="例：17 19 18 18 18 18 18(-15) 18(-15) 18(-15) 18(-15) 18 19 20 20 20(-15)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  格式说明：积分数字，消耗积分用括号表示，如 18(-15) 表示获得18积分消耗15积分
                </p>
              </div>

              {/* 详细列表 */}
              <div className="border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200 border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-1.5 text-left text-xs font-medium text-gray-700 border-b border-gray-200">日期</th>
                      <th scope="col" className="px-3 py-1.5 text-left text-xs font-medium text-gray-700 border-b border-gray-200">获得积分</th>
                      <th scope="col" className="px-3 py-1.5 text-left text-xs font-medium text-gray-700 border-b border-gray-200">消耗积分</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastDays.map((day, index) => {
                      const pastDate = formatDate(index - 15);
                      return (
                        <tr key={index}>
                          <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-600">{pastDate}</td>
                          <td className="px-1 py-1">
                            <input
                              type="number"
                              value={day.points}
                              onChange={(e) => handlePastDayChange(index, 'points', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              min="0"
                            />
                          </td>
                          <td className="px-1 py-1">
                            <input
                              type="number"
                              value={day.consumed}
                              onChange={(e) => handlePastDayChange(index, 'consumed', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              min="0"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 计算按钮和结果区域 */}
          <div className="space-y-6 lg:col-span-1">
            <button
              onClick={calculateResults}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
            >
              <Calculator className="w-5 h-5 inline mr-2" />
              计算积分预测
            </button>

            {results && (
              <div className="space-y-5">
                {/* 积分概览 */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    积分概览
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.dailyPoints}</div>
                        <div className="text-xs text-gray-600">每日积分</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{results.totalParticipations}</div>
                        <div className="text-xs text-gray-600">可参与次数</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 flex flex-col">
                      <div>资产积分: <span className="font-medium">{results.balancePoints}分/天</span></div>
                      <div>交易积分: <span className="font-medium">{results.tradePoints}分/天</span> (BSC链翻倍)</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">${results.totalAirdropIncome.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">总空投收入</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-lg font-bold text-red-600">-${results.totalTradingLoss.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">总交易磨损</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${results.netProfit >= 0 ? '+' : ''}{results.netProfit.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">净收益</div>
                    </div>
                  </div>
                </div>

                {/* 未来30天详情 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    未来30天积分详情
                  </h3>
                  <div>
                    <table className="w-full min-w-full divide-y divide-gray-200 border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">日期</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">获得积分</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">可用积分</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">能否参与</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">空投操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: 30 }, (_, index) => {
                          const isSelected = futureAirdrops[index];
                          const canParticipate = results.canParticipate[index];
                          const willConsumeNext = isSelected && index < 29;
                          const futureDate = formatDate(index + 1);
                          
                          return (
                            <tr key={index} className={`${
                              isSelected ? 'bg-yellow-50' : 'hover:bg-gray-50'
                            }`}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{futureDate}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600">+{results.dailyPoints}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-bold">
                                {results.availablePoints[index]}
                                {willConsumeNext && (
                                  <span className="text-red-500 text-xs ml-1">(次日-15)</span>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  canParticipate 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {canParticipate ? '✓ 可参与' : '✗ 不足'}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => toggleAirdrop(index)}
                                  disabled={!canParticipate && !isSelected}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 min-w-16 ${
                                    isSelected
                                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                      : canParticipate
                                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  {isSelected ? '取消' : '参与'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceAlphaCalculator; 