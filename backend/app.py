from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Endpoint to handle single transaction
@app.route('/check_transaction', methods=['POST'])
def check_transaction():
    try:
        data = request.get_json()

        transaction_id = data.get("transaction_id")
        amount = data.get("amount")
        account_id = data.get("account_id")
        transaction_type = data.get("transaction_type")

        if not all([transaction_id, amount, account_id, transaction_type]):
            return jsonify({"error": "Missing data in request"}), 400

        is_suspicious = amount > 10000

        return jsonify({
            "message": "Transaction flagged as suspicious" if is_suspicious else "Transaction is safe",
            "transaction_id": transaction_id,
            "amount": amount,
            "account_id": account_id,
            "flagged": is_suspicious
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to handle CSV file upload
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    try:
        # Check if a file is uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']

        # Ensure the file is a CSV
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(file)

        # Ensure the required columns are present
        required_columns = ["transaction_id", "amount", "account_id", "transaction_type"]
        if not all(col in df.columns for col in required_columns):
            return jsonify({"error": f"CSV must contain columns: {', '.join(required_columns)}"}), 400

        # Add a new column to flag suspicious transactions
        df['flagged'] = df['amount'] > 10000

        # Convert the DataFrame to a dictionary
        result = df.to_dict(orient='records')

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
