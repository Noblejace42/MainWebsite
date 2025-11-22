import { mean, std, sum } from 'mathjs';

// Fetch real data from Yahoo Finance via Proxy
export const getStockData = async (ticker) => {
    try {
        // Use allorigins as a CORS proxy
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1d`)}`);

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const result = data.chart.result[0];

        if (!result) throw new Error('No data found');

        const adjClose = result.indicators.adjclose[0].adjclose;

        // Calculate daily returns
        const returns = [];
        for (let i = 1; i < adjClose.length; i++) {
            if (adjClose[i] && adjClose[i - 1]) {
                returns.push((adjClose[i] - adjClose[i - 1]) / adjClose[i - 1]);
            }
        }

        return {
            ticker,
            returns,
            meanReturn: mean(returns) * 252, // Annualized
            volatility: std(returns) * Math.sqrt(252), // Annualized
        };
    } catch (error) {
        console.warn(`Failed to fetch real data for ${ticker}, falling back to mock.`, error);
        return getMockStockData(ticker);
    }
};

// Fallback mock data generator
const getMockStockData = (ticker) => {
    // Deterministic pseudo-random data based on ticker string
    const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const returns = Array.from({ length: 252 }, (_, i) => {
        const noise = Math.sin(i * 0.1 + seed) * 0.02 + (Math.random() - 0.5) * 0.01;
        return 0.0005 + noise; // Slight positive drift
    });
    return {
        ticker,
        returns,
        meanReturn: mean(returns) * 252, // Annualized
        volatility: std(returns) * Math.sqrt(252), // Annualized
    };
};

export const calculatePortfolioStats = (stocks, weights) => {
    if (!stocks.length || !weights.length) return { return: 0, volatility: 0, sharpe: 0, omega: 0 };

    // Portfolio Return = Sum(Weight_i * Return_i)
    const portfolioReturn = stocks.reduce((acc, stock, i) => acc + stock.meanReturn * (weights[i] / 100), 0);

    // Portfolio Volatility (simplified assuming 0 correlation for mock data, or we can simulate it)
    // For better realism with mock data, let's assume some correlation or just use weighted volatility for simplicity in this MVP
    // A more accurate way without a correlation matrix is hard, but let's assume 0.5 correlation average
    // Var_p = Sum(w_i^2 * sigma_i^2) + Sum(w_i * w_j * sigma_i * sigma_j * rho_ij)

    let variance = 0;
    for (let i = 0; i < stocks.length; i++) {
        for (let j = 0; j < stocks.length; j++) {
            const w_i = weights[i] / 100;
            const w_j = weights[j] / 100;
            const sigma_i = stocks[i].volatility;
            const sigma_j = stocks[j].volatility;
            const rho = i === j ? 1 : 0.3; // Assume 0.3 correlation between different stocks
            variance += w_i * w_j * sigma_i * sigma_j * rho;
        }
    }
    const portfolioVolatility = Math.sqrt(variance);

    const riskFreeRate = 0.02;
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioVolatility;

    // Omega Ratio (simplified: probability of gain / probability of loss relative to threshold)
    // We need the distribution of returns. Let's simulate portfolio daily returns.
    const simDays = 252;
    const portfolioDailyReturns = Array.from({ length: simDays }, (_, day) => {
        return stocks.reduce((acc, stock, i) => {
            return acc + stock.returns[day] * (weights[i] / 100);
        }, 0);
    });

    const threshold = 0; // 0% return threshold
    const gains = portfolioDailyReturns.filter(r => r > threshold).reduce((acc, r) => acc + (r - threshold), 0);
    const losses = portfolioDailyReturns.filter(r => r < threshold).reduce((acc, r) => acc + (threshold - r), 0);

    const omegaRatio = losses === 0 ? 100 : gains / losses;

    return {
        return: portfolioReturn,
        volatility: portfolioVolatility,
        sharpe: sharpeRatio,
        omega: omegaRatio,
    };
};

export const optimizePortfolio = (stocks) => {
    // Monte Carlo Simulation
    const simulations = 1000;
    let bestSharpe = -Infinity;
    let bestWeights = [];
    const points = [];

    for (let i = 0; i < simulations; i++) {
        // Generate random weights that sum to 100
        let randomWeights = stocks.map(() => Math.random());
        const total = sum(randomWeights);
        randomWeights = randomWeights.map(w => (w / total) * 100);

        const stats = calculatePortfolioStats(stocks, randomWeights);

        points.push({
            x: stats.volatility,
            y: stats.return,
            sharpe: stats.sharpe,
        });

        if (stats.sharpe > bestSharpe) {
            bestSharpe = stats.sharpe;
            bestWeights = randomWeights;
        }
    }

    return {
        bestWeights,
        bestStats: calculatePortfolioStats(stocks, bestWeights),
        points,
    };
};
