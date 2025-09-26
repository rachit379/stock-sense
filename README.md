# StockSense Dashboard

A real-time Indian stock market dashboard with sentiment analysis and RSS feed integration.

## Features

- **Real-time Stock Tracking**: Monitor up to 5 Indian stocks with live price updates
- **Market Sentiment Analysis**: AI-powered sentiment analysis of financial news
- **RSS News Feed**: Curated financial news from multiple sources
- **Interactive Charts**: Plotly.js powered market visualization
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Auto-refresh**: Data updates every 30 seconds

## Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Charts**: Plotly.js for interactive visualizations
- **Icons**: Font Awesome
- **Data Source**: jugaad-data API for Indian stock market data

## Getting Started

### Prerequisites

- Python 3.7+
- jugaad-data library
- Modern web browser

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/stocksense-dashboard.git
cd stocksense-dashboard
```

2. Install jugaad-data for backend data fetching:
```bash
pip install jugaad-data pandas
```

3. Open `index.html` in your browser or serve via HTTP server:
```bash
python -m http.server 8000
```

4. Navigate to `http://localhost:8000`

## Usage

### Adding Stocks to Track

1. Click the "Add Stock" button
2. Enter an NSE stock symbol (e.g., RELIANCE, TCS, HDFCBANK)
3. Click "Track" to add the stock to your dashboard

### Supported Stock Symbols

Popular NSE symbols you can track:
- **RELIANCE** - Reliance Industries
- **TCS** - Tata Consultancy Services
- **HDFCBANK** - HDFC Bank
- **INFY** - Infosys
- **SBIN** - State Bank of India
- **TATAMOTORS** - Tata Motors
- **ICICIBANK** - ICICI Bank
- **KOTAKBANK** - Kotak Mahindra Bank
- **HINDUNILVR** - Hindustan Unilever
- **ITC** - ITC Limited

### News Feed Features

- **All News**: View all financial news items
- **Positive Filter**: Show only positive sentiment news
- **Negative Filter**: Show only negative sentiment news
- **Real-time Updates**: News feed refreshes automatically

### Market Data

- **Live Prices**: Real-time stock prices from NSE
- **Price Changes**: Intraday and daily price movements
- **Volume Data**: Trading volume information
- **P/E Ratios**: Price-to-earnings ratios
- **Market Capitalization**: Company market cap values

## API Integration

This dashboard is designed to work with the jugaad-data Python library for fetching real-time Indian stock market data. To enable full functionality:

1. Install the required Python dependencies:
```bash
pip install jugaad-data pandas flask
```

2. Run the backend API server (when available):
```bash
python app.py
```

3. The dashboard will automatically connect to the API for live data

## GitHub Pages Deployment

This dashboard is optimized for GitHub Pages deployment:

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

Your dashboard will be available at `https://yourusername.github.io/stocksense-dashboard`

## Customization

### Styling

The dashboard uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying the CSS classes in `index.html`
- Updating the color scheme in the `<style>` section
- Adding custom CSS rules

### Adding New Features

To extend the dashboard functionality:
- Modify `dashboard.js` to add new interactive features
- Update the HTML structure in `index.html`
- Add new API endpoints in the backend integration

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This dashboard is for educational and informational purposes only. Stock market investments are subject to market risks. Please consult with a qualified financial advisor before making investment decisions.

## Support

For issues and feature requests, please open a GitHub issue or contact the maintainers.

---

**Built with ❤️ for the Indian stock market community**