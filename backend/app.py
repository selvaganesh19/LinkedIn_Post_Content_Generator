from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Azure OpenAI Configuration - Initialize after app creation
def get_openai_client():
    try:
        return AzureOpenAI(
            api_key=os.getenv('AZURE_OPENAI_API_KEY'),
            api_version=os.getenv('AZURE_OPENAI_API_VERSION'),
            azure_endpoint=os.getenv('AZURE_OPENAI_ENDPOINT'),
        )
    except Exception as e:
        print(f"Failed to initialize OpenAI client: {e}")
        return None

@app.route('/')
def index():
    return jsonify({"message": "LinkedIn Post Generator API", "status": "running"})

@app.route('/generate', methods=['POST'])
def generate_post():
    try:
        client = get_openai_client()
        if not client:
            return jsonify({'error': 'OpenAI client initialization failed'}), 500
        
        data = request.get_json(force=True)  # force parsing
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

        response = client.chat.completions.create(
            model=os.getenv('AZURE_OPENAI_DEPLOYMENT'),
            messages=messages,
            max_tokens=5000,
            temperature=0.9,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        post_content = response.choices[0].message.content
        print("Generated post successfully")
        return jsonify({'post': post_content})

    except Exception as e:
        print(f"[ERROR] Exception in /generate: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)