# AI Detection API

AI Detection API is a project that analyzes Medium articles to determine the percentage of content that is written by AI. The API uses natural language processing and machine learning techniques to evaluate various metrics and provide an estimate of AI-written content.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/ai-detection-api.git
    cd ai-detection-api
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the application:**

    ```bash
    npm run start
    ```

    The application will start running on [http://localhost:3000](http://localhost:3000).

## Usage

Once the application is running, you can use the API to analyze Medium articles.

### Analyze Article

Send a GET request to `/articles/analyze` with the `url` query parameter containing the Medium article URL you want to analyze.

**Example Request:**

```bash
curl -X GET "http://localhost:3000/articles/analyze?url=https://medium.com/some-article"
```
**Example Response:**
```json
{
  "aiWrittenPercentage": "25.00% written in AI"
}
```

## API Endpoints
* GET /articles/analyze: Analyzes a Medium article and returns the percentage of AI-written content.

## Technology Stack
*  Node.js: JavaScript runtime
* NestJS: Progressive Node.js framework
* TensorFlow.js: Machine learning library for JavaScript
* Universal Sentence Encoder: Pretrained model for sentence embeddings
* Cheerio: Fast, flexible, and lean implementation of core jQuery designed specifically for the server
* Axios: Promise-based HTTP client for the browser and Node.js

## Project Structure
The project structure is as follows:

```text
ai-detection-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── article/
│   │   ├── article.controller.ts
│   │   ├── article.module.ts
│   │   ├── article.service.ts
├── test/
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.json
```