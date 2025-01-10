from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def detect_suspicious():
    try:
        # Get the uploaded file
        uploaded_file = request.files['file']
        if not uploaded_file:
            return jsonify({"error": "No file uploaded"}), 400

        # Read the CSV file
        data = pd.read_csv(uploaded_file)

        # Ensure required columns exist
        required_columns = {'transaction_id', 'amount', 'account_id'}
        if not required_columns.issubset(data.columns):
            return jsonify({"error": "Invalid file format"}), 400

        # Detect suspicious transactions (e.g., amount > 10000)
        suspicious = data[data['amount'] > 10000]

        # Prepare chart data
        chart_data = (
            data.groupby('account_id')['amount']
            .sum()
            .reset_index()
            .to_dict(orient='records')
        )

        return jsonify({
            "suspicious_transactions": suspicious.to_dict(orient='records'),
            "chart_data": chart_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
