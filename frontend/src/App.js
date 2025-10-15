import React, { useState } from 'react';
import './App.css';
const UploadIcon = () => (
    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a2 2 0 012-2h10a2 2 0 012 2v6a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2m-1 4h14"></path></svg>
);

function ResultItem({ label, value }) {
    return (
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');

    const spinnerStyle = `
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #09f;
            animation: spin 1s ease infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setExtractedData(null);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Please select a PDF file first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setExtractedData(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/parse', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            setExtractedData(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{spinnerStyle}</style>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-800 font-sans">
                <div className="w-full max-w-2xl">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Credit Card Statement Parser</h1>
                        <p className="text-lg text-gray-600 mt-2">Upload a PDF statement to automatically extract key information.</p>
                        <p className="text-sm text-gray-500 mt-1">Supports HDFC, ICICI, SBI, Axis Bank, and American Express.</p>
                    </header>
                    
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex items-center justify-center w-full mb-6">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PDF files only</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                        </div>
                        
                        {fileName && <p className="text-center text-gray-600 mb-4">Selected: <span className="font-semibold">{fileName}</span></p>}

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-blue-300 flex items-center justify-center"
                        >
                            {isLoading ? <div className="spinner"></div> : 'Parse Statement'}
                        </button>

                        <div className="mt-8">
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
                            
                            {extractedData && !extractedData.error && (
                                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                    <h2 className="text-2xl font-semibold mb-4 text-center">Extraction Results</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <ResultItem label="Issuer" value={extractedData.issuer} />
                                        <ResultItem label="Card (Last Digits)" value={extractedData.card_number} />
                                        <ResultItem label="Payment Due Date" value={extractedData.due_date} />
                                        <ResultItem label="Total Amount Due" value={extractedData.total_due} />
                                        <ResultItem label="Statement Period" value={extractedData.statement_period} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     <footer className="text-center mt-8">
                        <p className="text-sm text-gray-500">A demonstration of full-stack PDF parsing.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default App;
