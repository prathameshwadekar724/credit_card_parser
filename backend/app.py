import io
import re
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf2image import convert_from_bytes
import pytesseract

app = Flask(__name__)
CORS(app)

PATTERNS = {
    'hdfc': {
        'issuer': 'HDFC Bank',
        'card_number': r'Card Number\s*:\s*XXXX XXXX XXXX (\d{4})',
        'due_date': r'Payment Due Date\s*:\s*(\d{2}/\d{2}/\d{4})',
        'total_due': r'Total Amount Due\s*[|:\s]*([\d,]+\.\d{2})',
        'statement_period': r'Statement Period\s*:\s*(\d{2}/\d{2}/\d{4} to \d{2}/\d{2}/\d{4})'
    },
    'icici': {
        'issuer': 'ICICI Bank',
        'card_number': r'Card No\.\s*:\s*XXXX XXXX XXXX (\d{4})',
        'due_date': r'Due Date\s*:\s*(\d{2}-\w{3}-\d{4})',
        'total_due': r'Total Amount Due\s*[:\s]*([\d,]+\.\d{2})',
        'statement_period': r'Statement Date\s*:\s*(\d{2}-\w{3}-\d{4})'
    },
    'sbi': {
        'issuer': 'SBI Card',
        'card_number': r'CARD NO\.\s*:\s*XXXX XXXX XXXX (\d{4})',
        'due_date': r'Payment Due Date\s*(\d{2} \w{3} \d{2})',
        'total_due': r'Total Amount Due\s*Cr\s*([\d,]+\.\d{2})',
        'statement_period': r'Statement Date\s*(\d{2} \w{3} \d{2})'
    },
    'axis': {
        'issuer': 'Axis Bank',
        'card_number': r'Card Number\s*XXXX XXXX XXXX (\d{4})',
        'due_date': r'Payment Due Date\s*:\s*(\d{2}-\w{3}-\d{4})',
        'total_due': r'Total Amount Due\s*[:\s]*Rs\.\s*([\d,]+\.\d{2})',
        'statement_period': r'Statement Date\s*:\s*(\d{2}-\w{3}-\d{4})'
    },
    'amex': {
        'issuer': 'American Express',
        'card_number': r'Cardmember\s*:.*\s*(\d{5})',
        'due_date': r'Please Pay By\s*:\s*(\w+\s\d{1,2},\s\d{4})',
        'total_due': r'New Balance\s*[:\s]*\$?([\d,]+\.\d{2})',
        'statement_period': r'Statement date\s*:\s*(\w+\s\d{1,2},\s\d{4})'
    }
}

def extract_text_from_pdf(pdf_file):
    """Extracts text using pdfplumber (for text-based PDFs)."""
    text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None
    return text.strip()

def extract_text_with_ocr(pdf_bytes):
    """Extracts text from image-based PDFs using OCR."""
    try:
        pages = convert_from_bytes(pdf_bytes)
        text = ""
        for i, page in enumerate(pages):
            page_text = pytesseract.image_to_string(page)
            text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"OCR extraction failed: {e}")
        return None

def parse_statement(text):
    """Identifies the bank and extracts data using regex patterns."""
    detected_bank = None
    for bank, patterns in PATTERNS.items():
        if re.search(patterns['issuer'], text, re.IGNORECASE):
            detected_bank = bank
            break

    if not detected_bank:
        return {'error': 'Could not determine the credit card issuer. This bank is not supported.'}

    extracted_data = {'issuer': PATTERNS[detected_bank]['issuer']}
    patterns_to_use = PATTERNS[detected_bank]
    
    for key, pattern in patterns_to_use.items():
        if key == 'issuer':
            continue
        match = re.search(pattern, text, re.IGNORECASE)
        extracted_data[key] = match.group(1).strip() if match else 'Not Found'
            
    return extracted_data

@app.route('/parse', methods=['POST'])
def parse_pdf_endpoint():
    """Handles PDF uploads and returns extracted data."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a PDF.'}), 400

    try:
        pdf_bytes = file.read()
        pdf_stream = io.BytesIO(pdf_bytes)
        
        text = extract_text_from_pdf(pdf_stream)
        
        if not text:
            text = extract_text_with_ocr(pdf_bytes)
        
        if not text:
            return jsonify({'error': 'Could not extract text from the PDF using OCR. File may be corrupted.'}), 500

        data = parse_statement(text)
        return jsonify(data)
    
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
