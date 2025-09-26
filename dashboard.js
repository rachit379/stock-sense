class StockDashboard {
    constructor() {
        this.trackedStocks = new Map();
        this.newsItems = [];
        this.marketIndices = [];
        this.sentimentScore = 65;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.startAutoRefresh();
        this.initializeChart();
    }

    setupEventListeners() {
        // Add stock button
        document.getElementById('addStockBtn').addEventListener('click', () => {
            const form = document.getElementById('stockForm');
            form.classList.toggle('hidden');
        });

        // Track stock button
        document.getElementById('trackStockBtn').addEventListener('click', () => {
            this.addStock();
        });

        // Enter key in stock input
        document.getElementById('stockSymbol').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addStock();
            }
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterNews(e.target.dataset.filter);
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'bg-blue-100', 'text-blue-700');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                e.target.classList.add('active', 'bg-blue-100', 'text-blue-700');
                e.target.classList.remove('bg-gray-100', 'text-gray-700');
            });
        });
    }

    addStock() {
        const symbolInput = document.getElementById('stockSymbol');
        const symbol = symbolInput.value.toUpperCase().trim();
        
        if (!symbol) {
            this.showNotification('Please enter a stock symbol', 'error');
            return;
        }

        if (this.trackedStocks.has(symbol)) {
            this.showNotification('Stock already being tracked', 'warning');
            return;
        }

        if (this.trackedStocks.size >= 5) {
            this.showNotification('Maximum 5 stocks can be tracked', 'warning');
            return;
        }

        this.showLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
            this.fetchStockData(symbol);
        }, 1000);
    }

    fetchStockData(symbol) {
        // Mock stock data - in real implementation, this would call jugaad-data API
        const mockStockData = {
            'RELIANCE': { name: 'Reliance Industries', price: 2456.78, change: 45.23, changePercent: 1.88, volume: '2.3M', pe: 24.5, marketCap: '16.7T' },
            'TCS': { name: 'Tata Consultancy Services', price: 3123.45, change: -23.67, changePercent: -0.75, volume: '1.8M', pe: 28.3, marketCap: '11.4T' },
            'HDFCBANK': { name: 'HDFC Bank', price: 1567.89, change: 12.34, changePercent: 0.79, volume: '3.1M', pe: 19.8, marketCap: '8.9T' },
            'INFY': { name: 'Infosys', price: 1456.23, change: -8.45, changePercent: -0.58, volume: '2.7M', pe: 22.1, marketCap: '6.2T' },
            'SBIN': { name: 'State Bank of India', price: 567.34, change: 15.67, changePercent: 2.84, volume: '5.2M', pe: 12.4, marketCap: '5.1T' },
            'TATAMOTORS': { name: 'Tata Motors', price: 613.35, change: 8.45, changePercent: 1.40, volume: '4.1M', pe: 15.7, marketCap: '2.1T' },
            'ICICIBANK': { name: 'ICICI Bank', price: 987.65, change: -4.32, changePercent: -0.44, volume: '2.9M', pe: 18.9, marketCap: '6.8T' },
            'KOTAKBANK': { name: 'Kotak Mahindra Bank', price: 1789.23, change: 23.45, changePercent: 1.33, volume: '1.5M', pe: 25.6, marketCap: '3.5T' },
            'HINDUNILVR': { name: 'Hindustan Unilever', price: 2345.67, change: -12.34, changePercent: -0.52, volume: '1.2M', pe: 65.3, marketCap: '5.5T' },
            'ITC': { name: 'ITC Limited', price: 456.78, change: 7.89, changePercent: 1.76, volume: '8.3M', pe: 21.4, marketCap: '5.7T' }
        };

        if (mockStockData[symbol]) {
            const stockData = {
                symbol: symbol,
                ...mockStockData[symbol],
                lastUpdated: new Date().toLocaleTimeString()
            };
            
            this.trackedStocks.set(symbol, stockData);
            this.renderStockCard(stockData);
            this.updateMarketChart();
            this.showNotification(`${symbol} added to tracking`, 'success');
            
            // Clear input
            document.getElementById('stockSymbol').value = '';
            document.getElementById('stockForm').classList.add('hidden');
        } else {
            this.showNotification(`Stock ${symbol} not found`, 'error');
        }
        
        this.showLoading(false);
    }

    renderStockCard(stock) {
        const stocksGrid = document.getElementById('stocksGrid');
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        const card = document.createElement('div');
        card.className = 'stock-card glass-card rounded-lg p-4 shadow-md';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h4 class="font-bold text-lg text-gray-900">${stock.symbol}</h4>
                    <p class="text-sm text-gray-600">${stock.name}</p>
                </div>
                <button onclick="dashboard.removeStock('${stock.symbol}')" 
                        class="text-gray-400 hover:text-red-500 transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-gray-900">₹${stock.price.toLocaleString()}</span>
                    <span class="text-sm text-gray-500">${stock.lastUpdated}</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas ${changeIcon} ${changeClass}"></i>
                    <span class="${changeClass} font-semibold">
                        ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                    <div>
                        <span class="block text-xs text-gray-500">Volume</span>
                        <span class="font-medium">${stock.volume}</span>
                    </div>
                    <div>
                        <span class="block text-xs text-gray-500">P/E Ratio</span>
                        <span class="font-medium">${stock.pe}</span>
                    </div>
                </div>
            </div>
        `;
        
        stocksGrid.appendChild(card);
    }

    removeStock(symbol) {
        this.trackedStocks.delete(symbol);
        this.renderAllStocks();
        this.updateMarketChart();
        this.showNotification(`${symbol} removed from tracking`, 'info');
    }

    renderAllStocks() {
        const stocksGrid = document.getElementById('stocksGrid');
        stocksGrid.innerHTML = '';
        this.trackedStocks.forEach(stock => {
            this.renderStockCard(stock);
        });
    }

    loadSampleData() {
        // Load some default stocks for demo
        const sampleStocks = ['RELIANCE', 'TCS', 'HDFCBANK'];
        sampleStocks.forEach((symbol, index) => {
            setTimeout(() => {
                this.fetchStockData(symbol);
            }, index * 500);
        });

        // Load sample news
        this.loadSampleNews();
        
        // Load market indices
        this.loadMarketIndices();
    }

    loadSampleNews() {
        const sampleNews = [
            {
                title: "RBI keeps repo rate unchanged at 6.5% for fifth consecutive time",
                summary: "The Monetary Policy Committee decided to maintain the status quo on policy rates.",
                sentiment: "positive",
                time: "2 hours ago",
                source: "Economic Times"
            },
            {
                title: "TCS reports 12% YoY growth in Q2 profit",
                summary: "India's largest IT services company beat analyst estimates with strong performance.",
                sentiment: "positive",
                time: "4 hours ago",
                source: "Moneycontrol"
            },
            {
                title: "Crude oil prices surge amid Middle East tensions",
                summary: "Oil prices jumped 3% following geopolitical developments in the region.",
                sentiment: "negative",
                time: "6 hours ago",
                source: "Reuters"
            },
            {
                title: "India's GDP growth expected at 6.8% for FY25",
                summary: "Economists predict steady growth momentum despite global headwinds.",
                sentiment: "positive",
                time: "8 hours ago",
                source: "Bloomberg"
            },
            {
                title: "FIIs sell ₹2,500 crore worth of Indian equities",
                summary: "Foreign institutional investors continued their selling streak for the third consecutive day.",
                sentiment: "negative",
                time: "10 hours ago",
                source: "Business Standard"
            }
        ];

        this.newsItems = sampleNews;
        this.renderNews();
    }

    loadMarketIndices() {
        const indices = [
            { name: 'NIFTY 50', value: 21349.4, change: 94.35, changePercent: 0.44 },
            { name: 'SENSEX', value: 71345.2, change: -156.78, changePercent: -0.22 },
            { name: 'BANK NIFTY', value: 45678.9, change: 234.56, changePercent: 0.52 },
            { name: 'NIFTY IT', value: 34567.8, change: -89.12, changePercent: -0.26 }
        ];

        this.marketIndices = indices;
        this.renderIndices();
    }

    renderNews(filter = 'all') {
        const newsFeed = document.getElementById('newsFeed');
        newsFeed.innerHTML = '';

        const filteredNews = filter === 'all' ? this.newsItems : 
                           this.newsItems.filter(item => item.sentiment === filter);

        filteredNews.forEach(item => {
            const newsElement = document.createElement('div');
            newsElement.className = `feed-item p-3 rounded-lg border sentiment-${item.sentiment}`;
            newsElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-sm text-gray-900 leading-tight">${item.title}</h4>
                    <span class="text-xs text-gray-500 ml-2 whitespace-nowrap">${item.time}</span>
                </div>
                <p class="text-xs text-gray-600 mb-2">${item.summary}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">${item.source}</span>
                    <div class="flex items-center space-x-1">
                        <i class="fas ${item.sentiment === 'positive' ? 'fa-arrow-up text-green-500' : 
                                     item.sentiment === 'negative' ? 'fa-arrow-down text-red-500' : 
                                     'fa-minus text-gray-500'} text-xs"></i>
                        <span class="text-xs capitalize ${item.sentiment === 'positive' ? 'text-green-600' : 
                                                           item.sentiment === 'negative' ? 'text-red-600' : 
                                                           'text-gray-600'}">${item.sentiment}</span>
                    </div>
                </div>
            `;
            newsFeed.appendChild(newsElement);
        });
    }

    renderIndices() {
        const indicesList = document.getElementById('indicesList');
        indicesList.innerHTML = '';

        this.marketIndices.forEach(index => {
            const changeClass = index.change >= 0 ? 'positive' : 'negative';
            const changeIcon = index.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            
            const indexElement = document.createElement('div');
            indexElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
            indexElement.innerHTML = `
                <div>
                    <h4 class="font-semibold text-sm text-gray-900">${index.name}</h4>
                    <p class="text-lg font-bold text-gray-900">${index.value.toLocaleString()}</p>
                </div>
                <div class="text-right">
                    <div class="flex items-center space-x-1 ${changeClass}">
                        <i class="fas ${changeIcon} text-xs"></i>
                        <span class="font-semibold">${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)}</span>
                    </div>
                    <p class="text-xs ${changeClass}">(${index.changePercent >= 0 ? '+' : ''}${index.changePercent.toFixed(2)}%)</p>
                </div>
            `;
            indicesList.appendChild(indexElement);
        });
    }

    filterNews(filter) {
        this.renderNews(filter);
    }

    initializeChart() {
        const data = [{
            x: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            y: [21255, 21345, 21289, 21367, 21323, 21378, 21349, 21349.4],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'NIFTY 50',
            line: {
                color: '#3b82f6',
                width: 3
            },
            marker: {
                color: '#3b82f6',
                size: 6
            }
        }];

        const layout = {
            title: {
                text: 'NIFTY 50 Intraday Performance',
                font: { size: 16, color: '#374151' }
            },
            xaxis: {
                title: 'Time',
                gridcolor: '#f3f4f6'
            },
            yaxis: {
                title: 'Index Value',
                gridcolor: '#f3f4f6'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 50, r: 20, b: 50, l: 60 },
            showlegend: false
        };

        Plotly.newPlot('marketChart', data, layout, { responsive: true });
    }

    updateMarketChart() {
        // Update chart with current tracked stocks data
        if (this.trackedStocks.size > 0) {
            // This would update the chart with real stock data
            console.log('Market chart updated with', this.trackedStocks.size, 'stocks');
        }
    }

    refreshData() {
        this.showLoading(true);
        
        // Simulate data refresh
        setTimeout(() => {
            // Update stock prices with random changes
            this.trackedStocks.forEach((stock, symbol) => {
                const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
                const change = stock.price * changePercent / 100;
                stock.price += change;
                stock.change = change;
                stock.changePercent = changePercent;
                stock.lastUpdated = new Date().toLocaleTimeString();
            });
            
            this.renderAllStocks();
            this.updateMarketChart();
            this.showLoading(false);
            this.showNotification('Data refreshed successfully', 'success');
        }, 1500);
    }

    startAutoRefresh() {
        // Auto refresh every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('hidden', !show);
        overlay.classList.toggle('flex', show);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full`;
        
        // Set color based on type
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        notification.classList.add(colors[type]);
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                               type === 'error' ? 'fa-exclamation-circle' : 
                               type === 'warning' ? 'fa-exclamation-triangle' : 
                               'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new StockDashboard();
});