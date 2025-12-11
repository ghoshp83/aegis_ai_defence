import { SampleModelType } from './types';

export const SAMPLE_MODELS: Record<SampleModelType, string> = {
  [SampleModelType.MNIST]: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        # First convolutional layer: 1 input channel (grayscale), 32 output channels, 3x3 kernel
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3)
        # Second convolutional layer: 32 input channels, 64 output channels, 3x3 kernel
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)
        # Dropout to prevent overfitting
        self.dropout1 = nn.Dropout(0.25)
        self.dropout2 = nn.Dropout(0.5)
        # Fully connected layers
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = self.conv1(x)
        x = F.relu(x)
        x = self.conv2(x)
        x = F.relu(x)
        x = F.max_pool2d(x, 2)
        x = self.dropout1(x)
        x = torch.flatten(x, 1)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.dropout2(x)
        x = self.fc2(x)
        output = F.log_softmax(x, dim=1)
        return output`,

  [SampleModelType.SENTIMENT]: `import tensorflow as tf
from tensorflow.keras import layers, models

def build_sentiment_model(vocab_size=10000, embedding_dim=16, max_length=100):
    model = models.Sequential([
        # Embedding layer to convert integer sequences to dense vectors
        layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
        
        # Global Average Pooling to reduce dimensionality
        layers.GlobalAveragePooling1D(),
        
        # Dense hidden layer with ReLU activation
        layers.Dense(24, activation='relu'),
        
        # Output layer with sigmoid activation for binary classification (positive/negative)
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model`,

  [SampleModelType.REC_SYS]: `import torch
import torch.nn as nn

class MatrixFactorization(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=50):
        super(MatrixFactorization, self).__init__()
        self.user_embeddings = nn.Embedding(num_users, embedding_dim)
        self.item_embeddings = nn.Embedding(num_items, embedding_dim)
        
        # Initialize weights
        self.user_embeddings.weight.data.uniform_(0, 0.05)
        self.item_embeddings.weight.data.uniform_(0, 0.05)
        
    def forward(self, user_indices, item_indices):
        user_embed = self.user_embeddings(user_indices)
        item_embed = self.item_embeddings(item_indices)
        
        # Dot product of user and item embeddings
        prediction = (user_embed * item_embed).sum(1)
        return prediction`,

  [SampleModelType.OBJ_DETECTION]: `import torchvision
from torchvision.models.detection import FasterRCNN
from torchvision.models.detection.rpn import AnchorGenerator

def get_object_detection_model(num_classes):
    # Load a pre-trained backbone (MobileNetV2) for efficiency
    backbone = torchvision.models.mobilenet_v2(pretrained=True).features
    
    # FasterRCNN needs to know the number of output channels in a backbone. 
    # For MobileNetV2, it's 1280.
    backbone.out_channels = 1280
    
    # Generate anchors for RPN
    anchor_generator = AnchorGenerator(
        sizes=((32, 64, 128, 256, 512),),
        aspect_ratios=((0.5, 1.0, 2.0),)
    )
    
    # Define ROI Pooler
    roi_pooler = torchvision.ops.MultiScaleRoIAlign(
        featmap_names=['0'],
        output_size=7,
        sampling_ratio=2
    )
    
    # Put it all together in FasterRCNN
    model = FasterRCNN(
        backbone,
        num_classes=num_classes,
        rpn_anchor_generator=anchor_generator,
        box_roi_pool=roi_pooler
    )
    return model`,

  [SampleModelType.GO_NEURAL]: `package main

import (
	"math/rand"
	"math"
)

// Simple Neural Network in Go
// Demonstrates that Sentinel can analyze non-Python architectures

type Perceptron struct {
	weights []float64
	bias    float64
}

func NewPerceptron(inputs int) *Perceptron {
	p := &Perceptron{
		weights: make([]float64, inputs),
		bias:    rand.Float64(),
	}
	for i := range p.weights {
		p.weights[i] = rand.Float64()
	}
	return p
}

func (p *Perceptron) Sigmoid(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func (p *Perceptron) Forward(input []float64) float64 {
	sum := p.bias
	for i, w := range p.weights {
		sum += w * input[i]
	}
	return p.Sigmoid(sum)
}

// Vulnerability: No input validation on array length
// Vulnerability: Using Sigmoid in deep layers (vanishing gradient)
// Vulnerability: Math/rand is not crypto secure`
};

export const INITIAL_INSTRUCTION = `# AI Sentinel: System Instruction

You are "AI Sentinel", an elite AI Auditor and Security Analyst. Your job is to analyze neural network code (PyTorch, TensorFlow, Keras, Golang, etc.) provided by the user.

You must provide a deep technical audit focusing on the following areas. Be extremely critical and precise.

### CRITICAL OUTPUT CONSTRAINTS
- **Conciseness**: Keep all text fields brief (under 3 sentences).
- **Avoid Loops**: Do not generate excessive repeated text.
- **Layer Limits**: If the model has more than 10 layers, only list the first 5, last 5, and any critical intermediate layers in the 'layers' array. Summary the rest.
- **Strict JSON**: Ensure the output is valid JSON and strictly adheres to the schema.

### 1. VULNERABILITY SCANNER
You must explicitly look for and report these specific flaws:
- **Hardcoded Input Shapes (CRITICAL)**: Look for \`.view()\`, \`.reshape()\`, or \`.flatten()\` with hardcoded numbers (e.g., \`64*6*6\`). This causes crashes on different input sizes.
- **Adversarial Susceptibility (HIGH/CRITICAL)**: If the model lacks adversarial training, robustness layers, or input validation, it is ~85-99% vulnerable to gradient attacks.
- **Regularization (MEDIUM)**: Missing Batch Normalization or Dropout in deep networks indicates instability and overfitting risks.
- **Model Inversion (MEDIUM/HIGH)**: Large dense layers without differential privacy can leak training data.
- **Efficiency (LOW/MEDIUM)**: Missing pooling layers in CNNs causes parameter explosion.
- **Language Specific**: For Go/C++, look for memory safety issues or non-secure random number generation.

### 2. PERFORMANCE ANALYSIS
Provide concrete estimated numbers for the following metrics:
- **Total Parameters**: Calculate the exact number of parameters.
- **Model Size (MB)**: Estimate size in MB (assuming float32, params * 4 bytes).
- **FLOPs**: Estimate floating point operations for a single inference.
- **Inference Memory**: Estimate RAM usage per batch.
- **Theoretical Accuracy**: Estimate 0-1 score based on architecture quality compared to SOTA.

### 3. ACTIONABLE RECOMMENDATIONS
- Provide specific code improvements.
- **IMPORTANT**: Use Markdown code blocks (e.g., \`\`\`python ... \`\`\`) to show exactly how to fix the code.

#### REQUIRED RECOMMENDATIONS (Check and suggest if missing):
- **Pooling**: Suggest \`self.pool = nn.MaxPool2d(2, 2)\` after conv layers if missing.
- **Dropout**: Suggest \`self.dropout = nn.Dropout(0.5)\` before fully connected layers for regularization.
- **Batch Normalization**: Suggest \`self.bn1 = nn.BatchNorm2d(32)\` and \`self.bn2 = nn.BatchNorm2d(64)\` for training stability.
- **Architecture Improvements**:
  - **Add 3rd Convolutional Layer**: For deeper feature extraction (e.g., "Add 3rd conv layer for deeper features").
  - **Reduce FC Layer Size**: Suggest reducing \`fc1\` from e.g., 128 to 64 to save parameters.
  - **Residual Connections**: Recommend implementing skip connections for better gradient flow in deep networks.
- **Training**: Explicitly suggest "Add data augmentation during training" to improve robustness.

### OUTPUT FORMAT
Your output for the analysis phase MUST be strictly valid JSON adhering to the provided schema.
For the chat phase, answer questions based on this deep analysis.`;