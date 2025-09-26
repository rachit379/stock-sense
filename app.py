"""
StockSense Dashboard Backend API
Integrates with jugaad-data for real-time Indian stock market data
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date
import json
import os

# Try to import jugaad-data libraries
try:
    from jugaad_data.nse import NSELive, stock_df
    from jugaad_data.nse import market_status, market_turnover
    JUGAAD_AVAILABLE = True
except ImportError:
    JUGAAD_AVAILABLE = False
    print("Warning: jugaad-data not available. Using mock data.")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class StockDataService:
    def __init__(self):
        self.nse_live = NSELive() if JUGAAD_AVAILABLE else None
        self.mock_stocks = {
            'RELIANCE': {
                'name': 'Reliance Industries Limited',
                'price': 2456.78,
                'change': 45.23,
                'changePercent': 1.88,
                'volume': '2.3M',
                'pe': 24.5,
                'marketCap': '16.7T'
            },
            'TCS': {
                'name': 'Tata Consultancy Services Limited',
                'price': 3123.45,
                'change': -23.67,
                'changePercent': -0.75,
                'volume': '1.8M',
                'pe': 28.3,
                'marketCap': '11.4T'
            },
            'HDFCBANK': {
                'name': 'HDFC Bank Limited',
                'price': 1567.89,
                'change': 12.34,
                'changePercent': 0.79,
                'volume': '3.1M',
                'pe': 19.8,
                'marketCap': '8.9T'
            },
            'INFY': {
                'name': 'Infosys Limited',
                'price': 1456.23,
                'change': -8.45,
                'changePercent': -0.58,
                'volume': '2.7M',
                'pe': 22.1,
                'marketCap': '6.2T'
            },
            'SBIN': {
                'name': 'State Bank of India',
                'price': 567.34,
                'change': 15.67,
                'changePercent': 2.84,
                'volume': '5.2M',
                'pe': 12.4,
                'marketCap': '5.1T'
            },
            'TATAMOTORS': {
                'name': 'Tata Motors Limited',
                'price': 613.35,
                'change': 8.45,
                'changePercent': 1.40,
                'volume': '4.1M',
                'pe': 15.7,
                'marketCap': '2.1T'
            },
            'ICICIBANK': {
                'name': 'ICICI Bank Limited',
                'price': 987.65,
                'change': -4.32,
                'changePercent': -0.44,
                'volume': '2.9M',
                'pe': 18.9,
                'marketCap': '6.8T'
            },
            'KOTAKBANK': {
                'name': 'Kotak Mahindra Bank Limited',
                'price': 1789.23,
                'change': 23.45,
                'changePercent': 1.33,
                'volume': '1.5M',
                'pe': 25.6,
                'marketCap': '3.5T'
            },
            'HINDUNILVR': {
                'name': 'Hindustan Unilever Limited',
                'price': 2345.67,
                'change': -12.34,
                'changePercent': -0.52,
                'volume': '1.2M',
                'pe': 65.3,
                'marketCap': '5.5T'
            },
            'ITC': {
                'name': 'ITC Limited',
                'price': 456.78,
                'change': 7.89,
                'changePercent': 1.76,
                'volume': '8.3M',
                'pe': 21.4,
                'marketCap': '5.7T'
            }
        }

    def get_stock_quote(self, symbol):
        """Get real-time stock quote"""
        if self.nse_live and JUGAAD_AVAILABLE:
            try:
                quote = self.nse_live.stock_quote(symbol)
                price_info = quote.get('priceInfo', {})
                
                return {
                    'symbol': symbol,
                    'name': quote.get('info', {}).get('companyName', symbol),
                    'price': price_info.get('lastPrice', 0),
                    'change': price_info.get('change', 0),
                    'changePercent': price_info.get('pChange', 0),
                    'volume': price_info.get('totalTradedVolume', 0),
                    'open': price_info.get('open', 0),
                    'high': price_info.get('intraDayHighLow', {}).get('max', 0),
                    'low': price_info.get('intraDayHighLow', {}).get('min', 0),
                    'previousClose': price_info.get('previousClose', 0),
                    'vwap': price_info.get('vwap', 0),
                    'lastUpdated': datetime.now().isoformat()
                }
            except Exception as e:
                print(f"Error fetching real data for {symbol}: {e}")
                return self.get_mock_stock_data(symbol)
        else:
            return self.get_mock_stock_data(symbol)

    def get_mock_stock_data(self, symbol):
        """Get mock stock data for demo purposes"""
        if symbol in self.mock_stocks:
            data = self.mock_stocks[symbol].copy()
            # Add some random variation to make it look live
            variation = (np.random.random() - 0.5) * 0.02  # ±1% variation
            data['price'] = round(data['price'] * (1 + variation), 2)
            data['change'] = round(data['change'] * (1 + variation), 2)
            data['changePercent'] = round(data['changePercent'] * (1 + variation), 2)
            data['symbol'] = symbol
            data['lastUpdated'] = datetime.now().isoformat()
            return data
        else:
            # Generate random data for unknown symbols
            base_price = np.random.randint(100, 5000)
            change = (np.random.random() - 0.5) * base_price * 0.05  # ±5% change
            return {
                'symbol': symbol,
                'name': f'{symbol} Limited',
                'price': round(base_price, 2),
                'change': round(change, 2),
                'changePercent': round((change / base_price) * 100, 2),
                'volume': f'{np.random.randint(1, 10)}M',
                'pe': round(np.random.uniform(10, 50), 1),
                'marketCap': f'{np.random.randint(1, 20)}T',
                'lastUpdated': datetime.now().isoformat()
            }

    def get_market_status(self):
        """Get current market status"""
        if self.nse_live and JUGAAD_AVAILABLE:
            try:
                status = self.nse_live.market_status()
                return status
            except Exception as e:
                print(f"Error fetching market status: {e}")
                return self.get_mock_market_status()
        else:
            return self.get_mock_market_status()

    def get_mock_market_status(self):
        """Mock market status"""
        current_time = datetime.now()
        market_open = current_time.hour >= 9 and current_time.hour < 16
        
        return {
            'marketState': [
                {
                    'market': 'Capital Market',
                    'marketStatus': 'Open' if market_open else 'Close',
                    'tradeDate': current_time.strftime('%d-%b-%Y %H:%M'),
                    'index': 'NIFTY 50',
                    'last': 21349.4,
                    'variation': 94.35,
                    'percentChange': 0.44,
                    'marketStatusMessage': 'Market is Open' if market_open else 'Market is Closed'
                }
            ]
        }

# Initialize the stock service
stock_service = StockDataService()

@app.route('/')
def index():
    return jsonify({
        'message': 'StockSense Dashboard API',
        'version': '1.0.0',
        'status': 'active',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/stock/<symbol>')
def get_stock(symbol):
    """Get stock quote for a symbol"""
    try:
        data = stock_service.get_stock_quote(symbol.upper())
        return jsonify(data)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'symbol': symbol
        }), 500

@app.route('/api/stocks', methods=['POST'])
def get_multiple_stocks():
    """Get quotes for multiple stocks"""
    try:
        symbols = request.json.get('symbols', [])
        if not symbols:
            return jsonify({'error': 'No symbols provided'}), 400
        
        results = {}
        for symbol in symbols:
            results[symbol] = stock_service.get_stock_quote(symbol.upper())
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/market-status')
def market_status():
    """Get market status"""
    try:
        status = stock_service.get_market_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/news')
def get_news():
    """Get financial news with sentiment analysis"""
    # Mock news data - in production, this would fetch from RSS feeds
    news_items = [
        {
            'title': 'RBI keeps repo rate unchanged at 6.5% for fifth consecutive time',
            'summary': 'The Monetary Policy Committee decided to maintain the status quo on policy rates.',
            'sentiment': 'positive',
            'time': '2 hours ago',
            'source': 'Economic Times',
            'category': 'economy'
        },
        {
            'title': 'TCS reports 12% YoY growth in Q2 profit',
            'summary': 'India\'s largest IT services company beat analyst estimates with strong performance.',
            'sentiment': 'positive',
            'time': '4 hours ago',
            'source': 'Moneycontrol',
            'category': 'earnings'
        },
        {
            'title': 'Crude oil prices surge amid Middle East tensions',
            'summary': 'Oil prices jumped 3% following geopolitical developments in the region.',
            'sentiment': 'negative',
            'time': '6 hours ago',
            'source': 'Reuters',
            'category': 'commodities'
        },
        {
            'title': 'India\'s GDP growth expected at 6.8% for FY25',
            'summary': 'Economists predict steady growth momentum despite global headwinds.',
            'sentiment': 'positive',
            'time': '8 hours ago',
            'source': 'Bloomberg',
            'category': 'economy'
        },
        {
            'title': 'FIIs sell ₹2,500 crore worth of Indian equities',
            'summary': 'Foreign institutional investors continued their selling streak for the third consecutive day.',
            'sentiment': 'negative',
            'time': '10 hours ago',
            'source': 'Business Standard',
            'category': 'markets'
        }
    ]
    
    return jsonify({'news': news_items})

@app.route('/api/indices')
def get_indices():
    """Get major market indices"""
    indices = [
        {
            'name': 'NIFTY 50',
            'value': 21349.4,
            'change': 94.35,
            'changePercent': 0.44
        },
        {
            'name': 'SENSEX',
            'value': 71345.2,
            'change': -156.78,
            'changePercent': -0.22
        },
        {
            'name': 'BANK NIFTY',
            'value': 45678.9,
            'change': 234.56,
            'changePercent': 0.52
        },
        {
            'name': 'NIFTY IT',
            'value': 34567.8,
            'change': -89.12,
            'changePercent': -0.26
        }
    ]
    
    return jsonify({'indices': indices})

@app.route('/api/sentiment')
def get_sentiment():
    """Get market sentiment analysis"""
    sentiment_score = 65  # Mock sentiment score
    sentiment_label = 'Bullish' if sentiment_score > 60 else 'Bearish' if sentiment_score < 40 else 'Neutral'
    
    return jsonify({
        'score': sentiment_score,
        'label': sentiment_label,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)