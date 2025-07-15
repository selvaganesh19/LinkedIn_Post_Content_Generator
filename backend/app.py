from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
import os
import traceback
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Azure OpenAI Configuration - Initialize after app creation
def get_openai_client():
    try:
        api_key = os.getenv('AZURE_OPENAI_API_KEY')
        api_version = os.getenv('AZURE_OPENAI_API_VERSION')
        azure_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT')
        
        print(f"API Key exists: {bool(api_key)}")
        print(f"API Version: {api_version}")
        print(f"Azure Endpoint: {azure_endpoint}")
        
        return AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=azure_endpoint,
        )
    except Exception as e:
        print(f"Failed to initialize OpenAI client: {e}")
        traceback.print_exc()
        return None

@app.route('/')
def index():
    return jsonify({"message": "LinkedIn Post Generator API", "status": "running"})

@app.route('/generate', methods=['POST'])
def generate_post():
    try:
        print("Starting generate_post...")
        
        client = get_openai_client()
        if not client:
            print("Client initialization failed")
            return jsonify({'error': 'OpenAI client initialization failed'}), 500
        
        print("Client initialized successfully")
        
        data = request.get_json(force=True)
        print(f"Received data: {data}")

        topic = data.get('topic')
        tone = data.get('tone', 'Professional')

        if not topic:
            return jsonify({'error': 'Topic is required'}), 400

        print(f"Generating post for topic: {topic}, tone: {tone}")

        prompt = f"Write a {tone.lower()} LinkedIn post about: {topic}"

        messages = [
            {"role": "system", "content": "You are a professional LinkedIn post writer."},
            {"role": "user", "content": prompt}
        ]

        print("Calling OpenAI API...")
        
        deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT')
        print(f"Using deployment: {deployment}")
        
        response = client.chat.completions.create(
            model=deployment,
            messages=messages,
            max_tokens=500,  # Reduced for testing
            temperature=0.7,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        post_content = response.choices[0].message.content
        print("Generated post successfully")
        return jsonify({'post': post_content})

    except Exception as e:
        print(f"[ERROR] Exception in /generate: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


if __name__ == '__main__':
    print("Starting Flask app...")
    print(f"Environment variables loaded:")
    print(f"AZURE_OPENAI_API_KEY exists: {bool(os.getenv('AZURE_OPENAI_API_KEY'))}")
    print(f"AZURE_OPENAI_ENDPOINT: {os.getenv('AZURE_OPENAI_ENDPOINT')}")
    print(f"AZURE_OPENAI_DEPLOYMENT: {os.getenv('AZURE_OPENAI_DEPLOYMENT')}")
    print(f"AZURE_OPENAI_API_VERSION: {os.getenv('AZURE_OPENAI_API_VERSION')}")
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)