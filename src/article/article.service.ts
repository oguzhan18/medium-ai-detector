import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

@Injectable()
export class ArticleService implements OnModuleInit {
  private model: use.UniversalSentenceEncoder;

  async onModuleInit() {
    if (!tf.getBackend()) {
      tf.setBackend('node');
      await tf.ready();
    }
    this.loadModel();
  }

  private async loadModel() {
    this.model = await use.load();
    console.log('Model loaded successfully');
  }

  async analyzeArticle(url: string): Promise<string> {
    if (!this.model) {
      await this.loadModel();
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const content = $('article').text();
    const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [];
    const embeddings: any = await this.model.embed(sentences);
    const [similarities, sentenceLengths, words] = await Promise.all([
      this.calculateSimilarities(embeddings),
      this.calculateSentenceLengths(sentences),
      this.extractWords(content)
    ]);

    const meanSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    const lengthVariance = this.calculateLengthVariance(sentenceLengths);
    const vocabRichness = this.calculateVocabularyRichness(words);
    const repetitionRate = this.calculateRepetitionRate(words);
    const aiPercentage = this.determineAIPercentage(meanSimilarity, lengthVariance, vocabRichness, repetitionRate);
    const readablePercentage = `${aiPercentage.toFixed(2)}% written in AI`;

    return readablePercentage;
  }

  calculateSimilarities(embeddings: tf.Tensor2D): number[] {
    const similarities = [];
    const numSentences = embeddings.shape[0];
    
    for (let i = 0; i < numSentences; i++) {
      for (let j = i + 1; j < numSentences; j++) {
        const embeddingI = embeddings.slice([i, 0], [1, -1]) as tf.Tensor;
        const embeddingJ = embeddings.slice([j, 0], [1, -1]) as tf.Tensor;
        const similarity = tf.losses.cosineDistance(
          embeddingI,
          embeddingJ,
          0
        ).dataSync()[0];
        similarities.push(1 - similarity);
      }
    }
    
    return similarities;
  }

  calculateSentenceLengths(sentences: string[]): number[] {
    return sentences.map(sentence => sentence.split(' ').length);
  }

  calculateLengthVariance(sentenceLengths: number[]): number {
    const meanLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    return sentenceLengths.map(len => Math.pow(len - meanLength, 2))
                          .reduce((sum, variance) => sum + variance, 0) / sentenceLengths.length;
  }

  extractWords(content: string): string[] {
    return content.match(/\b\w+\b/g) || [];
  }

  calculateVocabularyRichness(words: string[]): number {
    const uniqueWords = new Set(words).size;
    return uniqueWords / words.length;
  }

  calculateRepetitionRate(words: string[]): number {
    const wordCounts: { [key: string]: number } = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const repeatedWords = Object.values(wordCounts).filter(count => count > 1).length;
    return repeatedWords / words.length;
  }

  determineAIPercentage(meanSimilarity: number, lengthVariance: number, vocabRichness: number, repetitionRate: number): number {
    let aiScore = 0;
 
    if (meanSimilarity > 0.9) {
      aiScore += (meanSimilarity - 0.9) * 100;
    } 
    if (lengthVariance < 20) {
      aiScore += (20 - lengthVariance) * 2.5;
    } 
    if (vocabRichness < 0.3) {
      aiScore += (0.3 - vocabRichness) * 100;
    } 
    if (repetitionRate > 0.05) {
      aiScore += (repetitionRate - 0.05) * 200;
    } 
    return Math.min(Math.max(aiScore, 0), 100);
  }
}
